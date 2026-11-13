export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    if (
      'captureStackTrace' in Error &&
      typeof (Error as unknown as { captureStackTrace?: Function }).captureStackTrace ===
        'function'
    ) {
      (
        Error as unknown as {
          captureStackTrace: (target: object, constructorOpt?: Function) => void;
        }
      ).captureStackTrace(this, this.constructor);
    }
  }
}
