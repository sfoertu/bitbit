-- BITBIT Transactions Tablosu (SOP §5)
-- İdempotency: idempotency_key UNIQUE constraint

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM tipleri
CREATE TYPE onramp_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE offramp_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE pms_sync_status AS ENUM ('pending', 'completed', 'failed');

-- Ana transactions tablosu
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  amount_fiat NUMERIC(18, 2) NOT NULL,
  amount_usdc NUMERIC(18, 6) NOT NULL,
  onramp_status onramp_status NOT NULL DEFAULT 'pending',
  escrow_tx_hash TEXT,
  offramp_status offramp_status NOT NULL DEFAULT 'pending',
  pms_sync_status pms_sync_status NOT NULL DEFAULT 'pending',
  idempotency_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- İndeksler
CREATE INDEX idx_transactions_buyer ON transactions (buyer_id);
CREATE INDEX idx_transactions_listing ON transactions (listing_id);
CREATE INDEX idx_transactions_idempotency ON transactions (idempotency_key);
CREATE INDEX idx_transactions_created ON transactions (created_at);
