import { Injectable, Logger } from '@nestjs/common';
import { SandboxProvider } from './providers/sandbox-provider';
import { v4 as uuidv4 } from 'uuid';

// ─── Idempotency in-memory store ───────────────────────────────────
const idempotencyStore = new Map<string, any>();

@Injectable()
export class OfframpService {
  private readonly logger = new Logger(OfframpService.name);

  constructor(private readonly sandbox: SandboxProvider) {}

  // ─── Execute: Off-Ramp İşlemi (USDC → TL + FAST/IBAN) ───────────

  async execute(
    idempotencyKey: string,
    swapId: number,
    sellerAddress: string,
    iban: string,
    amountUsdc: number
  ) {
    // Idempotency kontrolü (§3.5)
    if (idempotencyStore.has(idempotencyKey)) {
      this.logger.warn(
        `Duplicate idempotency key: ${idempotencyKey} — returning existing`
      );
      return idempotencyStore.get(idempotencyKey);
    }

    this.logger.log(
      `Execute offramp: ${amountUsdc} USDC → IBAN (key: ${idempotencyKey})`
    );

    // Sandbox provider ile USDC → TL dönüşümü + FAST transfer simülasyonu
    const providerResult = await this.sandbox.convertAndTransfer({
      amount_usdc: amountUsdc,
      target_iban: iban,
      seller_address: sellerAddress,
      swap_id: swapId,
    });

    const transaction = {
      id: uuidv4(),
      idempotency_key: idempotencyKey,
      swap_id: swapId,
      seller_address: sellerAddress,
      iban,
      amount_usdc: amountUsdc,
      amount_try: providerResult.amount_try,
      exchange_rate: providerResult.exchange_rate,
      offramp_status: providerResult.success ? 'completed' : 'failed',
      fast_reference: providerResult.fast_reference,
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
      status: transaction.offramp_status,
      transaction,
    };
  }
}
