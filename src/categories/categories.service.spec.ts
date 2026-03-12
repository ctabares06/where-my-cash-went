import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import {
  CategoriesDomain,
  CreateCategoryDomain,
  UpdateCategoryDomain,
} from './categories.domain';
import { CreateCategoryDto } from './categories.dto';
import type { Category } from '../lib/ormClient/client';
import { Transaction_T } from '../lib/ormClient/enums';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService - UT', () => {
  let service: CategoriesService;
  let categoryDomain: CategoriesDomain;

  const mockCategory: Category = {
    id: 'categoryId',
    name: 'Groceries',
    unicode: '🛒',
    transactionType: Transaction_T.expense,
    userId: 'userId',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesDomain,
          useValue: {
            create: jest.fn(),
            getMany: jest.fn(),
            getOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryDomain = module.get<CategoriesDomain>(CategoriesDomain);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCategory', () => {
    it('creates a single category', async () => {
      const dto: CreateCategoryDto = {
        name: 'Groceries',
        unicode: '🛒',
        transactionType: Transaction_T.expense,
      };
      const domainCreate = jest
        .spyOn(categoryDomain, 'create')
        .mockResolvedValue(mockCategory as any);

      const result = await service.createCategory(dto, 'userId');
      expect(result).toEqual(mockCategory);
      expect(domainCreate).toHaveBeenCalledWith(
        dto as CreateCategoryDomain,
        'userId',
      );
    });

    it('creates multiple categories', async () => {
      const dtos: CreateCategoryDto[] = [
        { name: 'a', unicode: '🅰️', transactionType: Transaction_T.expense },
        { name: 'b', unicode: '🅱️', transactionType: Transaction_T.expense },
      ];
      const returns = [
        { ...mockCategory, id: 'c1' },
        { ...mockCategory, id: 'c2' },
      ];
      const domainCreate = jest
        .spyOn(categoryDomain, 'create')
        .mockImplementation((data) => Promise.resolve(returns.shift()));

      const result = await service.createCategory(dtos, 'userId');
      expect(Array.isArray(result)).toBe(true);
      expect(domainCreate).toHaveBeenCalledTimes(2);
    });
  });

  describe('getCategoriesByUser', () => {
    it('forwards paging params', async () => {
      const list = [mockCategory];
      const domainGetMany = jest
        .spyOn(categoryDomain, 'getMany')
        .mockResolvedValue(list as any);
      const res = await service.getCategoriesByUser('userId', 0, 10);
      expect(res).toEqual(list);
      expect(domainGetMany).toHaveBeenCalledWith('userId', 10, 0);
    });
  });

  describe('getCategoryById', () => {
    it('returns item when found', async () => {
      const domainGetOne = jest
        .spyOn(categoryDomain, 'getOne')
        .mockResolvedValue(mockCategory as any);
      const res = await service.getCategoryById('id', 'userId');
      expect(res).toEqual(mockCategory);
      expect(domainGetOne).toHaveBeenCalledWith('id', 'userId');
    });

    it('propagates not found', async () => {
      jest
        .spyOn(categoryDomain, 'getOne')
        .mockRejectedValue(new NotFoundException());
      await expect(service.getCategoryById('id', 'userId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateCategory', () => {
    it('passes payload to domain.update', async () => {
      const dto: CreateCategoryDto = {
        name: 'Updated',
        unicode: 'U',
        transactionType: Transaction_T.expense,
      };
      const domainUpdate = jest
        .spyOn(categoryDomain, 'update')
        .mockResolvedValue(mockCategory as any);
      await service.updateCategory(dto as any, 'id', 'userId');
      expect(domainUpdate).toHaveBeenCalledWith(
        dto as UpdateCategoryDomain,
        'id',
        'userId',
      );
    });
  });

  describe('deleteCategory', () => {
    it('calls domain.delete', async () => {
      const domainDelete = jest
        .spyOn(categoryDomain, 'delete')
        .mockResolvedValue(mockCategory as any);
      await service.deleteCategory('id', 'userId');
      expect(domainDelete).toHaveBeenCalledWith('id', 'userId');
    });
  });
});
