import {
  NotFoundDomainException,
  DomainException,
} from '@/domains/shared/errors/domain.exception';

export class TagNotFoundException extends NotFoundDomainException {
  constructor(tagId: string) {
    super('Tag', tagId);
  }
}

export class TagAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Tag with name '${name}' already exists`, 'TAG_ALREADY_EXISTS');
  }
}
