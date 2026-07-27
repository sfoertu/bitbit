import { Injectable, Logger } from '@nestjs/common';
import { SandboxPmsAdapter } from './adapters/sandbox-pms-adapter';

// ─── PMS Sync Service ──────────────────────────────────────────────
// §7.4 KRİTİK KURAL:
// PMS güncellemesi, escrow işlemi zincirde kesinleşmeden ASLA yapılmamalı.
// PMS güncellemesi başarısız olursa refundIfFailed tetiklenmeli (saga pattern).
//
// Bu servis escrow "completed" durumunu bekleyecek şekilde tasarlandı.
// Gerçek zincir bağlantısı geldiğinde (Faz 1/2 entegrasyonu),
// escrow_status kontrolü eklenecek.

export interface SyncRecord {
  swap_id: number;
  pms_reference: string;
  guest_name: string;
  pms_status: 'pending' | 'completed' | 'failed';
  escrow_tx_hash: string;
  created_at: string;
  updated_at: string;
}

// In-memory store (gerçek uygulamada DB)
const syncStore = new Map<number, SyncRecord>();

@Injectable()
export class PmsSyncService {
  private readonly logger = new Logger(PmsSyncService.name);

  constructor(private readonly pmsAdapter: SandboxPmsAdapter) {}

  // ─── Escrow tamamlanma webhook'u ──────────────────────────────────

  async processEscrowCompleted(body: {
    swap_id: number;
    buyer_address: string;
    seller_address: string;
    reservation_hash: string;
    escrow_tx_hash: string;
  }) {
    this.logger.log(
      `Escrow completed webhook received for swap ${body.swap_id}`
    );

    // §7.4:_escrow tx hash varsa, zincirde kesinleşmiş demektir
    // Gerçek uygulamada: escrow_status === 'completed' kontrolü
    // burada yapılacak (Faz 1/2 entegrasyonu sonrası)
    //
    // Şimdilik escrow_tx_hash'in varlığı yeterli sinyal:
    if (!body.escrow_tx_hash) {
      this.logger.error(
        `Swap ${body.swap_id}: escrow_tx_hash yok — PMS güncelleme REDDEDİLDİ (§7.4)`
      );
      return {
        success: false,
        reason: 'escrow_not_confirmed',
        message: 'Escrow henüz kesinleşmedi. PMS güncelleme bekletiliyor.',
      };
    }

    // PMS'yi güncelle
    try {
      const result = await this.pmsAdapter.updateReservation({
        pms_reference: body.reservation_hash,
        guest_name: body.buyer_address, // Gerçek uygulamada buyer'ın adı
        action: 'update_guest',
      });

      // Kayıt oluştur
      const record: SyncRecord = {
        swap_id: body.swap_id,
        pms_reference: body.reservation_hash,
        guest_name: body.buyer_address,
        pms_status: result.success ? 'completed' : 'failed',
        escrow_tx_hash: body.escrow_tx_hash,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      syncStore.set(body.swap_id, record);

      if (!result.success) {
        // §7.4: PMS başarısız → refundIfFailed tetiklenmeli
        this.logger.error(
          `Swap ${body.swap_id}: PMS güncelleme BAŞARISIZ — refundIfFailed tetiklenmeli (saga pattern)`
        );
        return {
          success: false,
          reason: 'pms_update_failed',
          message:
            'PMS güncelleme başarısız. refundIfFailed tetiklenmeli (Faz 1/2 entegrasyonu sonrası).',
          requires_refund: true, // Saga compensation flag
          record,
        };
      }

      this.logger.log(
        `Swap ${body.swap_id}: PMS güncelleme başarılı`
      );

      return { success: true, record };
    } catch (err) {
      this.logger.error(`Swap ${body.swap_id}: PMS adapter hatası`, err);

      // Saga compensation: refundIfFailed tetikle
      return {
        success: false,
        reason: 'pms_adapter_error',
        message:
          'PMS adapter hatası. refundIfFailed tetiklenmeli (saga pattern).',
        requires_refund: true,
      };
    }
  }

  // ─── Misafir adı güncelleme ───────────────────────────────────────

  async updateGuestName(body: {
    pms_reference: string;
    new_guest_name: string;
    check_in_date: string;
    check_out_date: string;
    escrow_tx_hash: string;
  }) {
    this.logger.log(
      `Updating guest name for PMS ref: ${body.pms_reference}`
    );

    // §7.4: escrow tx hash kontrolü
    if (!body.escrow_tx_hash) {
      return {
        success: false,
        reason: 'escrow_not_confirmed',
        message: 'Escrow kesinleşmediği için PMS güncellenemez.',
      };
    }

    const result = await this.pmsAdapter.updateReservation({
      pms_reference: body.pms_reference,
      guest_name: body.new_guest_name,
      action: 'update_guest',
    });

    if (!result.success) {
      // Saga compensation
      this.logger.error(
        `PMS ref ${body.pms_reference}: Güncelleme başarısız — refundIfFailed tetiklenmeli`
      );
      return {
        success: false,
        reason: 'pms_update_failed',
        message: 'PMS güncelleme başarısız.',
        requires_refund: true,
      };
    }

    return result;
  }

  // ─── Senkronizasyon durumu ────────────────────────────────────────

  getSyncStatus(swapId: number) {
    const record = syncStore.get(swapId);
    if (!record) {
      return { found: false, swap_id: swapId };
    }
    return { found: true, record };
  }
}
