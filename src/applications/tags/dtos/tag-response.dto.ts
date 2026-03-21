import { TagProps } from '../../../domains/tags/entities/tag.entity';

export type TagResponseDto = {
  data: TagProps[];
  count: number;
};

export type TagListResponseDto = {
  data: TagProps[];
  page: number;
  limit: number;
  count: number;
};
