import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DtoValidationPipe } from './pipes/dtoValidation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new DtoValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
