import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { HealthApplicationService } from '@/applications/health/health.application.service';
import { HealthResponseDto } from '@/applications/health/dtos/health-response.dto';

@Controller('health')
export class HealthController {
  constructor(private readonly healthAppService: HealthApplicationService) {}

  @Get()
  @AllowAnonymous()
  async checkHealth(): Promise<HealthResponseDto> {
    const result = await this.healthAppService.checkHealth();

    if (result.status === 'error') {
      throw new HttpException(result, HttpStatus.SERVICE_UNAVAILABLE);
    }

    return result;
  }
}
