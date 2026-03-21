import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Session,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoryApplicationService } from '../../../../applications/categories/category.application.service';
import { CreateCategoryDto } from '../../../../applications/categories/dtos/create-category.dto';
import { UpdateCategoryDto } from '../../../../applications/categories/dtos/update-category.dto';
import { CategoryListResponseDto } from '../../../../applications/categories/dtos/category-response.dto';
import type { UserSession } from '../../../../lib/auth.types';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoryAppService: CategoryApplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCategory(
    @Body() body: CreateCategoryDto | CreateCategoryDto[],
    @Session() session: UserSession,
  ) {
    return this.categoryAppService.create(body, session.user.id);
  }

  @Get()
  async getCategories(
    @Session() session: UserSession,
    @Query('page') page: string = '0',
    @Query('limit') limit: string = '10',
  ): Promise<CategoryListResponseDto> {
    return this.categoryAppService.getMany(
      session.user.id,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get(':id')
  async getCategoryById(
    @Param('id') categoryId: string,
    @Session() session: UserSession,
  ) {
    return this.categoryAppService.getById(categoryId, session.user.id);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') categoryId: string,
    @Body() body: UpdateCategoryDto,
    @Session() session: UserSession,
  ) {
    return this.categoryAppService.update(categoryId, body, session.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(
    @Param('id') categoryId: string,
    @Session() session: UserSession,
  ): Promise<void> {
    await this.categoryAppService.delete(categoryId, session.user.id);
  }
}
