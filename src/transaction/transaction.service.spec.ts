import { Test } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { DatabaseService } from '../database/database.service';
import { Transaction_T } from '../lib/ormClient/enums';
import { createMockContext } from '../../test/prisma.mock';
import {
  type Transaction,
  type Periodic,
  Prisma,
} from '../lib/ormClient/client';
import { NotFoundException } from '@nestjs/common';
import { CreatePeriodicTransactionDto } from './transaction.dto';

describe('TransactionService - UT', () => {
  let transactionService: TransactionService;
  let dbService: DatabaseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: DatabaseService,
          useValue: {
            client: createMockContext().prisma,
          },
        },
      ],
    }).compile();

    dbService = module.get<DatabaseService>(DatabaseService);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  describe('create', () => {
    it('should create a single transaction', async () => {
      const createTransactionDto = {
        quantity: 100,
        description: 'Test transaction',
        transactionType: Transaction_T.income,
      };
      const expectedTransaction: Transaction = {
        id: '1',
        ...createTransactionDto,
        userId: 'userId',
        createdAt: new Date(),
        updateAt: new Date(),
        categoryId: null,
      };

      const spy = jest
        .spyOn(dbService.client.transaction, 'create')
        .mockResolvedValue(expectedTransaction);

      const result = await transactionService.create(
        createTransactionDto,
        'userId',
      );
      expect(result).toEqual(expectedTransaction);
      expect(spy).toHaveBeenCalledWith({
        data: {
          ...createTransactionDto,
          userId: 'userId',
        },
      });
    });

    it('should create multiple transactions in batch', async () => {
      const createTransactionDtos = [
        {
          quantity: 100,
          description: 'Test transaction 1',
          transactionType: Transaction_T.income,
        },
        {
          quantity: 50,
          description: 'Test transaction 2',
          transactionType: Transaction_T.expense,
        },
      ];

      const mockBatchResult = { count: 2 };
      const createdTransactions: Transaction[] = [
        {
          id: '1',
          ...createTransactionDtos[0],
          userId: 'userId',
          createdAt: new Date(),
          updateAt: new Date(),
          categoryId: null,
        },
        {
          id: '2',
          ...createTransactionDtos[1],
          userId: 'userId',
          createdAt: new Date(),
          updateAt: new Date(),
          categoryId: null,
        },
      ];

      const spyCreateMany = jest
        .spyOn(dbService.client.transaction, 'createMany')
        .mockResolvedValue(mockBatchResult);

      const spyFindMany = jest
        .spyOn(dbService.client.transaction, 'findMany')
        .mockResolvedValue(createdTransactions);

      const result = (await transactionService.create(
        createTransactionDtos,
        'userId',
      )) as Transaction[];

      expect(result).toEqual(createdTransactions);
      expect(result).toHaveLength(2);
      expect(spyCreateMany).toHaveBeenCalledWith({
        data: [
          { ...createTransactionDtos[0], userId: 'userId' },
          { ...createTransactionDtos[1], userId: 'userId' },
        ],
      });
      expect(spyFindMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        where: { userId: 'userId' },
        take: 2,
      });
    });
  });

  describe('findAll', () => {
    it('should find all transactions for a user', async () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          quantity: 100,
          description: 'Test transaction 1',
          transactionType: Transaction_T.income,
          userId: 'userId',
          createdAt: new Date(),
          updateAt: new Date(),
          categoryId: null,
        },
        {
          id: '2',
          quantity: 200,
          description: 'Test transaction 2',
          transactionType: Transaction_T.expense,
          userId: 'userId',
          createdAt: new Date(),
          updateAt: new Date(),
          categoryId: null,
        },
      ];

      const spy = jest
        .spyOn(dbService.client.transaction, 'findMany')
        .mockResolvedValue(transactions);

      const result = await transactionService.findAll('userId');
      expect(result).toEqual(transactions);
      expect(spy).toHaveBeenCalledWith({
        where: {
          userId: 'userId',
        },
      });
    });

    it('should return empty array when no transactions exist', async () => {
      const spy = jest
        .spyOn(dbService.client.transaction, 'findMany')
        .mockResolvedValue([]);

      const result = await transactionService.findAll('userId');
      expect(result).toEqual([]);
      expect(spy).toHaveBeenCalledWith({
        where: {
          userId: 'userId',
        },
      });
    });
  });

  describe('findOne', () => {
    it('should find one transaction by id for a user', async () => {
      const transaction: Transaction = {
        id: '1',
        quantity: 100,
        description: 'Test transaction',
        transactionType: Transaction_T.income,
        userId: 'userId',
        createdAt: new Date(),
        updateAt: new Date(),
        categoryId: null,
      };

      const spy = jest
        .spyOn(dbService.client.transaction, 'findFirst')
        .mockResolvedValue(transaction);

      const result = await transactionService.findOne('1', 'userId');
      expect(result).toEqual(transaction);
      expect(spy).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: 'userId',
        },
      });
    });

    it('should throw NotFoundException when transaction not found', async () => {
      jest
        .spyOn(dbService.client.transaction, 'findFirst')
        .mockResolvedValue(null);

      await expect(transactionService.findOne('1', 'userId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when transaction belongs to different user', async () => {
      jest
        .spyOn(dbService.client.transaction, 'findFirst')
        .mockResolvedValue(null);

      await expect(
        transactionService.findOne('1', 'differentUserId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createPeriodic', () => {
    it('should create a periodic transaction when transaction exists', async () => {
      const transaction: Transaction = {
        id: '1',
        quantity: 100,
        description: 'Test transaction',
        transactionType: Transaction_T.income,
        userId: 'userId',
        createdAt: new Date(),
        updateAt: new Date(),
        categoryId: null,
      };

      const periodic: Periodic = {
        id: 'p1',
        transactionId: '1',
        cycle: 'monthly',
        duration: null,
        createdAt: new Date(),
        updateAt: new Date(),
      };

      jest
        .spyOn(dbService.client.transaction, 'findUnique')
        .mockResolvedValue(transaction);

      const spy = jest
        .spyOn(dbService.client.periodic, 'create')
        .mockResolvedValue(periodic);

      const dto: CreatePeriodicTransactionDto = {
        transactionId: '1',
        cycle: 'monthly',
      };

      const result = await transactionService.createPeriodic(dto, 'userId');

      expect(result).toEqual(periodic);
      expect(spy).toHaveBeenCalledWith({ data: dto });
    });

    it('should throw NotFoundException when transaction not found', async () => {
      jest
        .spyOn(dbService.client.transaction, 'findFirstOrThrow')
        .mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError('Transaction not found', {
            code: 'P2025',
            clientVersion: '5.0.0',
          }),
        );

      const dto: CreatePeriodicTransactionDto = {
        transactionId: '1',
        cycle: 'monthly',
      };

      await expect(
        transactionService.createPeriodic(dto, 'userId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const updateTransactionDto = {
        quantity: 150,
        description: 'Updated transaction',
      };
      const updatedTransaction: Transaction = {
        id: '1',
        quantity: 150,
        description: 'Updated transaction',
        transactionType: Transaction_T.income,
        userId: 'userId',
        createdAt: new Date(),
        updateAt: new Date(),
        categoryId: null,
      };

      const spy = jest
        .spyOn(dbService.client.transaction, 'update')
        .mockResolvedValue(updatedTransaction);

      const result = await transactionService.update(
        '1',
        updateTransactionDto,
        'userId',
      );
      expect(result).toEqual(updatedTransaction);
      expect(spy).toHaveBeenCalledWith({
        where: { id: '1', userId: 'userId' },
        data: updateTransactionDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a transaction', async () => {
      const existingTransaction: Transaction = {
        id: '1',
        userId: 'userId',
        quantity: 100,
        description: 'Test transaction',
        transactionType: Transaction_T.income,
        createdAt: new Date(),
        updateAt: new Date(),
        categoryId: null,
      };
      const deletedTransaction: Transaction = {
        id: '1',
        quantity: 100,
        description: 'Test transaction',
        transactionType: Transaction_T.income,
        userId: 'userId',
        createdAt: new Date(),
        updateAt: new Date(),
        categoryId: null,
      };

      jest
        .spyOn(dbService.client.transaction, 'findFirst')
        .mockResolvedValue(existingTransaction);
      const spy = jest
        .spyOn(dbService.client.transaction, 'delete')
        .mockResolvedValue(deletedTransaction);

      const result = await transactionService.remove('1', 'userId');
      expect(result).toEqual(deletedTransaction);
      expect(spy).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException when transaction not found', async () => {
      jest
        .spyOn(dbService.client.transaction, 'findFirst')
        .mockResolvedValue(null);

      await expect(transactionService.remove('1', 'userId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when transaction belongs to different user', async () => {
      jest
        .spyOn(dbService.client.transaction, 'findFirst')
        .mockResolvedValue(null);

      await expect(
        transactionService.remove('1', 'differentUserId'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
