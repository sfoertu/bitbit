import { Module } from '@nestjs/common';
import { OnrampController } from './onramp.controller';
import { OnrampService } from './onramp.service';
import { SandboxProvider } from './providers/sandbox-provider';

@Module({
  controllers: [OnrampController],
  providers: [OnrampService, SandboxProvider],
})
export class OnrampModule {}
