import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/infrastructure/wiring/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const HOSTNAME = process.env.HOSTNAME ?? '0.0.0.0';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:80'],
    credentials: true,
  });
  // app.useGlobalPipes(new DtoValidationPipe());
  await app.listen(process.env.PORT ?? 3000, HOSTNAME);
}

void bootstrap();
