// ─── BITBIT API Client ──────────────────────────────────────────────
// On-ramp / Off-ramp servisleriyle iletişim
// Gerçek API'ler in-memory olsa da kontrat üzerinden konuşuyoruz
// İleride DB'ye geçince UI değişmeyecek

const ONRAMP_BASE = process.env.NEXT_PUBLIC_ONRAMP_URL || "http://localhost:3001/api";
const OFFRAMP_BASE = process.env.NEXT_PUBLIC_OFFRAMP_URL || "http://localhost:3002/api";

// ─── Types ─────────────────────────────────────────────────────────

export interface QuoteResponse {
  amount_fiat: number;
  amount_usdc: number;
  exchange_rate: number;
  fee_breakdown: {
    card_fee: number;
    gas_fee: number;
    platform_fee: number;
    total_fee: number;
    net_amount: number;
  };
  expires_at: string;
}

export interface ExecuteResponse {
  id: string;
  idempotency_key: string;
  amount_fiat: number;
  amount_usdc: number;
  onramp_status: string;
  provider_reference: string;
  created_at: string;
}

export interface StatusResponse {
  found: boolean;
  idempotency_key: string;
  status: string;
  transaction: ExecuteResponse | null;
}

export interface OfframpExecuteResponse {
  id: string;
  idempotency_key: string;
  swap_id: number;
  seller_address: string;
  iban: string;
  amount_usdc: number;
  amount_try: number;
  exchange_rate: number;
  offramp_status: string;
  fast_reference: string;
  created_at: string;
}

// ─── API Calls ─────────────────────────────────────────────────────

export async function getQuote(
  amountFiat: number,
  currency: string,
  providerType: string
): Promise<QuoteResponse> {
  const res = await fetch(`${ONRAMP_BASE}/onramp/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount_fiat: amountFiat,
      currency,
      provider_type: providerType,
    }),
  });

  if (!res.ok) throw new Error(`Quote failed: ${res.statusText}`);
  return res.json();
}

export async function executeOnramp(params: {
  idempotency_key: string;
  amount_fiat: number;
  currency: string;
  provider_type: string;
  card_token: string;
  reservation_hash: string;
}): Promise<ExecuteResponse> {
  const res = await fetch(`${ONRAMP_BASE}/onramp/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) throw new Error(`Execute failed: ${res.statusText}`);
  return res.json();
}

export async function getOnrampStatus(
  idempotencyKey: string
): Promise<StatusResponse> {
  const res = await fetch(`${ONRAMP_BASE}/onramp/status/${idempotencyKey}`);
  if (!res.ok) throw new Error(`Status check failed: ${res.statusText}`);
  return res.json();
}

export async function executeOfframp(params: {
  idempotency_key: string;
  swap_id: number;
  seller_address: string;
  iban: string;
  amount_usdc: number;
}): Promise<OfframpExecuteResponse> {
  const res = await fetch(`${OFFRAMP_BASE}/offramp/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) throw new Error(`Offramp execute failed: ${res.statusText}`);
  return res.json();
}
