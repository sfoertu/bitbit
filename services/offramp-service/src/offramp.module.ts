import { Module } from '@nestjs/common';
import { OfframpController } from './offramp.controller';
import { OfframpService } from './offramp.service';
import { SandboxProvider } from './providers/sandbox-provider';

@Module({
  controllers: [OfframpController],
  providers: [OfframpService, SandboxProvider],
})
export class OfframpModule {}
