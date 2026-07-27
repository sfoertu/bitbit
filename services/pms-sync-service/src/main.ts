import { NestFactory } from '@nestjs/core';
import { PmsSyncModule } from './pms-sync.module';

async function bootstrap() {
  const app = await NestFactory.create(PmsSyncModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(process.env.PORT || 3003);
  console.log(`PMS Sync service running on port ${process.env.PORT || 3003}`);
}
bootstrap();
