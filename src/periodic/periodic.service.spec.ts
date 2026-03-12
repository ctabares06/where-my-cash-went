import { Test, TestingModule } from '@nestjs/testing';
import { PeriodicService } from './periodic.service';
import {
  PeriodicDomain,
  CreatePeriodicDomain,
  UpdatePeriodicDomain,
} from './periodic.domain';
import { TransactionDomain } from 'src/transaction/transactions.domain';
import { CreatePeriodicDto, UpdatePeriodicDto } from './periodic.dto';
import { Cycle_T } from 'src/lib/ormClient/enums';

describe('PeriodicService - UT', () => {
  let service: PeriodicService;
  let periodicDomain: PeriodicDomain;
  let transactionDomain: TransactionDomain;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeriodicService,
        {
          provide: PeriodicDomain,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getOne: jest.fn(),
            getAll: jest.fn(),
            getWithTransactionAndTagLteDate: jest.fn(),
          },
        },
        {
          provide: TransactionDomain,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PeriodicService>(PeriodicService);
    periodicDomain = module.get<PeriodicDomain>(PeriodicDomain);
    transactionDomain = module.get<TransactionDomain>(TransactionDomain);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should calculate next occurrence and call domain.create', async () => {
      const dto: CreatePeriodicDto = {
        cycle: Cycle_T.daily,
        startDate: new Date('2026-03-12'),
        duration: 1,
        transactionId: 'tx1',
      } as any;

      const domainCreate = jest
        .spyOn(periodicDomain, 'create')
        .mockResolvedValue({} as any);

      await service.create(dto);

      expect(domainCreate).toHaveBeenCalledWith(
        dto as CreatePeriodicDomain,
        expect.any(Date),
      );
    });
  });

  describe('update', () => {
    it('should call domain.update with computed next date', async () => {
      const dto: UpdatePeriodicDto = { cycle: Cycle_T.weekly } as any;
      const current = {
        cycle: Cycle_T.weekly,
        nextOcurrence: new Date('2026-03-10'),
      } as any;
      jest.spyOn(periodicDomain, 'getOne').mockResolvedValue(current);
      const domainUpdate = jest
        .spyOn(periodicDomain, 'update')
        .mockResolvedValue({} as any);

      await service.update(dto, 'p1', 'user1');
      expect(domainUpdate).toHaveBeenCalledWith(
        dto as UpdatePeriodicDomain,
        'p1',
        expect.any(Date),
      );
    });
  });

  describe('createScheduleTransaction', () => {
    it('should delegate to periodicDomain and transactionDomain correctly', async () => {
      const now = new Date();
      const periodic = {
        id: 'p1',
        cycle: Cycle_T.daily,
        nextOcurrence: now,
        duration: 1,
        transaction: {
          userId: 'u1',
          quantity: 10,
          description: 'desc',
          tagsOnTransactions: [{ tagId: 't1', transactionId: 'tx' }],
        },
      } as any;
      jest
        .spyOn(periodicDomain, 'getWithTransactionAndTagLteDate')
        .mockResolvedValue([periodic]);
      const txCreate = jest
        .spyOn(transactionDomain, 'create')
        .mockResolvedValue({ id: 'new' } as any);
      const periodicUpdate = jest
        .spyOn(periodicDomain, 'update')
        .mockResolvedValue({ id: 'p1', nextOcurrence: new Date() } as any);

      await service.createScheduleTransaction();

      expect(txCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: periodic.transaction.userId,
        }),
        periodic.transaction.userId,
      );
      expect(periodicUpdate).toHaveBeenCalledWith({}, 'p1', expect.any(Date));
    });
  });
});
