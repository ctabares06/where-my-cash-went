/**
 * Base Domain Exception - Framework agnostic
 */
export abstract class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundDomainException extends DomainException {
  constructor(entity: string, id: string) {
    super(`${entity} with id '${id}' not found`, 'NOT_FOUND');
  }
}

export class UnauthorizedDomainException extends DomainException {
  constructor(
    message: string = 'User is not authorized to perform this action',
  ) {
    super(message, 'UNAUTHORIZED');
  }
}

export class ValidationDomainException extends DomainException {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}
