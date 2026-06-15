import type { ClientRequest } from '../hooks/useRequests';

/** Full PUT body for APIs that still bind ClientRequest with required fields. */
export function buildLegacyInboxPutBody(
    current: ClientRequest,
    patch: { status?: string; internalNotes?: string; isRead?: boolean }
) {
    return {
        name: current.name,
        email: current.email,
        message: current.message,
        status: patch.status ?? current.status,
        internalNotes: patch.internalNotes !== undefined ? patch.internalNotes : current.internalNotes ?? null,
        isRead: patch.isRead !== undefined ? patch.isRead : current.isRead ?? false,
        phone: current.phone ?? null,
        telegram: current.telegram ?? null,
        budgetRange: current.budgetRange ?? null,
    };
}

/** Partial PATCH-style body for updated API (UpdateClientRequestDto). */
export function buildInboxPatchBody(patch: {
    status?: string;
    internalNotes?: string;
    isRead?: boolean;
}) {
    const body: Record<string, string | boolean> = {};
    if (patch.status !== undefined) body.status = patch.status;
    if (patch.internalNotes !== undefined) body.internalNotes = patch.internalNotes;
    if (patch.isRead !== undefined) body.isRead = patch.isRead;
    return body;
}
