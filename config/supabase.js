import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Client Supabase
export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  // SERVICE_ROLE_KEY si disponible, sinon ANON_KEY
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
);
