import { Controller, Post, Get, Body, Param, HttpCode } from '@nestjs/common';
import { OfframpService } from './offramp.service';

@Controller('offramp')
export class OfframpController {
  constructor(private readonly offrampService: OfframpService) {}

  @Post('execute')
  @HttpCode(201)
  async execute(
    @Body()
    body: {
      idempotency_key: string;
      swap_id: number;
      seller_address: string;
      iban: string;
      amount_usdc: number;
    }
  ) {
    return this.offrampService.execute(
      body.idempotency_key,
      body.swap_id,
      body.seller_address,
      body.iban,
      body.amount_usdc
    );
  }

  @Get('status/:idempotencyKey')
  async getStatus(@Param('idempotencyKey') idempotencyKey: string) {
    return this.offrampService.getStatus(idempotencyKey);
  }
}
