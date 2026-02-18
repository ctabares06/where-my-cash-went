import { Test, TestingModule } from '@nestjs/testing';
import { PeriodicService } from './periodic.service';

describe('GenericService', () => {
  let service: PeriodicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeriodicService],
    }).compile();

    service = module.get<PeriodicService>(PeriodicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
