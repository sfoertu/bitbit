import * as fs from 'fs';
import * as path from 'path';
import { getPool } from './index';

async function migrate() {
  const pool = getPool();
  const migrationsDir = path.join(__dirname, '..', 'migrations');

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`Running migration: ${file}`);
    await pool.query(sql);
    console.log(`✓ ${file} completed`);
  }

  console.log('All migrations completed.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
