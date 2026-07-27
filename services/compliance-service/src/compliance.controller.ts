import { Controller, Post, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { ComplianceService } from './compliance.service';

// ─── KVKK/GDPR Compliance Service ──────────────────────────────────
// §7.3: Kişisel veriler asla zincire yazılmaz, off-chain'de tutulur
// "Unutulma hakkı" (right to erasure) uygulanabilir olmalı

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  // ─── Unutulma Hakkı (Right to Erasure) ────────────────────────────
  // §7.3: Kullanıcı silme talep ettiğinde off-chain kayıt silinir;
  //       zincirdeki anonim hash zaten anlamsız kalır

  @Delete('erasure/:userId')
  @HttpCode(200)
  async requestErasure(
    @Param('userId') userId: string,
    @Body() body: { reason?: string }
  ) {
    return this.complianceService.processErasure(userId, body.reason);
  }

  // ─── Açık Rıza (Consent) ─────────────────────────────────────────
  // §7.3: Kayıt sırasında açık rıza (consent) akışı zorunlu

  @Post('consent')
  @HttpCode(201)
  async recordConsent(
    @Body()
    body: {
      user_id: string;
      consent_version: string;
      consented: boolean;
      ip_address?: string;
    }
  ) {
    return this.complianceService.recordConsent(body);
  }

  // ─── Rıza Durumu Sorgula ──────────────────────────────────────────

  @Post('consent/check')
  @HttpCode(200)
  async checkConsent(@Body() body: { user_id: string }) {
    return this.complianceService.checkConsent(body.user_id);
  }
}
