export const INBOX_UPDATED_EVENT = 'smooothpixel-inbox-updated';

export function notifyInboxUpdated() {
    window.dispatchEvent(new Event(INBOX_UPDATED_EVENT));
}
