import DOMPurify from 'dompurify';

class SanitizationService {
  sanitize(html: string): string {
    return DOMPurify.sanitize(html);
  }
}

export const sanitizationService = new SanitizationService();