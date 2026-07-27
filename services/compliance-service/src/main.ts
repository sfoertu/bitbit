import { NestFactory } from '@nestjs/core';
import { ComplianceModule } from './compliance.module';

async function bootstrap() {
  const app = await NestFactory.create(ComplianceModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3004);
  console.log(`Compliance service running on port ${process.env.PORT || 3004}`);
}
bootstrap();
