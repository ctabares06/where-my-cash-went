import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { TagsDomain, CreateTagDomain, UpdateTagDomain } from './tags.domain';
import { CreateTagDto } from './tags.dto';
import type { Tags } from '../lib/ormClient/client';
import { NotFoundException } from '@nestjs/common';

describe('TagsService - UT', () => {
  let service: TagsService;
  let tagsDomain: TagsDomain;

  const mockTag: Tags = {
    id: 'tag1',
    name: 'important',
    userId: 'userId',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: TagsDomain,
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

    service = module.get<TagsService>(TagsService);
    tagsDomain = module.get<TagsDomain>(TagsDomain);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTag', () => {
    it('creates single tag', async () => {
      const dto: CreateTagDto = { name: 'important' };
      const domainCreate = jest
        .spyOn(tagsDomain, 'create')
        .mockResolvedValue(mockTag as any);

      const res = await service.createTag(dto, 'userId');
      expect(res).toEqual(mockTag);
      expect(domainCreate).toHaveBeenCalledWith(
        dto as CreateTagDomain,
        'userId',
      );
    });

    it('creates tags in batch', async () => {
      const dtos: CreateTagDto[] = [{ name: 'a' }, { name: 'b' }];
      const returns = [mockTag, { ...mockTag, id: 'tag2', name: 'b' } as any];
      const domainCreate = jest
        .spyOn(tagsDomain, 'create')
        .mockImplementation((data) => Promise.resolve(returns.shift()));

      const res = await service.createTag(dtos, 'userId');
      expect(Array.isArray(res)).toBe(true);
      expect(domainCreate).toHaveBeenCalledTimes(2);
    });

    it('throws on validation error', async () => {
      const dto: CreateTagDto = { name: '' } as any;
      jest.spyOn(tagsDomain, 'create').mockRejectedValue(new Error('bad'));
      await expect(service.createTag(dto, 'userId')).rejects.toThrow('bad');
    });
  });

  describe('getTagsByUser', () => {
    it('forwards pagination', async () => {
      const list = [mockTag];
      const domainGetMany = jest
        .spyOn(tagsDomain, 'getMany')
        .mockResolvedValue(list as any);
      const res = await service.getTagsByUser('userId', 0, 5);
      expect(res).toEqual(list);
      expect(domainGetMany).toHaveBeenCalledWith('userId', 5, 0);
    });
  });

  describe('getTagById', () => {
    it('returns tag if found', async () => {
      const domainGetOne = jest
        .spyOn(tagsDomain, 'getOne')
        .mockResolvedValue(mockTag as any);
      const res = await service.getTagById('tag1', 'userId');
      expect(res).toEqual(mockTag);
      expect(domainGetOne).toHaveBeenCalledWith('tag1', 'userId');
    });

    it('propagates not found', async () => {
      jest
        .spyOn(tagsDomain, 'getOne')
        .mockRejectedValue(new NotFoundException());
      await expect(service.getTagById('tag1', 'userId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTag', () => {
    it('calls domain.update', async () => {
      const dto: CreateTagDto = { name: 'updated' } as any;
      const domainUpdate = jest
        .spyOn(tagsDomain, 'update')
        .mockResolvedValue(mockTag as any);
      await service.updateTag(dto as any, 'tag1', 'userId');
      expect(domainUpdate).toHaveBeenCalledWith(
        dto as UpdateTagDomain,
        'tag1',
        'userId',
      );
    });
  });

  describe('deleteTag', () => {
    it('calls domain.delete', async () => {
      const domainDelete = jest
        .spyOn(tagsDomain, 'delete')
        .mockResolvedValue(mockTag as any);
      await service.deleteTag('tag1', 'userId');
      expect(domainDelete).toHaveBeenCalledWith('tag1', 'userId');
    });
  });
});
