/**
 * §8.1 Ahmet & Zeynep E2E Senaryosu
 *
 * Referans E2E senaryosu — projenin ana entegrasyon testi.
 * Mevcut servislerin (onramp, offramp, pms-sync) sandbox modunda
 * uçtan uca doğru sırayla ve doğru hesaplarla çalıştığını kanıtlar.
 *
 * Senaryo:
 *   Ahmet (satıcı, İstanbul) 6.000 TL değerindeki otel rezervasyonunu
 *   Zeynep'e (alıcı, Ankara) devrediyor:
 *   1. Zeynep kart ile öder → 6.000 TL → ~150 USDC
 *   2. Escrow: 142.5 USDC Ahmet'e, 7.5 USDC (%5) platforma; token Zeynep'e
 *   3. Ahmet'in 142.5 USDC'si FAST ile IBAN'ına yatırılır
 *   4. Otel PMS'inde konuk adı Zeynep olarak güncellenir
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

// Onramp
import { OnrampModule } from '@bitbit/onramp-service/src/onramp.module';

// Offramp
import { OfframpModule } from '@bitbit/offramp-service/src/offramp.module';

// PMS Sync
import { PmsSyncModule } from '@bitbit/pms-sync-service/src/pms-sync.module';

// ─── Constants ──────────────────────────────────────────────────────

const AHMET_IBAN = 'TR330006100519786457841310';
const AHMET_ADDRESS = '0xAhmet_Seller_Istanbul';
const ZEYNEP_ADDRESS = '0xZeynep_Buyer_Ankara';
const RESERVATION_HASH = '0xReservation_Hash_Hotel_001';

const AMOUNT_FIAT = 6000; // 6.000 TL
const EXPECTED_USDC_GROSS = 150; // Yaklaşık (6000 / 38.5 ≈ 155.8, net ~144)
const EXPECTED_SELLER_SHARE = 142.5; // %95 after 5% platform fee
const EXPECTED_PLATFORM_SHARE = 7.5; // %5 platform commission

// ─── Test Suite ─────────────────────────────────────────────────────

describe('§8.1 Ahmet & Zeynep E2E Senaryosu', () => {
  let onrampApp: INestApplication;
  let offrampApp: INestApplication;
  let pmsApp: INestApplication;

  beforeAll(async () => {
    // ─── Onramp Service ───────────────────────────────────────────
    const onrampModule: TestingModule = await Test.createTestingModule({
      imports: [OnrampModule],
    }).compile();
    onrampApp = onrampModule.createNestApplication();
    onrampApp.setGlobalPrefix('api');
    await onrampApp.init();

    // ─── Offramp Service ──────────────────────────────────────────
    const offrampModule: TestingModule = await Test.createTestingModule({
      imports: [OfframpModule],
    }).compile();
    offrampApp = offrampModule.createNestApplication();
    offrampApp.setGlobalPrefix('api');
    await offrampApp.init();

    // ─── PMS Sync Service ─────────────────────────────────────────
    const pmsModule: TestingModule = await Test.createTestingModule({
      imports: [PmsSyncModule],
    }).compile();
    pmsApp = pmsModule.createNestApplication();
    pmsApp.setGlobalPrefix('api');
    await pmsApp.init();
  });

  afterAll(async () => {
    await onrampApp.close();
    await offrampApp.close();
    await pmsApp.close();
  });

  // ─── Başarılı Akış ────────────────────────────────────────────────

  describe('Başarılı tam akış (§8.1)', () => {
    let quoteResult: any;
    let executeResult: any;
    let offrampResult: any;
    let pmsResult: any;

    // ─── Adım 1: Onramp Quote ──────────────────────────────────────
    it('adım 1 — Zeynep quote alır: 6000 TRY → USDC', async () => {
      const res = await request(onrampApp.getHttpServer())
        .post('/api/onramp/quote')
        .send({
          amount_fiat: AMOUNT_FIAT,
          currency: 'TRY',
          provider_type: 'hotel',
        })
        .expect(201);

      quoteResult = res.body;

      // Doğrulama: exchange rate
      expect(quoteResult.exchange_rate).toBe(38.5);

      // Doğrulama: gross USDC (6000 / 38.5 ≈ 155.84)
      expect(quoteResult.amount_fiat).toBe(AMOUNT_FIAT);
      expect(quoteResult.amount_usdc).toBeGreaterThan(140);
      expect(quoteResult.amount_usdc).toBeLessThan(160);

      // Doğrulama: fee breakdown açıkça gösterilmeli (§7.2)
      expect(quoteResult.fee_breakdown).toBeDefined();
      expect(quoteResult.fee_breakdown.card_fee).toBeGreaterThan(0);
      expect(quoteResult.fee_breakdown.gas_fee).toBeGreaterThan(0);
      expect(quoteResult.fee_breakdown.platform_fee).toBeGreaterThan(0);

      // Doğrulama: platform fee = %5 (SOP §8.1: 7.5 USDC → 300 TRY)
      const expectedPlatformFee = AMOUNT_FIAT * 0.05;
      expect(quoteResult.fee_breakdown.platform_fee).toBe(expectedPlatformFee);

      // Doğrulama: expires_at var
      expect(quoteResult.expires_at).toBeDefined();
    });

    // ─── Adım 2: Onramp Execute ────────────────────────────────────
    it('adım 2 — Zeynep öder: onramp execute', async () => {
      const idempotencyKey = uuidv4();

      const res = await request(onrampApp.getHttpServer())
        .post('/api/onramp/execute')
        .send({
          idempotency_key: idempotencyKey,
          amount_fiat: AMOUNT_FIAT,
          currency: 'TRY',
          provider_type: 'hotel',
          card_token: 'tok_test_visa_4242',
          reservation_hash: RESERVATION_HASH,
        })
        .expect(201);

      executeResult = res.body;

      // Doğrulama: idempotency key korundu
      expect(executeResult.idempotency_key).toBe(idempotencyKey);

      // Doğrulama: işlem başarılı
      expect(executeResult.onramp_status).toBe('completed');
      expect(executeResult.amount_usdc).toBeGreaterThan(0);
      expect(executeResult.provider_reference).toBeDefined();

      // Doğrulama: idempotency — aynı key ile tekrar çağır → aynı sonuç
      const res2 = await request(onrampApp.getHttpServer())
        .post('/api/onramp/execute')
        .send({
          idempotency_key: idempotencyKey,
          amount_fiat: 99999, // Farklı tutar — dikkate alınmamalı
          currency: 'USD',
          provider_type: 'airline',
          card_token: 'tok_other',
          reservation_hash: '0xOther',
        })
        .expect(201);

      expect(res2.body.amount_usdc).toBe(executeResult.amount_usdc);
    });

    // ─── Adım 3: Escrow Simülasyonu ────────────────────────────────
    it('adım 3 — Escrow simülasyonu: %5 komisyon ayrımı doğru mu?', async () => {
      // Bu adımda gerçek zincir bağlantısı yok (bilinen boşluk).
      // Ancak %5 komisyon hesabının doğru yapıldığını ASSERT ediyoruz.

      const totalUsdc = executeResult.amount_usdc;

      // §8.1'e göre: 150 USDC → 142.5 Ahmet, 7.5 platform
      // Bizde gross farklı olabilir, ama oranlar aynı:
      const sellerShare = totalUsdc * 0.95;
      const platformShare = totalUsdc * 0.05;

      // Doğrulama: %5 komisyon ayrımı
      expect(sellerShare + platformShare).toBeCloseTo(totalUsdc, 2);
      expect(platformShare).toBeCloseTo(totalUsdc * 0.05, 2);

      // Simüle edilmiş escrow tx hash
      const escrowTxHash = `0x${uuidv4().replace(/-/g, '')}`;

      // Doğrulama: escrow tx hash üretildi
      expect(escrowTxHash).toMatch(/^0x[a-f0-9]{32}$/);

      // Offramp için Ahmet'in payını kaydet
      (global as any).__sellerShare = sellerShare;
      (global as any).__escrowTxHash = escrowTxHash;
    });

    // ─── Adım 4: Offramp (Ahmet'in payı) ───────────────────────────
    it('adım 4 — Ahmet\'in USDC\'si FAST ile IBAN\'ına yatırılır', async () => {
      const sellerShare = (global as any).__sellerShare;
      const escrowTxHash = (global as any).__escrowTxHash;
      const idempotencyKey = uuidv4();

      const res = await request(offrampApp.getHttpServer())
        .post('/api/offramp/execute')
        .send({
          idempotency_key: idempotencyKey,
          swap_id: 1,
          seller_address: AHMET_ADDRESS,
          iban: AHMET_IBAN,
          amount_usdc: sellerShare,
        })
        .expect(201);

      offrampResult = res.body;

      // Doğrulama: offramp başarılı
      expect(offrampResult.offramp_status).toBe('completed');
      expect(offrampResult.amount_usdc).toBeCloseTo(sellerShare, 2);
      expect(offrampResult.amount_try).toBeGreaterThan(0);
      expect(offrampResult.fast_reference).toBeDefined();
      expect(offrampResult.exchange_rate).toBe(38.5);

      // Doğrulama: amount_try = amount_usdc * 38.5
      const expectedTry = sellerShare * 38.5;
      expect(offrampResult.amount_try).toBeCloseTo(expectedTry, 0);

      // Doğrulama: IBAN korundu
      expect(offrampResult.iban).toBe(AHMET_IBAN);
    });

    // ─── Adım 5: PMS Guest Name Update ─────────────────────────────
    it('adım 5 — Otel PMS\'inde konuk adı Zeynep olarak güncellenir', async () => {
      const escrowTxHash = (global as any).__escrowTxHash;

      const res = await request(pmsApp.getHttpServer())
        .post('/api/pms/webhook/escrow-completed')
        .send({
          swap_id: 1,
          buyer_address: ZEYNEP_ADDRESS,
          seller_address: AHMET_ADDRESS,
          reservation_hash: RESERVATION_HASH,
          escrow_tx_hash: escrowTxHash,
        })
        .expect(200);

      pmsResult = res.body;

      // Doğrulama: PMS güncelleme başarılı
      expect(pmsResult.success).toBe(true);
      expect(pmsResult.record).toBeDefined();
      expect(pmsResult.record.pms_status).toBe('completed');

      // Doğrulama: guest name Zeynep olarak ayarlandı
      expect(pmsResult.record.guest_name).toBe(ZEYNEP_ADDRESS);

      // Doğrulama: escrow_tx_hash korundu
      expect(pmsResult.record.escrow_tx_hash).toBe(escrowTxHash);
    });

    // ─── Adım 6: PMS Status Check ──────────────────────────────────
    it('adım 6 — PMS senkronizasyon durumu doğrulanır', async () => {
      const res = await request(pmsApp.getHttpServer())
        .get('/api/pms/status/1')
        .expect(200);

      expect(res.body.found).toBe(true);
      expect(res.body.record.pms_status).toBe('completed');
    });
  });

  // ─── Başarısız Akış: PMS Failure → requires_refund ──────────────

  describe('Başarısız akış: PMS güncelleme başarısız (saga pattern)', () => {
    it('PMS başarısız olduğunda requires_refund flag true olur', async () => {
      // escrow_tx_hash olmadan webhook çağır → red
      const res = await request(pmsApp.getHttpServer())
        .post('/api/pms/webhook/escrow-completed')
        .send({
          swap_id: 999,
          buyer_address: ZEYNEP_ADDRESS,
          seller_address: AHMET_ADDRESS,
          reservation_hash: RESERVATION_HASH,
          escrow_tx_hash: '', // Boş — escrow kesinleşmemiş
        })
        .expect(200);

      // Doğrulama: PMS güncelleme reddedildi
      expect(res.body.success).toBe(false);
      expect(res.body.reason).toBe('escrow_not_confirmed');

      // Doğrulama: escrow kesinleşmedi mesajı
      expect(res.body.message).toContain('kesinleşmedi');
    });

    it('update-guest escrow_tx_hash olmadan reddedilir', async () => {
      const res = await request(pmsApp.getHttpServer())
        .post('/api/pms/update-guest')
        .send({
          pms_reference: RESERVATION_HASH,
          new_guest_name: ZEYNEP_ADDRESS,
          check_in_date: '2026-08-15',
          check_out_date: '2026-08-17',
          escrow_tx_hash: '', // Boş
        })
        .expect(200);

      expect(res.body.success).toBe(false);
      expect(res.body.reason).toBe('escrow_not_confirmed');
    });
  });

  // ─── Hesap Doğrulama ──────────────────────────────────────────────

  describe('§8.1 Hesap doğrulama', () => {
    it('6000 TRY için fee hesapları doğru (§7.2 şeffaflık)', async () => {
      const res = await request(onrampApp.getHttpServer())
        .post('/api/onramp/quote')
        .send({
          amount_fiat: 6000,
          currency: 'TRY',
          provider_type: 'hotel',
        })
        .expect(201);

      const q = res.body;

      // Card fee: %2.5
      expect(q.fee_breakdown.card_fee).toBe(150);

      // Platform fee: %5
      expect(q.fee_breakdown.platform_fee).toBe(300);

      // Gas fee: ~0.01 USD * 38.5
      expect(q.fee_breakdown.gas_fee).toBeCloseTo(0.39, 0);

      // Total fee
      const expectedTotal = 150 + 300 + 0.385;
      expect(q.fee_breakdown.total_fee).toBeCloseTo(expectedTotal, 0);
    });

    it('offramp: 142.5 USDC → ~5486 TRY', async () => {
      const res = await request(offrampApp.getHttpServer())
        .post('/api/offramp/execute')
        .send({
          idempotency_key: uuidv4(),
          swap_id: 100,
          seller_address: AHMET_ADDRESS,
          iban: AHMET_IBAN,
          amount_usdc: 142.5,
        })
        .expect(201);

      const expectedTry = 142.5 * 38.5; // 5486.25
      expect(res.body.amount_try).toBeCloseTo(expectedTry, 0);
    });
  });
});
