export function parseUserAgent(ua: string): { client: string; os: string } {
  let client = "Desconocido";
  let os = "";

  const browsers = [
    { p: /Edg\/([\d.]+)/, n: "Edge" },
    { p: /Chrome\/([\d.]+)/, n: "Chrome" },
    { p: /Firefox\/([\d.]+)/, n: "Firefox" },
    { p: /Safari\/([\d.]+)/, n: "Safari" },
    { p: /Opera\/([\d.]+)/, n: "Opera" },
    { p: /OPR\/([\d.]+)/, n: "Opera" },
  ];
  for (const b of browsers) {
    const m = ua.match(b.p);
    if (m) {
      client = `${b.n} ${m[1]}`;
      break;
    }
  }

  const tools = [
    { p: /sqlmap/i, n: "sqlmap" },
    { p: /nikto/i, n: "nikto" },
    { p: /curl\/([\d.]+)/, n: "curl" },
    { p: /Wget\/([\d.]+)/, n: "Wget" },
    { p: /PostmanRuntime/i, n: "Postman" },
    { p: /python-requests/i, n: "Python Requests" },
    { p: /Go-http-client/i, n: "Go HTTP Client" },
    { p: /Nmap/i, n: "Nmap" },
    { p: /acunetix/i, n: "Acunetix" },
  ];
  for (const t of tools) {
    if (t.p.test(ua)) {
      client = t.n;
      break;
    }
  }

  const oss = [
    { p: /Windows NT ([\d.]+)/, n: (v: string) => `Windows ${v}` },
    { p: /Mac OS X ([\d_]+)/, n: (v: string) => `macOS ${v.replace(/_/g, ".")}` },
    { p: /Android ([\d.]+)/, n: (v: string) => `Android ${v}` },
    { p: /iPhone OS ([\d_]+)/, n: (v: string) => `iOS ${v.replace(/_/g, ".")}` },
    { p: /Linux/, n: () => "Linux" },
  ];
  for (const o of oss) {
    const m = ua.match(o.p);
    if (m) {
      os = o.n(m[1] || "");
      break;
    }
  }

  return { client, os };
}

export function getRequestMeta(): {
  client: string;
  os: string;
  userAgent: string;
  referer: string | undefined;
  resource: string;
} {
  const ua = navigator.userAgent;
  const { client, os } = parseUserAgent(ua);
  return {
    client: client ? `${client} — ${os}` : os,
    os,
    userAgent: ua,
    referer: document.referrer || undefined,
    resource: window.location.pathname + window.location.search,
  };
}

export function normalizeIP(ip: string): string {
  if (!ip || ip === "::1" || ip === "::ffff:127.0.0.1" || ip === "127.0.0.1") {
    return "localhost";
  }
  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }
  return ip;
}

let ipPromise: Promise<string> | null = null;

async function fetchPublicIP(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    return normalizeIP(data.ip);
  } catch {
    return "unknown";
  }
}

export function getClientIP(): Promise<string> {
  if (!ipPromise) {
    ipPromise = fetchPublicIP().finally(() => { ipPromise = null; });
  }
  return ipPromise;
}
