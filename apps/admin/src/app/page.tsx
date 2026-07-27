"use client";

import { useEffect, useState } from "react";

// ─── In-memory audit log store (DB olmadığı için) ───────────────────
// Gerçek uygulamada PostgreSQL'e yazılır

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, any>;
}

// In-memory store (servisler arası paylaşılan mock)
const auditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actor: "system",
    action: "onramp.execute",
    entity_type: "transaction",
    entity_id: "tx-001",
    metadata: { amount_fiat: 6000, status: "completed" },
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    actor: "system",
    action: "offramp.execute",
    entity_type: "transaction",
    entity_id: "tx-001",
    metadata: { amount_usdc: 142.5, iban: "TR33***" },
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    actor: "system",
    action: "pms.webhook",
    entity_type: "reservation",
    entity_id: "res-001",
    metadata: { guest_name: "Zeynep", status: "completed" },
  },
];

export default function AdminDashboard() {
  const [logs, setLogs] = useState<AuditLog[]>(auditLogs);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Son işlemler ve sistem durumu
      </p>

      {/* Özet kartlar */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Toplam İşlem" value="3" />
        <StatCard label="Başarılı" value="3" color="green" />
        <StatCard label="Başarısız" value="0" color="red" />
      </div>

      {/* Son işlemler tablosu */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Son İşlemler</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500">
              <tr>
                <th className="px-4 py-3">Zaman</th>
                <th className="px-4 py-3">Aktör</th>
                <th className="px-4 py-3">İşlem</th>
                <th className="px-4 py-3">Varlık</th>
                <th className="px-4 py-3">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString("tr-TR")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {log.actor}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {log.entity_type}/{log.entity_id}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {JSON.stringify(log.metadata)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "gray",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    green: "text-green-600",
    red: "text-red-600",
    gray: "text-gray-900",
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}
