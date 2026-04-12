import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  // app.useGlobalPipes(new DtoValidationPipe());
  await app.listen(process.env.PORT ?? 3000, process.env.HOSTNAME ?? '0.0.0.0');
}
void bootstrap();
