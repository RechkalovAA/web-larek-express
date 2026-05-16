import path from 'path';

import expressWinston from 'express-winston';
import winston from 'winston';

const backendRoot = path.join(__dirname, '..', '..');

/** Безопасная мета для errorLogger вместо дефолтного ExceptionHandler winston. */
function exceptionToMeta(err: Error): Record<string, unknown> {
  const meta: Record<string, unknown> = {
    name: err.name,
    message: err.message,
    stack: err.stack,
  };
  if ('statusCode' in err && typeof (err as { statusCode?: unknown }).statusCode === 'number') {
    meta.statusCode = (err as { statusCode: number }).statusCode;
  }
  return meta;
}

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(backendRoot, 'request.log'),
    }),
  ],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(backendRoot, 'error.log'),
    }),
  ],
  format: winston.format.json(),
  exceptionToMeta,
});
