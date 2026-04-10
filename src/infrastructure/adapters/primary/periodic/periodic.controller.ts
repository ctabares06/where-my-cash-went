import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Session,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PeriodicApplicationService } from '@/applications/periodic/periodic.application.service';
import { CreatePeriodicDto } from '@/applications/periodic/dtos/create-periodic.dto';
import { UpdatePeriodicDto } from '@/applications/periodic/dtos/update-periodic.dto';
import { PeriodicListResponseDto } from '@/applications/periodic/dtos/periodic-response.dto';
import type { UserSession } from '@/lib/auth.types';

@Controller('periodics')
export class PeriodicController {
  constructor(
    private readonly periodicAppService: PeriodicApplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPeriodic(
    @Body() body: CreatePeriodicDto,
    @Session() session: UserSession,
  ) {
    return this.periodicAppService.create(body, session.user.id);
  }

  @Get()
  async getPeriodics(
    @Session() session: UserSession,
  ): Promise<PeriodicListResponseDto> {
    return this.periodicAppService.getAll(session.user.id);
  }

  @Get(':id')
  async getPeriodicById(
    @Param('id') periodicId: string,
    @Session() session: UserSession,
  ) {
    return this.periodicAppService.getById(periodicId, session.user.id);
  }

  @Put(':id')
  async updatePeriodic(
    @Param('id') periodicId: string,
    @Body() body: UpdatePeriodicDto,
    @Session() session: UserSession,
  ) {
    return this.periodicAppService.update(periodicId, body, session.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePeriodic(
    @Param('id') periodicId: string,
    @Session() session: UserSession,
  ): Promise<void> {
    await this.periodicAppService.delete(periodicId, session.user.id);
  }
}
