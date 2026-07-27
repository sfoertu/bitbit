import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

// ─── In-Memory Stores (DB olmadığı için) ────────────────────────────
// Gerçek uygulamada PostgreSQL'e yazılır

interface ConsentRecord {
  user_id: string;
  consent_version: string;
  consented: boolean;
  timestamp: string;
  ip_address: string | null;
}

interface ErasureRecord {
  user_id: string;
  reason: string;
  timestamp: string;
  status: 'completed';
  affected_records: string[];
}

const consentStore = new Map<string, ConsentRecord>();
const erasureStore = new Map<string, ErasureRecord>();
const auditLogs: any[] = [];

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  // ─── Unutulma Hakkı ──────────────────────────────────────────────

  async processErasure(userId: string, reason?: string) {
    this.logger.log(`Erasure request for user: ${userId}`);

    // Rıza kaydını sil
    const hadConsent = consentStore.has(userId);
    consentStore.delete(userId);

    // Audit log'a yaz
    const erasureRecord: ErasureRecord = {
      user_id: userId,
      reason: reason || 'Kullanıcı talebi',
      timestamp: new Date().toISOString(),
      status: 'completed',
      affected_records: hadConsent ? ['consent'] : [],
    };

    erasureStore.set(userId, erasureRecord);

    // Audit log
    auditLogs.push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      actor: 'system',
      action: 'kvkk.erasure_completed',
      entity_type: 'user',
      entity_id: userId,
      metadata: {
        reason: erasureRecord.reason,
        affected_records: erasureRecord.affected_records,
      },
    });

    this.logger.log(
      `Erasure completed for user: ${userId}. ` +
        `Consent record ${hadConsent ? 'deleted' : 'not found'}. ` +
        `Zincirdeki anonim hash zaten anlamsız kalır.`
    );

    return {
      success: true,
      user_id: userId,
      status: 'completed',
      message:
        'Kişisel verileriniz silindi. Zincirdeki anonim hash zaten anlamsızdır.',
      affected_records: erasureRecord.affected_records,
      timestamp: erasureRecord.timestamp,
    };
  }

  // ─── Açık Rıza Kaydetme ──────────────────────────────────────────

  async recordConsent(params: {
    user_id: string;
    consent_version: string;
    consented: boolean;
    ip_address?: string;
  }) {
    this.logger.log(
      `Consent recorded for user: ${params.user_id}, ` +
        `version: ${params.consent_version}, ` +
        `consented: ${params.consented}`
    );

    const record: ConsentRecord = {
      user_id: params.user_id,
      consent_version: params.consent_version,
      consented: params.consented,
      timestamp: new Date().toISOString(),
      ip_address: params.ip_address || null,
    };

    consentStore.set(params.user_id, record);

    // Audit log
    auditLogs.push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      actor: `user:${params.user_id}`,
      action: params.consented
        ? 'kvkk.consent_given'
        : 'kvkk.consent_rejected',
      entity_type: 'user',
      entity_id: params.user_id,
      metadata: {
        consent_version: params.consent_version,
        consented: params.consented,
      },
    });

    return {
      success: true,
      user_id: params.user_id,
      consented: params.consented,
      consent_version: params.consent_version,
      timestamp: record.timestamp,
    };
  }

  // ─── Rıza Durumu Sorgula ──────────────────────────────────────────

  async checkConsent(userId: string) {
    const record = consentStore.get(userId);

    if (!record) {
      return {
        found: false,
        user_id: userId,
        consented: false,
        message: 'Kayıt bulunamadı — onay verilmemiş.',
      };
    }

    return {
      found: true,
      user_id: userId,
      consented: record.consented,
      consent_version: record.consent_version,
      timestamp: record.timestamp,
    };
  }
}
