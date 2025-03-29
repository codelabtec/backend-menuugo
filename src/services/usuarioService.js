import { supabase } from '../config/supabase.js';
import generateCode from '../utils/generateCode.js';

// ✅ Criar um novo usuário
export async function criarUsuario(nome, email, senha, numero) {
  try {
    console.log('📥 Dados recebidos:', { nome, email, senha, numero });

    const { data, error } = await supabase
      .from('Usuarios') // Certifique-se de que a tabela está corretamente nomeada
      .insert([{ nome, email, senha, numero }])
      .select(); // Retorna os dados inseridos

    if (error) {
      console.error('🚨 Erro ao tentar inserir no Supabase:', error.message);
      throw new Error(`Erro ao cadastrar usuário: ${error.message}`);
    }

    console.log('✅ Usuário cadastrado com sucesso:', data);
    return data;
  } catch (err) {
    console.error('❌ Erro na função de cadastro:', err.message);
    throw new Error('Erro ao cadastrar usuário.');
  }
}

// ✅ Fazer login do usuário
export async function loginUsuario(email, senha) {
  try {
    const { data, error } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('email', email)
      .eq('senha', senha)
      .single();

    if (error || !data) {
      console.error('🚨 Erro no login:', error?.message || 'Usuário não encontrado');
      throw new Error('Usuário ou senha inválidos.');
    }

    return data;
  } catch (err) {
    console.error('❌ Erro na função de login:', err.message);
    throw new Error('Erro ao realizar login.');
  }
}

// ✅ Recuperar senha do usuário
export async function recuperarSenha(email) {
  try {
    const { data, error } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      console.error('🚨 Usuário não encontrado:', error?.message);
      throw new Error('Usuário não encontrado.');
    }

    const codigoRecuperacao = generateCode();

    const { error: updateError } = await supabase
      .from('Usuarios')
      .update({ cod_rec: codigoRecuperacao })
      .eq('email', email);

    if (updateError) {
      console.error('🚨 Erro ao atualizar código de recuperação:', updateError.message);
      throw new Error('Erro ao atualizar o código de recuperação.');
    }

    return { message: 'Código de recuperação enviado.' };
  } catch (err) {
    console.error('❌ Erro na função de recuperação de senha:', err.message);
    throw new Error('Erro ao recuperar senha.');
  }
}

export default { 
  criarUsuario,
  loginUsuario,
  recuperarSenha
};