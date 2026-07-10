const SQLI_PATTERNS = [
  /(\bSELECT\b.*\bFROM\b)/i,
  /(\bUNION\b.*\bSELECT\b)/i,
  /(\bINSERT\b.*\bINTO\b)/i,
  /(\bDELETE\b.*\bFROM\b)/i,
  /(\bDROP\b.*\bTABLE\b)/i,
  /('|")\s*(OR|AND)\s*('|")\s*(=|!=)/i,
  /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/i,
  /--\s*$/m,
  /\/\*.*\*\//,
  /(\bSLEEP\b|\bBENCHMARK\b)\s*\(/i,
  /(\bEXEC\b|\bEXECUTE\b)\s*\(/i,
  /(\bINFORMATION_SCHEMA\b)/i,
  /(\bPG_SLEEP\b)/i,
];

const XSS_PATTERNS = [
  /<script[\s>/]/i,
  /javascript\s*:/i,
  /onerror\s*=/i,
  /onload\s*=/i,
  /onclick\s*=/i,
  /onmouseover\s*=/i,
  /onfocus\s*=/i,
  /<iframe[\s>/]/i,
  /<img[\s>][^>]*onerror/i,
  /alert\s*\(/i,
  /eval\s*\(/i,
  /document\.cookie/i,
  /String\.fromCharCode/i,
  /<svg[\s>]/i,
  /<body[\s>]/i,
  /<input[\s>]/i,
];

const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//,
  /\.\.\\/,
  /%2e%2e\//i,
  /%c0%ae/i,
  /\.\.\.\//,
  /\.\.\\/,
];

const COMMAND_INJECTION_PATTERNS = [
  /;\s*(rm|cat|whoami|id|ls|pwd|wget|curl|bash|sh|powershell|cmd|nc|netcat)\b/i,
  /\|\s*(rm|cat|whoami|id|ls|pwd|wget|curl|bash|sh|powershell|cmd|nc|netcat)\b/i,
  /`.*`/,
  /\$\(.*\)/,
  /\|\|.*(rm|cat|whoami|id|ls|pwd|wget|curl|bash|sh|powershell|cmd)\b/i,
];

export interface DetectionResult {
  isAttack: boolean;
  types: string[];
}

export function detectAttack(input: string): DetectionResult {
  const types: string[] = [];
  if (SQLI_PATTERNS.some((p) => p.test(input))) types.push("SQL Injection");
  if (XSS_PATTERNS.some((p) => p.test(input))) types.push("XSS");
  if (PATH_TRAVERSAL_PATTERNS.some((p) => p.test(input))) types.push("Path Traversal");
  if (COMMAND_INJECTION_PATTERNS.some((p) => p.test(input))) types.push("Command Injection");
  return { isAttack: types.length > 0, types };
}

const requestTimestamps: Map<string, number[]> = new Map();
const FLOOD_WINDOW = 15000;
const FLOOD_MAX = 10;

export function detectFlood(ip: string): { blocked: boolean } {
  const now = Date.now();
  const timestamps = requestTimestamps.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < FLOOD_WINDOW);
  recent.push(now);
  requestTimestamps.set(ip, recent);
  return { blocked: recent.length > FLOOD_MAX };
}

const pathHistory: Map<string, { paths: Set<string>; timer: ReturnType<typeof setTimeout> }> = new Map();
const ENUM_WINDOW = 15000;
const ENUM_MAX = 6;

export function detectEnumeration(ip: string, path: string): { blocked: boolean } {
  let record = pathHistory.get(ip);
  if (!record) {
    record = { paths: new Set(), timer: setTimeout(() => pathHistory.delete(ip), ENUM_WINDOW) };
    pathHistory.set(ip, record);
  }
  record.paths.add(path);
  return { blocked: record.paths.size > ENUM_MAX };
}

const failedLogins: Map<string, { count: number; firstAttempt: number }> = new Map();
const BF_WINDOW = 60000;
const BF_MAX = 5;

export function detectBruteForce(ip: string): { blocked: boolean } {
  const now = Date.now();
  const record = failedLogins.get(ip);
  if (!record || now - record.firstAttempt > BF_WINDOW) {
    failedLogins.set(ip, { count: 1, firstAttempt: now });
    return { blocked: false };
  }
  record.count++;
  return { blocked: record.count > BF_MAX };
}

export function resetBruteForce(ip: string): void {
  failedLogins.delete(ip);
}

export function getAttackStats(): {
  totalTracked: number;
  blockedFloods: number;
  blockedEnums: number;
  blockedBF: number;
  activeIPs: number;
} {
  return {
    totalTracked: requestTimestamps.size + pathHistory.size + failedLogins.size,
    blockedFloods: requestTimestamps.size,
    blockedEnums: pathHistory.size,
    blockedBF: failedLogins.size,
    activeIPs: new Set([
      ...requestTimestamps.keys(),
      ...pathHistory.keys(),
      ...failedLogins.keys(),
    ]).size,
  };
}
