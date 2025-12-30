/**
 * Logger Estruturado para Cloudflare Workers
 *
 * Sistema de logging otimizado para edge computing
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
  component?: string;
}

class WorkerLogger {
  /**
   * Log estruturado em JSON para Cloudflare Logs
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
    component?: string
  ) {
    const entry: any = {
      timestamp: new Date().toISOString(),
      level,
      message
    };

    if (component) {
      entry.component = component;
    }

    if (context && Object.keys(context).length > 0) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }

    // Output JSON estruturado
    console.log(JSON.stringify(entry));
  }

  /**
   * DEBUG: Informações detalhadas para debugging
   */
  debug(message: string, context?: Record<string, any>, component?: string) {
    this.log('debug', message, context, undefined, component);
  }

  /**
   * INFO: Informações gerais sobre o fluxo da aplicação
   */
  info(message: string, context?: Record<string, any>, component?: string) {
    this.log('info', message, context, undefined, component);
  }

  /**
   * WARN: Situações que merecem atenção mas não são erros
   */
  warn(message: string, context?: Record<string, any>, component?: string) {
    this.log('warn', message, context, undefined, component);
  }

  /**
   * ERROR: Erros que precisam ser investigados
   */
  error(message: string, error?: Error, context?: Record<string, any>, component?: string) {
    this.log('error', message, context, error, component);
  }

  /**
   * Cria um logger com componente fixo
   */
  forComponent(component: string): ComponentLogger {
    return new ComponentLogger(this, component);
  }
}

/**
 * Logger com componente fixo
 */
class ComponentLogger {
  constructor(
    private logger: WorkerLogger,
    private component: string
  ) {}

  debug(message: string, context?: Record<string, any>) {
    this.logger.debug(message, context, this.component);
  }

  info(message: string, context?: Record<string, any>) {
    this.logger.info(message, context, this.component);
  }

  warn(message: string, context?: Record<string, any>) {
    this.logger.warn(message, context, this.component);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.logger.error(message, error, context, this.component);
  }
}

/**
 * Singleton instance
 */
export const logger = new WorkerLogger();
