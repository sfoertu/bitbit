import { Pool, PoolConfig } from 'pg';

let pool: Pool | null = null;

export function getPool(config?: PoolConfig): Pool {
  if (!pool) {
    pool = new Pool(
      config || {
        connectionString:
          process.env.DATABASE_URL ||
          'postgresql://bitbit:bitbit@localhost:5432/bitbit',
      }
    );
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// ─── Query Helper ───────────────────────────────────────────────────

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}
