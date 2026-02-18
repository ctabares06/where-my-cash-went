import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { DatabaseService } from '../database/database.service';
import { createMockContext } from '../../test/prisma.mock';
import { CreateTagDto } from './tags.dto';
import { Tags, Prisma } from '../lib/ormClient/client';

describe('TagsService', () => {
  let service: TagsService;
  let dbService: DatabaseService;

  const mockTag: Tags = {
    id: 'tag1',
    name: 'important',
    userId: 'userId',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockContext = createMockContext();

    const mockDbService = { client: mockContext.prisma };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: DatabaseService,
          useValue: mockDbService,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    dbService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a tag', async () => {
    const dto: CreateTagDto = { name: 'important' };
    const spy = jest
      .spyOn(dbService.client.tags, 'create')
      .mockResolvedValue(mockTag);
    const result = await service.createTag(dto, 'userId');
    expect(result).toEqual(mockTag);
    expect(spy).toHaveBeenCalledWith({
      data: { name: 'important', userId: 'userId' },
    });
  });

  it('should create tags in batch and return created items', async () => {
    const dtos: CreateTagDto[] = [{ name: 'a' }, { name: 'b' }];
    const batch = { count: 2 };
    const created = [mockTag, { ...mockTag, id: 'tag2', name: 'b' } as any];

    jest.spyOn(dbService.client.tags, 'createMany').mockResolvedValue(batch);
    const spyFind = jest
      .spyOn(dbService.client.tags, 'findMany')
      .mockResolvedValue(created);

    const result = await service.createTag(dtos, 'userId');
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(spyFind).toHaveBeenCalledWith({
      where: { userId: 'userId' },
      skip: 0,
      take: batch.count,
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should throw BadRequestException on validation error', async () => {
    const dto: CreateTagDto = { name: '' };
    jest.spyOn(dbService.client.tags, 'create').mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('bad', {
        clientVersion: '1',
        code: 'P2000',
      }),
    );
    await expect(service.createTag(dto, 'userId')).rejects.toThrow(
      'Invalid data provided',
    );
  });
});
