// supabase/functions/_shared/log.ts

type LogLevel = "info" | "warn" | "error";

export function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const base = { timestamp, level, message };
  if (meta) {
    console.log(JSON.stringify({ ...base, ...meta }));
  } else {
    console.log(JSON.stringify(base));
  }
}

export const logInfo = (msg: string, meta?: Record<string, unknown>) => log("info", msg, meta);
export const logWarn = (msg: string, meta?: Record<string, unknown>) => log("warn", msg, meta);
export const logError = (msg: string, meta?: Record<string, unknown>) => log("error", msg, meta);
