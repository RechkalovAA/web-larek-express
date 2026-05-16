import HttpError from './http-error';

export default class ConflictError extends HttpError {
  constructor(message: string) {
    super(message, 409);
  }
}
