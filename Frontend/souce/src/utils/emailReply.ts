export interface EmailReplyContext {
    email: string;
    name: string;
    message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function buildReplyEmailContent(req: EmailReplyContext) {
    const subject = 'Re: Your inquiry - SmooothPixel';
    const body = [
        `Hi ${req.name.trim() || 'there'},`,
        '',
        'Thank you for contacting SmooothPixel.',
        '',
        '---',
        'Your message:',
        req.message.trim(),
        '',
    ].join('\n');
    return { subject, body };
}

export function buildMailtoUrl(to: string, subject: string, body: string): string {
    const email = to.trim();
    const params = new URLSearchParams();
    params.set('subject', subject);
    params.set('body', body);
    return `mailto:${email}?${params.toString()}`;
}

export function buildGmailComposeUrl(to: string, subject: string, body: string): string {
    const params = new URLSearchParams({
        view: 'cm',
        fs: '1',
        to: to.trim(),
        su: subject,
        body,
    });
    return `https://mail.google.com/mail/?${params.toString()}`;
}

/** Opens the system mail client; returns Gmail URL for fallback. */
export function openReplyByEmail(req: EmailReplyContext): { ok: boolean; gmailUrl?: string; error?: string } {
    const to = req.email.trim();
    if (!to || !EMAIL_RE.test(to)) {
        return { ok: false, error: 'Invalid client email address.' };
    }

    const { subject, body } = buildReplyEmailContent(req);
    const mailtoUrl = buildMailtoUrl(to, subject, body);
    const gmailUrl = buildGmailComposeUrl(to, subject, body);

    try {
        const link = document.createElement('a');
        link.href = mailtoUrl;
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch {
        return { ok: false, gmailUrl, error: 'Could not open your email app.' };
    }

    return { ok: true, gmailUrl };
}
