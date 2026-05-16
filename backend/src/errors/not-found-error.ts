import HttpError from './http-error';

export default class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, 404);
  }
}
