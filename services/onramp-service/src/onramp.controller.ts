import { Controller, Post, Get, Body, Param, HttpCode } from '@nestjs/common';
import { OnrampService } from './onramp.service';

@Controller('onramp')
export class OnrampController {
  constructor(private readonly onrampService: OnrampService) {}

  @Post('quote')
  async getQuote(
    @Body() body: { amount_fiat: number; currency: string; provider_type: string }
  ) {
    return this.onrampService.getQuote(body.amount_fiat, body.currency, body.provider_type);
  }

  @Post('execute')
  @HttpCode(201)
  async execute(
    @Body()
    body: {
      idempotency_key: string;
      amount_fiat: number;
      currency: string;
      provider_type: string;
      card_token: string;
      reservation_hash: string;
    }
  ) {
    return this.onrampService.execute(
      body.idempotency_key,
      body.amount_fiat,
      body.currency,
      body.provider_type,
      body.card_token,
      body.reservation_hash
    );
  }

  @Get('status/:idempotencyKey')
  async getStatus(@Param('idempotencyKey') idempotencyKey: string) {
    return this.onrampService.getStatus(idempotencyKey);
  }
}
