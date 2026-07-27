import { Injectable, Logger } from '@nestjs/common';
import { SandboxProvider } from './providers/sandbox-provider';
import { v4 as uuidv4 } from 'uuid';

// ─── Idempotency in-memory store (Redis yerine basit mock) ─────────
// Gerçek uygulamada Redis + BullMQ kullanılır
const idempotencyStore = new Map<string, any>();

@Injectable()
export class OnrampService {
  private readonly logger = new Logger(OnrampService.name);

  constructor(private readonly sandbox: SandboxProvider) {}

  // ─── Quote: Ücret Dağılımı (SOP §7.2 — fee transparency) ──────────

  async getQuote(amountFiat: number, currency: string, providerType: string) {
    this.logger.log(
      `Quote request: ${amountFiat} ${currency} for ${providerType}`
    );

    const exchangeRate = 38.5; // Sandbox USD/TRY kuru
    const amountUsd = amountFiat / exchangeRate;
    const amountUsdc = amountUsd; // 1 USDC = 1 USD

    // Ücret hesaplama (SOP §7.2 — tüm ücretler açıkça gösterilmeli)
    const cardFee = amountFiat * 0.025; // %2.5 kart işlem ücreti
    const gasFee = 0.01 * exchangeRate; // ~0.01 USD gas
    const platformFee = amountFiat * 0.05; // %5 platform komisyonu
    const totalFee = cardFee + gasFee + platformFee;
    const netAmount = amountUsdc - totalFee / exchangeRate;

    return {
      amount_fiat: amountFiat,
      amount_usdc: Math.max(0, netAmount),
      exchange_rate: exchangeRate,
      fee_breakdown: {
        card_fee: Math.round(cardFee * 100) / 100,
        gas_fee: Math.round(gasFee * 100) / 100,
        platform_fee: Math.round(platformFee * 100) / 100,
        total_fee: Math.round(totalFee * 100) / 100,
        net_amount: Math.round(Math.max(0, netAmount) * 100) / 100,
      },
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };
  }

  // ─── Execute: On-Ramp İşlemi (idempotency zorunlu) ───────────────

  async execute(
    idempotencyKey: string,
    amountFiat: number,
    currency: string,
    providerType: string,
    cardToken: string,
    reservationHash: string
  ) {
    // Idempotency kontrolü (§3.5)
    if (idempotencyStore.has(idempotencyKey)) {
      this.logger.warn(
        `Duplicate idempotency key: ${idempotencyKey} — returning existing`
      );
      return idempotencyStore.get(idempotencyKey);
    }

    this.logger.log(
      `Execute onramp: ${amountFiat} ${currency} (key: ${idempotencyKey})`
    );

    // Sandbox provider ile test kartı işle
    const providerResult = await this.sandbox.processPayment({
      amount: amountFiat,
      currency,
      card_token: cardToken,
      mcc_code: '4722', // Travel agency MCC
    });

    const transaction = {
      id: uuidv4(),
      idempotency_key: idempotencyKey,
      amount_fiat: amountFiat,
      amount_usdc: providerResult.amount_usdc,
      onramp_status: providerResult.success ? 'completed' : 'failed',
      provider_reference: providerResult.reference,
      created_at: new Date().toISOString(),
    };

    // Idempotency store'a kaydet
    idempotencyStore.set(idempotencyKey, transaction);

    return transaction;
  }

  // ─── Status: İşlem Durumu Sorgula ────────────────────────────────

  async getStatus(idempotencyKey: string) {
    const transaction = idempotencyStore.get(idempotencyKey);
    if (!transaction) {
      return { found: false, idempotency_key: idempotencyKey };
    }
    return {
      found: true,
      idempotency_key: idempotencyKey,
      status: transaction.onramp_status,
      transaction,
    };
  }
}
