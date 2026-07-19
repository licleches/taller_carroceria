const TRAVERSAL_PATTERNS = [
  /\.\.\//,
  /\.\.\\/,
  /%2e%2e\//i,
  /%c0%ae/i,
  /\.\.\.\//,
  /%252e%252e/i,
  /%c0%ae%c0%ae/i,
];

const SENSITIVE_PATHS = [
  /^\/etc\//,
  /^\/proc\//,
  /^\/sys\//,
  /^\/\.env/,
  /^\/\.git\//,
  /^\/\.svn\//,
  /^\/wp-admin/,
  /^\/administrator/,
  /^\/boot\.ini/,
  /^\/windows\\/i,
];

export function hasTraversal(path: string): boolean {
  return TRAVERSAL_PATTERNS.some((p) => p.test(path));
}

export function isSensitivePath(path: string): boolean {
  return SENSITIVE_PATHS.some((p) => p.test(path));
}

export function sanitizePath(input: string): string | null {
  if (hasTraversal(input) || isSensitivePath(input)) return null;
  return input.replace(/[^a-zA-Z0-9_\-./]/g, "").replace(/\/{2,}/g, "/");
}

export function isAllowedFileType(filename: string, allowedExtensions: string[]): boolean {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext) return false;
  return allowedExtensions.includes(`.${ext}`);
}

export function isAllowedMimeType(mime: string, allowedMimes: string[]): boolean {
  return allowedMimes.includes(mime);
}

export const ALLOWED_UPLOAD_TYPES = [".jpg", ".jpeg", ".png"];
export const ALLOWED_UPLOAD_MIMES = ["image/jpeg", "image/jpg", "image/png"];
