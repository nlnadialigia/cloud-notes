import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common'

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string

  setContext(context: string) {
    this.context = context
  }

  log(message: string, context?: string) {
    this.printLog(LogLevel.INFO, message, context)
  }

  error(message: string, trace?: string, context?: string) {
    this.printLog(LogLevel.ERROR, message, context, trace)
  }

  warn(message: string, context?: string) {
    this.printLog(LogLevel.WARN, message, context)
  }

  debug(message: string, context?: string) {
    this.printLog(LogLevel.DEBUG, message, context)
  }

  private printLog(level: LogLevel, message: string, context?: string, trace?: string) {
    const timestamp = new Date().toISOString()
    const ctx = context || this.context || 'Application'
    
    const color = {
      [LogLevel.ERROR]: '\x1b[31m',
      [LogLevel.WARN]: '\x1b[33m',
      [LogLevel.INFO]: '\x1b[36m',
      [LogLevel.DEBUG]: '\x1b[90m',
    }[level]

    const reset = '\x1b[0m'
    const bold = '\x1b[1m'

    console.log(
      `${color}${bold}[${level.toUpperCase()}]${reset} ${color}[${ctx}]${reset} ${message}`
    )

    if (trace && level === LogLevel.ERROR) {
      console.log(`${color}${trace}${reset}`)
    }
  }
}
