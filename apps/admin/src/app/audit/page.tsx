"use client";

import { useState } from "react";

// ─── Audit Log Görüntüleme Sayfası ─────────────────────────────────
// SOP §5: audit_logs tablosu (in-memory)

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, any>;
}

const mockLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    actor: "admin:ahmet",
    action: "pause.request",
    entity_type: "system",
    entity_id: "global",
    metadata: { reason: "Şüpheli aktivite tespit edildi" },
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actor: "system",
    action: "onramp.execute",
    entity_type: "transaction",
    entity_id: "tx-001",
    metadata: { amount_fiat: 6000, currency: "TRY" },
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    actor: "system",
    action: "offramp.execute",
    entity_type: "transaction",
    entity_id: "tx-001",
    metadata: { amount_usdc: 142.5, fast_ref: "FAST_123" },
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    actor: "user:zeynep",
    action: "kvkk.consent_given",
    entity_type: "user",
    entity_id: "user-zeynep",
    metadata: { consent_version: "v1.0" },
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    actor: "user:ahmet",
    action: "kvkk.erasure_requested",
    entity_type: "user",
    entity_id: "user-ahmet",
    metadata: { reason: "Hesap silme talebi" },
  },
];

export default function AuditPage() {
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [filter, setFilter] = useState("");

  const filtered = filter
    ? logs.filter(
        (l) =>
          l.action.includes(filter) ||
          l.actor.includes(filter) ||
          l.entity_type.includes(filter)
      )
    : logs;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
      <p className="mt-1 text-sm text-gray-500">
        Tüm sistem işlemleri ve yöneticilik eylemleri
      </p>

      {/* Filtre */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="İşlem, aktör veya varlık ara..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
        />
      </div>

      {/* Log tablosu */}
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Zaman</th>
              <th className="px-4 py-3">Aktör</th>
              <th className="px-4 py-3">İşlem</th>
              <th className="px-4 py-3">Varlık</th>
              <th className="px-4 py-3">Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{log.id}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(log.timestamp).toLocaleString("tr-TR")}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {log.actor}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {log.action}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {log.entity_type}/{log.entity_id}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-gray-500">
                  {JSON.stringify(log.metadata)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Toplam {filtered.length} kayıt
      </p>
    </div>
  );
}
