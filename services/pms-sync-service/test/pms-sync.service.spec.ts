import { Test, TestingModule } from '@nestjs/testing';
import { PmsSyncService } from '../src/pms-sync.service';
import { SandboxPmsAdapter } from '../src/adapters/sandbox-pms-adapter';

describe('PmsSyncService', () => {
  let service: PmsSyncService;
  let adapter: SandboxPmsAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PmsSyncService, SandboxPmsAdapter],
    }).compile();

    service = module.get<PmsSyncService>(PmsSyncService);
    adapter = module.get<SandboxPmsAdapter>(SandboxPmsAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── Escrow Completed Webhook ─────────────────────────────────────

  describe('processEscrowCompleted', () => {
    it('should reject if escrow_tx_hash is missing (§7.4)', async () => {
      const result = await service.processEscrowCompleted({
        swap_id: 1,
        buyer_address: '0xBuyer',
        seller_address: '0xSeller',
        reservation_hash: '0xReservation',
        escrow_tx_hash: '', // Boş — escrow kesinleşmemiş
      });

      expect(result.success).toBe(false);
      expect(result.reason).toBe('escrow_not_confirmed');
    });

    it('should process if escrow_tx_hash is present', async () => {
      const result = await service.processEscrowCompleted({
        swap_id: 2,
        buyer_address: '0xBuyer',
        seller_address: '0xSeller',
        reservation_hash: '0xReservation',
        escrow_tx_hash: '0xEscrowTxHash123',
      });

      expect(result.success).toBe(true);
      expect(result.record).toBeDefined();
      expect(result.record.pms_status).toBe('completed');
    });
  });

  // ─── Guest Update ─────────────────────────────────────────────────

  describe('updateGuestName', () => {
    it('should reject if escrow not confirmed (§7.4)', async () => {
      const result = await service.updateGuestName({
        pms_reference: '0xRef',
        new_guest_name: 'Ahmet',
        check_in_date: '2026-08-15',
        check_out_date: '2026-08-17',
        escrow_tx_hash: '',
      });

      expect(result.success).toBe(false);
      expect((result as any).reason).toBe('escrow_not_confirmed');
    });

    it('should update guest if escrow confirmed', async () => {
      const result = await service.updateGuestName({
        pms_reference: '0xRef',
        new_guest_name: 'Ahmet',
        check_in_date: '2026-08-15',
        check_out_date: '2026-08-17',
        escrow_tx_hash: '0xHash',
      });

      expect(result.success).toBe(true);
    });
  });

  // ─── Status ───────────────────────────────────────────────────────

  describe('getSyncStatus', () => {
    it('should return not found for unknown swap', () => {
      const status = service.getSyncStatus(999);
      expect(status.found).toBe(false);
    });

    it('should return record after processing', async () => {
      await service.processEscrowCompleted({
        swap_id: 10,
        buyer_address: '0xBuyer',
        seller_address: '0xSeller',
        reservation_hash: '0xRes',
        escrow_tx_hash: '0xHash',
      });

      const status = service.getSyncStatus(10);
      expect(status.found).toBe(true);
      expect(status.record.pms_status).toBe('completed');
    });
  });
});
