// ─── Environment Variable Validasyonu ───────────────────────────────
// Hiçbir private key / API key burada hardcoded değil
// Tüm değerler env değişkenlerinden okunur

export interface AppConfig {
  NODE_ENV: string;
  PORT: number;

  // Database
  DATABASE_URL: string;

  // Redis
  REDIS_URL: string;

  // On-ramp sandbox
  ONRAMP_SANDBOX_URL: string;
  ONRAMP_SANDBOX_KEY: string;

  // Off-ramp sandbox
  OFFRAMP_SANDBOX_URL: string;
  OFFRAMP_SANDBOX_KEY: string;
}

export function loadConfig(): AppConfig {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),

    DATABASE_URL:
      process.env.DATABASE_URL ||
      'postgresql://bitbit:bitbit@localhost:5432/bitbit',

    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

    ONRAMP_SANDBOX_URL:
      process.env.ONRAMP_SANDBOX_URL || 'https://sandbox.onramp-provider.com',
    ONRAMP_SANDBOX_KEY: process.env.ONRAMP_SANDBOX_KEY || 'sk_test_sandbox',

    OFFRAMP_SANDBOX_URL:
      process.env.OFFRAMP_SANDBOX_URL ||
      'https://sandbox.offramp-provider.com',
    OFFRAMP_SANDBOX_KEY: process.env.OFFRAMP_SANDBOX_KEY || 'sk_test_sandbox',
  };
}
