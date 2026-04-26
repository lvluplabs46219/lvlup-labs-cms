import {  } from '-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Use a global pool to prevent connection exhaustion during hot reloads in development
const globalForPool = globalThis as unknown as {
  pool: Pool | undefined;
};

export const pool =
  globalForPool.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add SSL config if needed for production (e.g. Neon, Supabase, RDS)
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

if (process.env.NODE_ENV !== 'production') globalForPool.pool = pool;

// Export the decoupled DB instance with schema
export const db = (pool, { schema });

