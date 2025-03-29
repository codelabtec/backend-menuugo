import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const createUser = async (nome, email, senha, numero) => {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([
      { nome, email, senha, numero }
    ]);
  if (error) throw error;
  return data;
};

const getUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();
  if (error) throw error;
  return data;
};

export default {
  createUser,
  getUserByEmail,
};
