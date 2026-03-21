import {
  NotFoundDomainException,
  DomainException,
} from '../../shared/errors/domain.exception';

export class TransactionNotFoundException extends NotFoundDomainException {
  constructor(transactionId: string) {
    super('Transaction', transactionId);
  }
}

export class TransactionValidationException extends DomainException {
  constructor(message: string) {
    super(message, 'TRANSACTION_VALIDATION_ERROR');
  }
}
