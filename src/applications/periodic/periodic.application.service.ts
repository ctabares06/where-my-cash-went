import { PeriodicDomainService } from '../../domains/periodic/domain/periodic.domain.service';
import { CreatePeriodicDto } from './dtos/create-periodic.dto';
import { UpdatePeriodicDto } from './dtos/update-periodic.dto';
import {
  PeriodicResponseDto,
  PeriodicListResponseDto,
} from './dtos/periodic-response.dto';

/**
 * Periodic Application Service - Use case orchestration
 */
export class PeriodicApplicationService {
  constructor(private readonly periodicDomainService: PeriodicDomainService) {}

  async create(
    input: CreatePeriodicDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userId: string,
  ): Promise<PeriodicResponseDto> {
    const result = await this.periodicDomainService.create({
      cycle: input.cycle,
      duration: input.duration,
      transactionId: input.transactionId,
      startDate: input.startDate,
    });
    return {
      data: [result],
      count: 1,
    };
  }

  async getById(id: string, userId: string): Promise<PeriodicResponseDto> {
    const result = await this.periodicDomainService.getById(id, userId);
    return {
      data: [result.toProps()],
      count: 1,
    };
  }

  async getAll(userId: string): Promise<PeriodicListResponseDto> {
    const results = await this.periodicDomainService.getAllByUser(userId);
    return {
      data: results.map((e) => e.toProps()),
      count: results.length,
    };
  }

  async update(
    id: string,
    input: UpdatePeriodicDto,
    userId: string,
  ): Promise<PeriodicResponseDto> {
    const result = await this.periodicDomainService.update(id, userId, {
      cycle: input.cycle,
      duration: input.duration,
      startDate: input.startDate,
    });
    return {
      data: [result.toProps()],
      count: 1,
    };
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.periodicDomainService.delete(id, userId);
  }
}
