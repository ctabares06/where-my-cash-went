import { Injectable } from '@nestjs/common';
import { ITagRepository } from '@/domains/tags/ports/tag.repository.port';
import { TagEntity, TagProps } from '@/domains/tags/entities/tag.entity';
import { TagMapper } from '@/infrastructure/adapters/secondary/persistence/mappers/tag.mapper';
import { PrismaClientProvider } from '@/infrastructure/adapters/secondary/persistence/prisma/prisma-client.provider';

const tagSelect = {
  id: true,
  name: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class TagRepository implements ITagRepository {
  constructor(private readonly prisma: PrismaClientProvider) {}

  async create(entity: TagEntity): Promise<TagProps> {
    const data = TagMapper.toProps(entity);
    const result = await this.prisma.tags.create({ data });
    return result;
  }

  async createMany(entities: TagEntity[]): Promise<TagProps[]> {
    const data = entities.map((e) => TagMapper.toProps(e));
    const results = await this.prisma.tags.createManyAndReturn({ data });
    return results;
  }

  async findById(id: string): Promise<TagEntity | null> {
    const result = await this.prisma.tags.findUnique({
      where: { id },
      select: tagSelect,
    });
    if (!result) return null;
    return TagMapper.toDomain(result);
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<TagEntity | null> {
    const result = await this.prisma.tags.findFirst({
      where: { id, userId },
      select: tagSelect,
    });
    if (!result) return null;
    return TagMapper.toDomain(result);
  }

  async findManyByUserId(
    userId: string,
    limit: number,
    page: number,
  ): Promise<TagEntity[]> {
    const results = await this.prisma.tags.findMany({
      where: { userId },
      select: tagSelect,
      skip: page * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return TagMapper.toDomainList(results);
  }

  async findByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<TagEntity | null> {
    const result = await this.prisma.tags.findFirst({
      where: { name, userId },
      select: tagSelect,
    });
    if (!result) return null;
    return TagMapper.toDomain(result);
  }

  async update(entity: TagEntity): Promise<TagProps> {
    const data = TagMapper.toProps(entity);
    const result = await this.prisma.tags.update({
      where: { id: entity.id },
      data,
    });
    return result;
  }

  async delete(id: string, userId: string): Promise<TagProps> {
    const result = await this.prisma.tags.delete({
      where: { id, userId },
    });
    return result;
  }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.tags.count({ where: { userId } });
  }
}
