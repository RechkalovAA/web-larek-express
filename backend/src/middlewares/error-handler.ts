import type { ErrorRequestHandler } from 'express';

import HttpError from '../errors/http-error';
import apiErrorBody from '../utils/api-error-body';

function isClientError(err: unknown): err is { statusCode: number; message: string } {
  return (
    typeof err === 'object'
    && err !== null
    && 'statusCode' in err
    && typeof (err as { statusCode: unknown }).statusCode === 'number'
    && 'message' in err
    && typeof (err as { message: unknown }).message === 'string'
  );
}

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof HttpError || isClientError(err)) {
    res.status(err.statusCode).json(apiErrorBody(err.message));
    return;
  }

  res.status(500).json(apiErrorBody('Внутренняя ошибка сервера'));
};

export default errorHandler;
