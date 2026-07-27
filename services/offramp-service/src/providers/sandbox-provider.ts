import { Injectable, Logger } from '@nestjs/common';

// ─── Sandbox Off-Ramp Provider ─────────────────────────────────────
// SANDBOX modunda — USDC → TL + FAST/IBAN transfer simülasyonu

export interface ConvertRequest {
  amount_usdc: number;
  target_iban: string;
  seller_address: string;
  swap_id: number;
}

export interface ConvertResult {
  success: boolean;
  fast_reference: string;
  amount_try: number;
  exchange_rate: number;
}

@Injectable()
export class SandboxProvider {
  private readonly logger = new Logger(SandboxProvider.name);

  async convertAndTransfer(request: ConvertRequest): Promise<ConvertResult> {
    this.logger.log(
      `[SANDBOX] Converting ${request.amount_usdc} USDC → TRY for IBAN ${request.target_iban}`
    );

    // Sandbox: her zaman başarılı simülasyon
    const exchangeRate = 38.5;
    const amountTry = request.amount_usdc * exchangeRate;

    const result: ConvertResult = {
      success: true,
      fast_reference: `FAST_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      amount_try: amountTry,
      exchange_rate: exchangeRate,
    };

    this.logger.log(
      `[SANDBOX] Transfer simulated: ref=${result.fast_reference}, try=${result.amount_try}`
    );

    return result;
  }
}
