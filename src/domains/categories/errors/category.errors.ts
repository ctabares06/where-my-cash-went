import {
  NotFoundDomainException,
  DomainException,
} from '../../shared/errors/domain.exception';

export class CategoryNotFoundException extends NotFoundDomainException {
  constructor(categoryId: string) {
    super('Category', categoryId);
  }
}

export class CategoryAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(
      `Category with name '${name}' already exists`,
      'CATEGORY_ALREADY_EXISTS',
    );
  }
}

export class CategoryUnauthorizedException extends DomainException {
  constructor() {
    super(
      'User is not authorized to access this category',
      'CATEGORY_UNAUTHORIZED',
    );
  }
}
