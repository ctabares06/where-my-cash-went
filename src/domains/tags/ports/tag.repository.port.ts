import { TagEntity, TagProps } from '@/domains/tags/entities/tag.entity';

/**
 * Tag Repository Port - Interface defined in domain
 * Implementation will be in infrastructure layer (Prisma adapter)
 */
export interface ITagRepository {
  create(entity: TagEntity): Promise<TagProps>;
  createMany(entities: TagEntity[]): Promise<TagProps[]>;
  findById(id: string): Promise<TagEntity | null>;
  findByIdAndUserId(id: string, userId: string): Promise<TagEntity | null>;
  findManyByUserId(
    userId: string,
    limit: number,
    page: number,
  ): Promise<TagEntity[]>;
  findByNameAndUserId(name: string, userId: string): Promise<TagEntity | null>;
  update(entity: TagEntity): Promise<TagProps>;
  delete(id: string, userId: string): Promise<TagProps>;
  countByUserId(userId: string): Promise<number>;
}
