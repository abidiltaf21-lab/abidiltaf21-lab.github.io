/** Normalize user input to a t.me URL, or null if empty/invalid. */
export function toTelegramUrl(value?: string | null): string | null {
    if (!value?.trim()) return null;
    let handle = value.trim();
    if (handle.startsWith('https://t.me/')) handle = handle.slice('https://t.me/'.length);
    else if (handle.startsWith('http://t.me/')) handle = handle.slice('http://t.me/'.length);
    else if (handle.toLowerCase().startsWith('t.me/')) handle = handle.slice('t.me/'.length);
    if (handle.startsWith('@')) handle = handle.slice(1);
    const slash = handle.indexOf('/');
    if (slash >= 0) handle = handle.slice(0, slash);
    handle = handle.trim();
    if (!handle || !/^[a-zA-Z0-9_]{1,32}$/.test(handle)) return null;
    return `https://t.me/${handle}`;
}

export function normalizeTelegramHandle(value?: string | null): string | undefined {
    const url = toTelegramUrl(value);
    if (!url) return undefined;
    return url.replace('https://t.me/', '');
}
