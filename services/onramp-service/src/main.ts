import { NestFactory } from '@nestjs/core';
import { OnrampModule } from './onramp.module';

async function bootstrap() {
  const app = await NestFactory.create(OnrampModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3001);
  console.log(`On-ramp service running on port ${process.env.PORT || 3001}`);
}
bootstrap();
