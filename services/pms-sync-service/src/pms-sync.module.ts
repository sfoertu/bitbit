import { Module } from '@nestjs/common';
import { PmsSyncController } from './pms-sync.controller';
import { PmsSyncService } from './pms-sync.service';
import { SandboxPmsAdapter } from './adapters/sandbox-pms-adapter';

@Module({
  controllers: [PmsSyncController],
  providers: [PmsSyncService, SandboxPmsAdapter],
})
export class PmsSyncModule {}
