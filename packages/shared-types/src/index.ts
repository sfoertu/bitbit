// ─── Enums ──────────────────────────────────────────────────────────

export enum OnrampStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum OfframpStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum PmsSyncStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ProviderType {
  HOTEL = 'hotel',
  AIRLINE = 'airline',
  CAR_RENTAL = 'car_rental',
}

// ─── Transaction ────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  listing_id: string;
  buyer_id: string;
  amount_fiat: number;
  amount_usdc: number;
  onramp_status: OnrampStatus;
  escrow_tx_hash: string | null;
  offramp_status: OfframpStatus;
  pms_sync_status: PmsSyncStatus;
  idempotency_key: string;
  created_at: Date;
  completed_at: Date | null;
}

// ─── Fee Breakdown ──────────────────────────────────────────────────

export interface FeeBreakdown {
  card_fee: number;
  gas_fee: number;
  platform_fee: number;
  total_fee: number;
  net_amount: number;
}

export interface QuoteResponse {
  amount_fiat: number;
  amount_usdc: number;
  exchange_rate: number;
  fee_breakdown: FeeBreakdown;
  expires_at: string;
}

// ─── DTOs ───────────────────────────────────────────────────────────

export interface OnrampQuoteRequest {
  amount_fiat: number;
  currency: string;
  provider_type: ProviderType;
}

export interface OnrampExecuteRequest {
  idempotency_key: string;
  amount_fiat: number;
  currency: string;
  provider_type: ProviderType;
  card_token: string;
  reservation_hash: string;
}

export interface OfframpExecuteRequest {
  idempotency_key: string;
  swap_id: number;
  seller_address: string;
  iban: string;
  amount_usdc: number;
}

export interface StatusResponse {
  idempotency_key: string;
  status: OnrampStatus | OfframpStatus;
  transaction: Transaction | null;
}
