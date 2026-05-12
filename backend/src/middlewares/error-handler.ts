import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

import HttpError from '../errors/http-error';
import apiErrorBody from '../utils/api-error-body';

function isDuplicateKeyError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  if ('code' in err && (err as { code: number }).code === 11000) return true;
  return err instanceof Error && err.message.includes('E11000');
}

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json(apiErrorBody(err.message));
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json(apiErrorBody(err.message));
    return;
  }

  if (isDuplicateKeyError(err)) {
    const message = err instanceof Error ? err.message : 'Товар с таким названием уже существует';
    res.status(409).json(apiErrorBody(message));
    return;
  }

  res.status(500).json(apiErrorBody('Внутренняя ошибка сервера'));
};

export default errorHandler;
