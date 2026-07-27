import { Test, TestingModule } from '@nestjs/testing';
import { OfframpService } from '../src/offramp.service';
import { SandboxProvider } from '../src/providers/sandbox-provider';

describe('OfframpService', () => {
  let service: OfframpService;
  let sandbox: SandboxProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfframpService, SandboxProvider],
    }).compile();

    service = module.get<OfframpService>(OfframpService);
    sandbox = module.get<SandboxProvider>(SandboxProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── Execute Tests ────────────────────────────────────────────────

  describe('execute', () => {
    it('should process off-ramp successfully', async () => {
      const result = await service.execute(
        'off-key-001',
        1,
        '0xSellerAddress',
        'TR330006100519786457841310',
        100
      );

      expect(result.idempotency_key).toBe('off-key-001');
      expect(result.offramp_status).toBe('completed');
      expect(result.amount_try).toBeGreaterThan(0);
      expect(result.fast_reference).toBeDefined();
      expect(result.exchange_rate).toBe(38.5);
    });

    it('should return same result for duplicate idempotency key', async () => {
      const first = await service.execute(
        'off-dup-001',
        2,
        '0xSeller1',
        'TR330006100519786457841310',
        50
      );

      const second = await service.execute(
        'off-dup-001',
        999, // Farklı swap_id — dikkate alınmamalı
        '0xOtherSeller',
        'TR OTHER IBAN',
        99999
      );

      expect(second.idempotency_key).toBe(first.idempotency_key);
      expect(second.amount_try).toBe(first.amount_try);
      expect(second.offramp_status).toBe(first.offramp_status);
    });
  });

  // ─── Status Tests ────────────────────────────────────────────────

  describe('getStatus', () => {
    it('should return transaction status', async () => {
      await service.execute(
        'off-status-001',
        3,
        '0xSeller',
        'TR330006100519786457841310',
        200
      );

      const status = await service.getStatus('off-status-001');
      expect(status.found).toBe(true);
      expect(status.status).toBe('completed');
      expect(status.transaction).toBeDefined();
    });

    it('should return not found for unknown key', async () => {
      const status = await service.getStatus('off-nonexistent');
      expect(status.found).toBe(false);
    });
  });
});
