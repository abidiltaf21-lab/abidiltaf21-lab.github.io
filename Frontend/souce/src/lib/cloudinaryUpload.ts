export interface CloudinaryUploadResponse {
    secure_url: string;
    public_id?: string;
    [key: string]: unknown;
}

export interface CloudinaryUploadCallbacks {
    onProgress?: (percent: number) => void;
    onSuccess: (data: CloudinaryUploadResponse) => void;
    onError: (message: string) => void;
}

export type CloudinaryUploadEndpoint = 'admin' | 'public';

function getApiBaseUrl(): string {
    return (
        import.meta.env.VITE_PRODUCTION_API_URL ||
        import.meta.env.VITE_API_BASE_URL ||
        ''
    ).replace(/\/$/, '');
}

function parseUploadError(xhr: XMLHttpRequest, defaultMsg: string): string {
    let msg = defaultMsg;
    try {
        const err = JSON.parse(xhr.responseText);
        if (err?.cloudinaryBody) {
            try {
                const cloudinaryError = JSON.parse(err.cloudinaryBody);
                msg = `Upload failed: ${cloudinaryError?.error?.message || err.error || msg}`;
            } catch {
                msg = `Upload failed: ${err.cloudinaryBody}`;
            }
        } else if (err?.error) {
            msg = `Upload failed: ${err.error}`;
        }
    } catch {
        // keep generic
    }
    return msg;
}

function tryDirectCloudinaryFallback(
    file: File,
    callbacks: CloudinaryUploadCallbacks
): void {
    const fallback = new FormData();
    fallback.append('file', file);
    fallback.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'smooothpixel_upload');

    const fxhr = new XMLHttpRequest();
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddxrpqctk';
    fxhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);
    fxhr.onload = () => {
        if (fxhr.status === 200) {
            try {
                const data = JSON.parse(fxhr.responseText) as CloudinaryUploadResponse;
                if (data?.secure_url) {
                    callbacks.onSuccess(data);
                    return;
                }
            } catch {
                // fall through
            }
        }
        callbacks.onError(
            'Upload failed: backend unreachable AND direct Cloudinary upload failed. Check your network and Cloudinary config.'
        );
    };
    fxhr.onerror = () => {
        callbacks.onError('Upload failed: could not reach backend or Cloudinary.');
    };
    fxhr.send(fallback);
}

/**
 * Upload a file to Cloudinary via the backend, with direct Cloudinary fallback.
 * Mirrors the upload flow used in ProjectForm (Project Manager).
 */
export function uploadToCloudinary(
    file: File,
    callbacks: CloudinaryUploadCallbacks,
    endpoint: CloudinaryUploadEndpoint = 'admin'
): void {
    callbacks.onProgress?.(10);

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    const apiBaseUrl = getApiBaseUrl();
    const uploadPath = endpoint === 'public' ? '/cloudinary/upload-public' : '/cloudinary/upload';
    xhr.open('POST', `${apiBaseUrl}${uploadPath}`);

    if (endpoint === 'admin') {
        const token = localStorage.getItem('adminToken');
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            callbacks.onProgress?.(percentComplete);
        }
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            let data: CloudinaryUploadResponse | null = null;
            try {
                data = JSON.parse(xhr.responseText);
            } catch {
                data = null;
            }
            if (data?.secure_url) {
                callbacks.onSuccess(data);
            } else {
                callbacks.onError('Upload failed: unexpected response from server.');
            }
        } else if (xhr.status === 401) {
            callbacks.onError('Upload failed: not authorized. Please log in again.');
        } else if (xhr.status === 503) {
            callbacks.onError(
                'Upload failed: Cloudinary is not configured on the server. Set Cloudinary__* env vars in Backend/appsettings.'
            );
        } else {
            callbacks.onError(parseUploadError(xhr, `Upload failed (HTTP ${xhr.status})`));
        }
        callbacks.onProgress?.(0);
    };

    xhr.onerror = () => {
        tryDirectCloudinaryFallback(file, {
            onSuccess: (data) => {
                callbacks.onProgress?.(0);
                callbacks.onSuccess(data);
            },
            onError: (msg) => {
                callbacks.onProgress?.(0);
                callbacks.onError(msg);
            },
        });
    };

    xhr.send(formData);
}
