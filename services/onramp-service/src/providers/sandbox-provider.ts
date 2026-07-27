import { Injectable, Logger } from '@nestjs/common';

// ─── Sandbox Payment Provider ──────────────────────────────────────
// SANDBOX modunda — gerçek API çağrısı YAPILMAZ
// Test kartı ile tetiklenebilir, simülasyon üretir

export interface PaymentRequest {
  amount: number;
  currency: string;
  card_token: string;
  mcc_code: string;
}

export interface PaymentResult {
  success: boolean;
  reference: string;
  amount_usdc: number;
  exchange_rate: number;
  card_fee: number;
}

@Injectable()
export class SandboxProvider {
  private readonly logger = new Logger(SandboxProvider.name);

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    this.logger.log(
      `[SANDBOX] Processing payment: ${request.amount} ${request.currency}`
    );

    // Sandbox: her zaman başarılı simülasyon
    const exchangeRate = 38.5;
    const amountUsd = request.amount / exchangeRate;
    const cardFee = request.amount * 0.025;

    const result: PaymentResult = {
      success: true,
      reference: `sbx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      amount_usdc: amountUsd,
      exchange_rate: exchangeRate,
      card_fee: cardFee,
    };

    this.logger.log(
      `[SANDBOX] Payment processed: ref=${result.reference}, usdc=${result.amount_usdc}`
    );

    return result;
  }
}
