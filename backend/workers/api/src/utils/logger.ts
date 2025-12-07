// ============================================================================
// LOGGER UTILITY
// Agent 2 - Backend Engineer
// Simple logging utility for Cloudflare Workers
// ============================================================================

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

/**
 * Simple logger for Cloudflare Workers
 * Outputs JSON logs for easy parsing in Wrangler Tail
 */
export class Logger {
  private context: string;

  constructor(context: string = 'API') {
    this.context = context;
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message: `[${this.context}] ${message}`,
      timestamp: new Date().toISOString(),
      data,
    };

    // In production, you might want to send these to a logging service
    // For now, just console output (visible in wrangler tail)
    switch (level) {
      case 'error':
        console.error(JSON.stringify(entry));
        break;
      case 'warn':
        console.warn(JSON.stringify(entry));
        break;
      case 'debug':
        console.debug(JSON.stringify(entry));
        break;
      default:
        console.log(JSON.stringify(entry));
    }
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }
}

// Export a default logger instance
export const logger = new Logger('Investigaree');
