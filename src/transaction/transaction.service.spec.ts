import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import {
  GetOneTransactionSelectPayload,
  TransactionDomain,
} from './transactions.domain';
import { Prisma } from '../lib/ormClient/client';
import { CreateTransactionDto, UpdateTransactionDto } from './transaction.dto';
import { Transaction_T } from '../lib/ormClient/enums';
import { InternalServerErrorException } from '@nestjs/common';

describe('TransactionService - UT', () => {
  let service: TransactionService;
  let domain: TransactionDomain;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionDomain,
          useValue: {
            create: jest.fn(),
            getMany: jest.fn(),
            getOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deleteTransactionTags: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    domain = module.get<TransactionDomain>(TransactionDomain);
  });

  describe('create', () => {
    it('should delegate to domain.create for single item', async () => {
      const createSingle: CreateTransactionDto = {
        quantity: 100,
        description: 'test',
        transactionType: 'income',
      };

      const domainCreate = jest.spyOn(domain, 'create');

      await service.create(createSingle, 'u');
      expect(domainCreate).toHaveBeenCalledWith(createSingle, 'u');
    });

    it('should remove transactionType when categoryId provided', async () => {
      const dto: CreateTransactionDto = {
        quantity: 50,
        description: 'with cat',
        transactionType: Transaction_T.expense,
        categoryId: 'cat1',
      };

      const expected = { ...dto, transactionType: undefined };

      const domainCreate = jest.spyOn(domain, 'create');

      await service.create(dto, 'u');
      expect(domainCreate).toHaveBeenCalledWith(expected, 'u');
    });

    it('should handle array creation', async () => {
      const dtos: CreateTransactionDto[] = [
        {
          quantity: 10,
          description: 'a',
          transactionType: Transaction_T.income,
        },
        {
          quantity: 20,
          description: 'b',
          transactionType: Transaction_T.expense,
          categoryId: 'c',
        },
      ];

      const domainCreate = jest
        .spyOn(domain, 'create')
        .mockResolvedValue({} as never);

      const result = await service.create(dtos, 'u');
      expect(Array.isArray(result)).toBe(true);
      expect(domainCreate).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });

    it('should wrap prisma errors in InternalServerErrorException', async () => {
      const dto: CreateTransactionDto = {
        quantity: 5,
        description: 'error',
        transactionType: Transaction_T.income,
      };
      const prismaError = new Prisma.PrismaClientKnownRequestError('fail', {
        code: 'P2002',
        clientVersion: '',
      });
      const domainCreate = jest
        .spyOn(domain, 'create')
        .mockRejectedValue(prismaError);

      await expect(service.create(dto, 'u')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(domainCreate).toHaveBeenCalledWith(dto, 'u');
    });
  });

  describe('findAll', () => {
    it('should forward parameters', async () => {
      const list = [{ id: '1' }];
      const domainGetMany = jest
        .spyOn(domain, 'getMany')
        .mockResolvedValue(list as any);

      const res = await service.findAll('u', 10, 0);
      expect(res).toEqual(list);
      expect(domainGetMany).toHaveBeenCalledWith('u', 10, 0);
    });
  });

  describe('findOne', () => {
    it('should call domain.getOne', async () => {
      const item = { id: '1' };
      const domainGetOne = jest
        .spyOn(domain, 'getOne')
        .mockResolvedValue(item as any);

      const res = await service.findOne('1', 'u');
      expect(res).toEqual(item);
      expect(domainGetOne).toHaveBeenCalledWith('1', 'u');
    });
  });

  describe('update', () => {
    it('should clear transactionType if categoryId provided or existing', async () => {
      const getOneRes: GetOneTransactionSelectPayload = {
        id: '1',
        userId: 'u',
        categoryId: 'c1',
        transactionType: 'income',
        description: 'test',
        quantity: 1,
        createdAt: new Date(),
        updateAt: new Date(),
      };

      const expectedRes: UpdateTransactionDto = {
        categoryId: 'a',
        transactionType: undefined,
      };

      jest.spyOn(domain, 'getOne').mockResolvedValue(getOneRes);
      const domainUpdate = jest.spyOn(domain, 'update');

      await service.update('i', expectedRes, 'u');
      expect(domainUpdate).toHaveBeenCalledWith(expectedRes);
    });

    it('should keep existing categoryId when absent in dto', async () => {
      const current = { categoryId: 'keep' } as any;
      const domainGetOne = jest
        .spyOn(domain, 'getOne')
        .mockResolvedValue(current);
      const domainUpdate = jest
        .spyOn(domain, 'update')
        .mockResolvedValue({} as any);

      const dto: UpdateTransactionDto = { quantity: 1, description: 'x' };
      await service.update('i', dto, 'u');
      expect(domainUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ categoryId: 'keep' }),
        'i',
        'u',
      );
    });

    it('should delete tags when dto.tags present', async () => {
      const current = { categoryId: null } as any;
      const domainGetOne = jest
        .spyOn(domain, 'getOne')
        .mockResolvedValue(current);
      const spyDeleteTags = jest
        .spyOn(domain, 'deleteTransactionTags')
        .mockResolvedValue(undefined as any);
      const domainUpdate = jest
        .spyOn(domain, 'update')
        .mockResolvedValue({} as any);

      const dto: UpdateTransactionDto = {
        quantity: 1,
        description: 'x',
        tags: ['t1'],
      } as any;
      await service.update('i', dto, 'u');
      expect(spyDeleteTags).toHaveBeenCalledWith('i');
    });
  });

  describe('remove', () => {
    it('should call domain.delete', async () => {
      const domainDelete = jest
        .spyOn(domain, 'delete')
        .mockResolvedValue({} as any);
      await service.remove('i', 'u');
      expect(domainDelete).toHaveBeenCalledWith('i', 'u');
    });
  });
});
