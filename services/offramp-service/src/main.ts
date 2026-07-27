import { NestFactory } from '@nestjs/core';
import { OfframpModule } from './offramp.module';

async function bootstrap() {
  const app = await NestFactory.create(OfframpModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3002);
  console.log(`Off-ramp service running on port ${process.env.PORT || 3002}`);
}
bootstrap();
