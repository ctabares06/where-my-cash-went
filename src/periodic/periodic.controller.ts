import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PeriodicService as PeriodicService } from './periodic.service';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { CreatePeriodicDto, UpdatePeriodicDto } from './periodic.dto';

@Controller('generic')
export class GenericController {
  constructor(private genericService: PeriodicService) {}

  @Post()
  create(@Body() data: CreatePeriodicDto, @Session() session: UserSession) {
    return this.genericService.create(data, session.user.id);
  }

  @Post(':id')
  update(
    @Body() data: UpdatePeriodicDto,
    @Param('id') periodicId: string,
    @Session() session: UserSession,
  ) {
    return this.genericService.update(data, periodicId, session.user.id);
  }

  @Delete(':id')
  delete(@Param('id') periodicId: string, @Session() session: UserSession) {
    return this.genericService.delete(periodicId, session.user.id);
  }

  @Get(':id')
  getOne(@Param('id') periodicId: string, @Session() session: UserSession) {
    return this.genericService.getOne(periodicId, session.user.id);
  }

  @Get()
  getMany(@Session() session: UserSession) {
    return this.genericService.getAll(session.user.id);
  }
}
