import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceService } from '../src/compliance.service';

describe('ComplianceService — KVKK/GDPR §7.3', () => {
  let service: ComplianceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplianceService],
    }).compile();

    service = module.get<ComplianceService>(ComplianceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── Unutulma Hakkı (Right to Erasure) ─────────────────────────────

  describe('processErasure — §7.3', () => {
    it('kullanıcı silme talebinde bulunamazsa bile başarılı döner', async () => {
      const result = await service.processErasure('user-nonexistent');

      expect(result.success).toBe(true);
      expect(result.status).toBe('completed');
      expect(result.user_id).toBe('user-nonexistent');
    });

    it('mevcut rıza kaydını siler', async () => {
      // Önce rıza kaydet
      await service.recordConsent({
        user_id: 'user-erasure-test',
        consent_version: 'v1.0',
        consented: true,
      });

      // Sil
      const result = await service.processErasure(
        'user-erasure-test',
        'Hesap silme talebi'
      );

      expect(result.success).toBe(true);
      expect(result.affected_records).toContain('consent');

      // Kontrol: artık rıza yok
      const check = await service.checkConsent('user-erasure-test');
      expect(check.found).toBe(false);
    });

    it('zincirdeki hash zaten anlamsız kalır mesajı döner', async () => {
      const result = await service.processErasure('user-hash-test');

      expect(result.message).toContain('anlamsız');
    });
  });

  // ─── Açık Rıza (Consent) ───────────────────────────────────────────

  describe('recordConsent — §7.3', () => {
    it('kullanıcı rıza verdiğinde kaydı tutar', async () => {
      const result = await service.recordConsent({
        user_id: 'user-consent-1',
        consent_version: 'v1.0',
        consented: true,
      });

      expect(result.success).toBe(true);
      expect(result.consented).toBe(true);
      expect(result.consent_version).toBe('v1.0');
    });

    it('kullanıcı rıza vermediğinde de kaydı tutar', async () => {
      const result = await service.recordConsent({
        user_id: 'user-consent-2',
        consent_version: 'v1.0',
        consented: false,
      });

      expect(result.success).toBe(true);
      expect(result.consented).toBe(false);
    });

    it('aynı kullanıcı için rıza güncellenir', async () => {
      await service.recordConsent({
        user_id: 'user-consent-3',
        consent_version: 'v1.0',
        consented: false,
      });

      const updated = await service.recordConsent({
        user_id: 'user-consent-3',
        consent_version: 'v1.1',
        consented: true,
      });

      expect(updated.consented).toBe(true);
      expect(updated.consent_version).toBe('v1.1');
    });
  });

  // ─── Rıza Durumu Sorgula ───────────────────────────────────────────

  describe('checkConsent', () => {
    it('rıza veren kullanıcıyı bulur', async () => {
      await service.recordConsent({
        user_id: 'user-check-1',
        consent_version: 'v1.0',
        consented: true,
      });

      const result = await service.checkConsent('user-check-1');
      expect(result.found).toBe(true);
      expect(result.consented).toBe(true);
    });

   it('kullanıcı bulunamadığında consented=false döner', async () => {
      const result = await service.checkConsent('user-missing');
      expect(result.found).toBe(false);
      expect(result.consented).toBe(false);
    });
  });
});
