export class LitManagerExceptions extends Error {
  public static DATABASE_ERROR = 'There has been an error with the Litt Source';
  public static NOT_FOUND = 'The resource was not found';
  public static WRONG_PARAMS = 'Cannot provide empty params';
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, LitManagerExceptions.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
