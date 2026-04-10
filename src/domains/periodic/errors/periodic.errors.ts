import {
  NotFoundDomainException,
  DomainException,
} from '@/domains/shared/errors/domain.exception';

export class PeriodicNotFoundException extends NotFoundDomainException {
  constructor(periodicId: string) {
    super('Periodic', periodicId);
  }
}

export class PeriodicValidationException extends DomainException {
  constructor(message: string) {
    super(message, 'PERIODIC_VALIDATION_ERROR');
  }
}
