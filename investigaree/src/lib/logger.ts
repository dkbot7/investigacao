/**
 * Logger Estruturado
 *
 * Sistema de logging com níveis e formatação diferenciada para dev/prod
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

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log interno com formatação baseada no ambiente
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
    component?: string
  ) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
      component
    };

    // Em desenvolvimento: console colorido e formatado
    if (this.isDevelopment) {
      this.logDevelopment(entry);
      return;
    }

    // Em produção: JSON estruturado para agregadores (Datadog, CloudWatch, etc)
    this.logProduction(entry);
  }

  /**
   * Formatação colorida para desenvolvimento
   */
  private logDevelopment(entry: LogEntry) {
    const colors = {
      debug: '\x1b[36m',   // Cyan
      info: '\x1b[32m',    // Green
      warn: '\x1b[33m',    // Yellow
      error: '\x1b[31m'    // Red
    };

    const reset = '\x1b[0m';
    const bold = '\x1b[1m';
    const dim = '\x1b[2m';

    const time = new Date(entry.timestamp).toLocaleTimeString('pt-BR');
    const componentStr = entry.component ? `[${entry.component}]` : '';

    console.log(
      `${dim}${time}${reset} ${colors[entry.level]}${bold}[${entry.level.toUpperCase()}]${reset} ${componentStr} ${entry.message}`
    );

    if (entry.context && Object.keys(entry.context).length > 0) {
      console.log(`${dim}Context:${reset}`, entry.context);
    }

    if (entry.error) {
      console.error(`${colors.error}Error:${reset}`, entry.error);
    }
  }

  /**
   * JSON estruturado para produção
   */
  private logProduction(entry: LogEntry) {
    const logObject: any = {
      timestamp: entry.timestamp,
      level: entry.level,
      message: entry.message
    };

    if (entry.component) {
      logObject.component = entry.component;
    }

    if (entry.context) {
      logObject.context = entry.context;
    }

    if (entry.error) {
      logObject.error = {
        name: entry.error.name,
        message: entry.error.message,
        stack: entry.error.stack
      };
    }

    console.log(JSON.stringify(logObject));
  }

  /**
   * DEBUG: Informações detalhadas para debugging
   * Apenas em desenvolvimento
   */
  debug(message: string, context?: Record<string, any>, component?: string) {
    if (this.isDevelopment) {
      this.log('debug', message, context, undefined, component);
    }
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
   * Útil para evitar repetir o componente em cada log
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
    private logger: Logger,
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
export const logger = new Logger();

/**
 * Exemplos de uso:
 *
 * // Log simples
 * logger.info('Usuário autenticado com sucesso');
 *
 * // Log com contexto
 * logger.info('Investigação criada', { investigationId: '123', cpf: '***' });
 *
 * // Log de erro
 * logger.error('Falha ao buscar dados', error, { endpoint: '/api/data' });
 *
 * // Logger de componente
 * const apiLogger = logger.forComponent('API');
 * apiLogger.info('Request recebida', { method: 'GET', path: '/users' });
 * apiLogger.error('Erro na request', error);
 */
