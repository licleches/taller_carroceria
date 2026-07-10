const LOGS_KEY = "dj_logs";
const MAX_LOGS = 500;

export interface LogEntry {
  timestamp: string;
  eventId: string;
  category: "AUTH" | "AUTHZ" | "ADMIN" | "ERROR" | "VISIT" | "ATTACK";
  severity: "INFO" | "WARNING" | "ERROR";
  user: string;
  role?: string;
  ip: string;
  client?: string;
  userAgent?: string;
  referer?: string;
  method: string;
  resource: string;
  statusCode: number;
  attackTypes?: string[];
  message: string;
}

type LogInput = Omit<LogEntry, "timestamp" | "eventId">;

const SANITIZE_PATTERNS = [
  /password=([^&\s]+)/gi,
  /token=([^&\s]+)/gi,
  /cvv=([^&\s]+)/gi,
  /secret=([^&\s]+)/gi,
  /api[_-]?key=([^&\s]+)/gi,
  /authorization:\s*\S+/gi,
  /bearer\s+\S+/gi,
];

function sanitize(input: string): string {
  let result = input;
  for (const p of SANITIZE_PATTERNS) {
    result = result.replace(p, (m) => m.replace(/=.*/, "=***").replace(/\s+\S+$/, " ***"));
  }
  return result;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getLogsFromStorage(): LogEntry[] {
  try {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLogsToStorage(logs: LogEntry[]): void {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      const trimmed = logs.slice(0, 250);
      localStorage.setItem(LOGS_KEY, JSON.stringify(trimmed));
    }
  }
}

export function logEvent(input: LogInput): void {
  const entry: LogEntry = {
    ...input,
    timestamp: new Date().toISOString(),
    eventId: generateId(),
    message: sanitize(input.message),
  };
  const logs = getLogsFromStorage();
  logs.unshift(entry);
  if (logs.length > MAX_LOGS) logs.length = MAX_LOGS;
  saveLogsToStorage(logs);
}

export function getLogs(): LogEntry[] {
  return getLogsFromStorage();
}

export function clearLogs(): void {
  localStorage.removeItem(LOGS_KEY);
}
