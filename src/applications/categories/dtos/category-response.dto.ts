import { CategoryProps } from '../../../domains/categories/entities/category.entity';

export type CategoryResponseDto = {
  data: CategoryProps[];
  count: number;
};

export type CategoryListResponseDto = {
  data: CategoryProps[];
  page: number;
  limit: number;
  count: number;
};
