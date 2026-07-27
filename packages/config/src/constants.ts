// ─── MCC Kodları (SOP §7.2) ────────────────────────────────────────

export const MCC_CODES = {
  TRAVEL_AGENCY: '4722',
  HOTELS: '7011',
  AIRLINES: '4511',
  CAR_RENTAL: '3350',
} as const;

// ─── Fee Oranları (bps = basis points, 100 = %1) ──────────────────

export const FEES = {
  PLATFORM_COMMISSION_BPS: 500, // %5
  CARD_PROCESSING_BPS: 250,     // %2.5
  GAS_FEE_USD: 0.01,            // Polygon gas estimate
  MIN_FIAT_AMOUNT: 100,         // Minimum 100 TRY
  MAX_FIAT_AMOUNT: 500_000,     // Maksimum 500K TRY
} as const;

// ─── Exchange Rate ─────────────────────────────────────────────────

export const EXCHANGE = {
  USDTRY_DEFAULT: 38.5, // Sandbox varsayılan kuru
  USDC_USD: 1.0,        // USDC = 1 USD (stablecoin)
} as const;

// ─── Testnet Adresleri ─────────────────────────────────────────────

export const TESTNET = {
  RPC_URL: 'https://rpc-amoy.polygon.technology',
  USDC_ADDRESS: '0x41E94Eb03E2E3e19458470800010317a3Bf0f774',
  ESCROW_CONTRACT: '0x0000000000000000000000000000000000000000', // Deploy sonrası güncellenecek
} as const;

// ─── Retry Ayarları ────────────────────────────────────────────────

export const RETRY = {
  MAX_ATTEMPTS: 3,
  BACKOFF_DELAY_MS: 1000,
  BACKOFF_MULTIPLIER: 2,
} as const;

// ─── Redis Queue İsimleri ──────────────────────────────────────────

export const QUEUES = {
  ONRAMP: 'onramp-jobs',
  OFFRAMP: 'offramp-jobs',
} as const;
