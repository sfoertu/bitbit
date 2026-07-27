import { Controller, Post, Get, Body, Param, HttpCode } from '@nestjs/common';
import { PmsSyncService } from './pms-sync.service';

// ─── PMS/GDS Senkronizasyon Servisi ────────────────────────────────
// Adapter Pattern: Gerçek Opera/Fidelio yerine sandbox mock
//
// KRİTİK KURAL (§7.4):
// PMS güncellemesi, escrow işlemi zincirde kesinleşmeden ASLA yapılmamalı.
// Bu servis, escrow'un "completed" durumunu bekleyecek şekilde tasarlandı.
// Gerçek zincir bağlantısı geldiğinde (Faz 1/2 entegrasyonu),
// escrow_status === 'completed' kontrolü eklenecek.

@Controller('pms')
export class PmsSyncController {
  constructor(private readonly pmsSyncService: PmsSyncService) {}

  // ─── Webhook: Escrow tamamlanma bildirimi ──────────────────────────
  // Escrow contract'tan gelen callback'i simüle eder
  // §7.4: Bu webhook escrow "completed" durumundan SONRA tetiklenmeli

  @Post('webhook/escrow-completed')
  @HttpCode(200)
  async handleEscrowCompleted(
    @Body()
    body: {
      swap_id: number;
      buyer_address: string;
      seller_address: string;
      reservation_hash: string;
      escrow_tx_hash: string;
    }
  ) {
    return this.pmsSyncService.processEscrowCompleted(body);
  }

  // ─── REST: PMS güncelleme isteği ───────────────────────────────────
  // Servislerden çağrılır — escrow tamamlandıktan sonra

  @Post('update-guest')
  @HttpCode(200)
  async updateGuest(
    @Body()
    body: {
      pms_reference: string;
      new_guest_name: string;
      check_in_date: string;
      check_out_date: string;
      escrow_tx_hash: string;
    }
  ) {
    return this.pmsSyncService.updateGuestName(body);
  }

  // ─── REST: Senkronizasyon durumu sorgula ────────────────────────────

  @Get('status/:swapId')
  async getStatus(@Param('swapId') swapId: string) {
    return this.pmsSyncService.getSyncStatus(parseInt(swapId));
  }
}
