import { Test, TestingModule } from '@nestjs/testing';
import { OnrampService } from '../src/onramp.service';
import { SandboxProvider } from '../src/providers/sandbox-provider';

describe('OnrampService', () => {
  let service: OnrampService;
  let sandbox: SandboxProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnrampService, SandboxProvider],
    }).compile();

    service = module.get<OnrampService>(OnrampService);
    sandbox = module.get<SandboxProvider>(SandboxProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── Quote Tests ─────────────────────────────────────────────────

  describe('getQuote', () => {
    it('should return fee breakdown for TRY amount', async () => {
      const result = await service.getQuote(10000, 'TRY', 'hotel');

      expect(result.amount_fiat).toBe(10000);
      expect(result.amount_usdc).toBeGreaterThan(0);
      expect(result.exchange_rate).toBe(38.5);
      expect(result.fee_breakdown).toBeDefined();
      expect(result.fee_breakdown.card_fee).toBeGreaterThan(0);
      expect(result.fee_breakdown.gas_fee).toBeGreaterThan(0);
      expect(result.fee_breakdown.platform_fee).toBeGreaterThan(0);
      expect(result.fee_breakdown.total_fee).toBe(
        result.fee_breakdown.card_fee +
          result.fee_breakdown.gas_fee +
          result.fee_breakdown.platform_fee
      );
      expect(result.expires_at).toBeDefined();
    });

    it('should calculate correct fee amounts', async () => {
      const result = await service.getQuote(100000, 'TRY', 'airline');

      // %2.5 card fee
      expect(result.fee_breakdown.card_fee).toBe(2500);
      // %5 platform fee
      expect(result.fee_breakdown.platform_fee).toBe(5000);
      // Net amount should be positive and reasonable (within rounding tolerance)
      expect(result.fee_breakdown.net_amount).toBeGreaterThan(0);
      expect(result.fee_breakdown.net_amount).toBeLessThan(
        result.amount_usdc * 1.01
      );
    });
  });

  // ─── Execute + Idempotency Tests ──────────────────────────────────

  describe('execute', () => {
    it('should process payment successfully', async () => {
      const result = await service.execute(
        'test-key-001',
        10000,
        'TRY',
        'hotel',
        'tok_test_visa',
        '0xabc123'
      );

      expect(result.idempotency_key).toBe('test-key-001');
      expect(result.onramp_status).toBe('completed');
      expect(result.amount_usdc).toBeGreaterThan(0);
      expect(result.provider_reference).toBeDefined();
    });

    it('should return same result for duplicate idempotency key', async () => {
      const first = await service.execute(
        'dup-key-001',
        5000,
        'TRY',
        'hotel',
        'tok_test',
        '0xdef'
      );

      const second = await service.execute(
        'dup-key-001',
        99999, // Farklı tutar — dikkate alınmamalı
        'USD',
        'airline',
        'tok_other',
        '0xother'
      );

      // İkinci istek aynı sonucu döndürmeli
      expect(second.idempotency_key).toBe(first.idempotency_key);
      expect(second.amount_usdc).toBe(first.amount_usdc);
      expect(second.onramp_status).toBe(first.onramp_status);
    });
  });

  // ─── Status Tests ────────────────────────────────────────────────

  describe('getStatus', () => {
    it('should return transaction status', async () => {
      await service.execute(
        'status-key-001',
        7500,
        'TRY',
        'car_rental',
        'tok_test',
        '0xstatus'
      );

      const status = await service.getStatus('status-key-001');
      expect(status.found).toBe(true);
      expect(status.status).toBe('completed');
      expect(status.transaction).toBeDefined();
    });

    it('should return not found for unknown key', async () => {
      const status = await service.getStatus('nonexistent-key');
      expect(status.found).toBe(false);
    });
  });
});
