// Common disposable/temporary email providers. Not exhaustive - just
// filters out the domains people commonly reach for to dodge a mailing
// list without giving a real inbox.
const DISPOSABLE_EMAIL_DOMAINS = new Set([
    'mailinator.com',
    'tempmail.com',
    'temp-mail.org',
    'temp-mail.io',
    'tempmailo.com',
    'tmpmail.net',
    'tmpmail.org',
    '10minutemail.com',
    '10minutemail.net',
    'guerrillamail.com',
    'guerrillamail.info',
    'guerrillamail.biz',
    'guerrillamail.de',
    'guerrillamail.net',
    'guerrillamail.org',
    'grr.la',
    'sharklasers.com',
    'yopmail.com',
    'yopmail.net',
    'throwawaymail.com',
    'trashmail.com',
    'trashmail.net',
    'fakeinbox.com',
    'getnada.com',
    'dispostable.com',
    'maildrop.cc',
    'mintemail.com',
    'moakt.com',
    'mytemp.email',
    'discard.email',
    'tempinbox.com',
    'spamgourmet.com',
    'mailnesia.com',
    'mohmal.com',
    'emailondeck.com',
    'pokemail.net',
    'spam4.me',
    'byom.de',
    'chacuo.net',
    'dropmail.me',
    'mailcatch.com',
    'mail-temp.com',
    'luxusmail.org',
    'inboxbear.com',
    'tmail.ws',
    'burnermail.io',
    'harakirimail.com',
    'jetable.org',
    'spambog.com',
    'tempr.email',
    'nada.email',
    'fakemailgenerator.com',
    'crazymailing.com',
]);

const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmailFormat(email: string): boolean {
    return EMAIL_FORMAT_REGEX.test(email.trim());
}

export function isDisposableEmail(email: string): boolean {
    const domain = email.trim().toLowerCase().split('@')[1];
    return !!domain && DISPOSABLE_EMAIL_DOMAINS.has(domain);
}
