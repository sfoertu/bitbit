import { Injectable, Logger } from '@nestjs/common';

// ─── Sandbox PMS Adapter ───────────────────────────────────────────
// Adapter Pattern: Gerçek Opera/Fidelio yerine mock sandbox
// Tüm PMS/GDS entegrasyonları bu arayüz üzerinden yapılacak
//
// Gerçek implementasyonda:
// - Opera PMS REST API adaptörü
// - Fidelio adaptörü
// - Amadeus GDS adaptörü
// vb. buraya eklenecek

export interface PmsUpdateRequest {
  pms_reference: string;
  guest_name: string;
  action: 'update_guest' | 'cancel' | 'confirm';
}

export interface PmsUpdateResult {
  success: boolean;
  pms_reference: string;
  message: string;
  timestamp: string;
}

@Injectable()
export class SandboxPmsAdapter {
  private readonly logger = new Logger(SandboxPmsAdapter.name);

  async updateReservation(request: PmsUpdateRequest): Promise<PmsUpdateResult> {
    this.logger.log(
      `[SANDBOX PMS] Updating reservation: ${request.pms_reference}, action: ${request.action}`
    );

    // Sandbox: her zaman başarılı simülasyon
    // Gerçek Opera/Fidelio API çağrısı burada yapılacak

    const result: PmsUpdateResult = {
      success: true,
      pms_reference: request.pms_reference,
      message: `Guest name updated to: ${request.guest_name}`,
      timestamp: new Date().toISOString(),
    };

    this.logger.log(
      `[SANDBOX PMS] Reservation updated: ${request.pms_reference}`
    );

    return result;
  }
}
