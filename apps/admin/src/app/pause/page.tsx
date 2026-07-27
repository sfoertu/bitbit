"use client";

import { useState } from "react";

// ─── Emergency Stop / Pause UI ──────────────────────────────────────
// §3.4: Multi-sig pause — gerçek kontrat çağrısı YOK
// Sadece UI + backend'e "pause isteği" gönderiyormuş gibi davranan stub

export default function PausePage() {
  const [pauseRequested, setPauseRequested] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  async function handlePauseRequest() {
    if (!reason.trim()) return;

    setStatus("sending");

    // Stub: backend'e pause isteği gönder (gerçek API çağrısı değil)
    try {
      // Gerçek uygulamada: POST /api/admin/pause
      // Şimdilik simülasyon
      await new Promise((resolve) => setTimeout(resolve, 500));

      setStatus("sent");
      setPauseRequested(true);

      // Audit log'a yaz
      console.log("[AUDIT] pause.request", {
        actor: "admin",
        reason,
        timestamp: new Date().toISOString(),
      });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Emergency Stop</h1>
      <p className="mt-1 text-sm text-gray-500">
        Sistemi durdur — tüm işlemleri askıya al
      </p>

      {/* Uyarı */}
      <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-yellow-600">⚠️</span>
          <div>
            <h3 className="font-semibold text-yellow-800">
              Dikkat: Bu işlem geri alınamaz
            </h3>
            <p className="mt-1 text-sm text-yellow-700">
              Emergency stop tüm işlemleri durdurur. Yalnızca multi-sig (en
              az 2/3 imza) ile geri alınabilir.
            </p>
          </div>
        </div>
      </div>

      {/* Pause formu */}
      <div className="mt-6 max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <label className="block text-sm font-medium text-gray-700">
          Durdurma Nedeni
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Neden durduruyorsunuz? (zorunlu)"
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
          rows={3}
        />

        <button
          onClick={handlePauseRequest}
          disabled={!reason.trim() || status === "sending" || pauseRequested}
          className="mt-4 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {status === "sending"
            ? "Gönderiliyor..."
            : pauseRequested
              ? "✓ İstek Gönderildi"
              : "Sistemi Durdur"}
        </button>
      </div>

      {/* Durum */}
      {status === "sent" && (
        <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
          Pause isteği gönderildi. Multi-sig onayı bekleniyor.
        </div>
      )}
      {status === "error" && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          İstek gönderilemedi. Lütfen tekrar deneyin.
        </div>
      )}

      {/* Mevcut durum */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Sistem Durumu
        </h2>
        <div className="mt-4 space-y-2">
          <StatusRow label="On-Ramp" status="active" />
          <StatusRow label="Off-Ramp" status="active" />
          <StatusRow label="Escrow" status="active" />
          <StatusRow label="PMS Sync" status="active" />
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  status,
}: {
  label: string;
  status: "active" | "paused";
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
          status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {status === "active" ? "● Aktif" : "● Durduruldu"}
      </span>
    </div>
  );
}
