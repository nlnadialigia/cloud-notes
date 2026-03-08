export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  context: string
  message: string
  data?: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatLog(level: LogLevel, context: string, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      ...(data && { data }),
    }
  }

  private printLog(entry: LogEntry) {
    if (!this.isDevelopment && entry.level === LogLevel.DEBUG) {
      return
    }

    const color = {
      [LogLevel.ERROR]: '\x1b[31m',
      [LogLevel.WARN]: '\x1b[33m',
      [LogLevel.INFO]: '\x1b[36m',
      [LogLevel.DEBUG]: '\x1b[90m',
    }[entry.level]

    const reset = '\x1b[0m'

    console.log(
      `${color}[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.context}]${reset} ${entry.message}`,
      entry.data ? entry.data : ''
    )
  }

  info(context: string, message: string, data?: any) {
    const entry = this.formatLog(LogLevel.INFO, context, message, data)
    this.printLog(entry)
  }

  error(context: string, message: string, error?: any) {
    const entry = this.formatLog(LogLevel.ERROR, context, message, {
      error: error?.message || error,
      stack: error?.stack,
    })
    this.printLog(entry)
  }

  warn(context: string, message: string, data?: any) {
    const entry = this.formatLog(LogLevel.WARN, context, message, data)
    this.printLog(entry)
  }

  debug(context: string, message: string, data?: any) {
    const entry = this.formatLog(LogLevel.DEBUG, context, message, data)
    this.printLog(entry)
  }
}

export const logger = new Logger()
