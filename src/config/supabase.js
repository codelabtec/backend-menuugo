// config/supabase.js
import dotenv from 'dotenv';
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('SUPABASE_URL:', supabaseUrl);  // Verifique se a variável está correta
console.log('SUPABASE_KEY:', supabaseKey);  // Verifique se a variável está correta

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL ou SUPABASE_KEY não estão configurados.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
