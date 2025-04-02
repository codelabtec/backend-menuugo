import { supabase } from '../config/supabase.js';
import generateCode from '../utils/generateCode.js';

// ✅ Criar um novo usuário
export async function criarUsuario(nome, email, senha, numero) {
  try {
    // console.log('📥 Dados recebidos:', { nome, email, senha, numero });

     // Primeiro, verificar se o email já existe
     const { data: usuarioExistente, error: checkError } = await supabase
     .from('Usuarios')
     .select('email')
     .eq('email', email)
     .maybeSingle();
   
   if (checkError) {
     console.error('🚨 Erro ao verificar email existente:', checkError.message);
     throw new Error(`Erro ao verificar email: ${checkError.message}`);
   }
   
   if (usuarioExistente) {
     // Retornar um objeto de erro formatado para ser capturado pelo controller
     return { 
       error: true, 
       code: 'EMAIL_EXISTS',
       message: 'Este email já está cadastrado' 
     };
   }
   
   // Se o email não existe, prosseguir com a inserção
   const { data, error } = await supabase
     .from('Usuarios')
     .insert([{ nome, email, senha, numero }])
     .select();
   
   if (error) {
     console.error('🚨 Erro ao tentar inserir no Supabase:', error.message);
     throw new Error(`Erro ao cadastrar usuário: ${error.message}`);
   }

    console.log('✅ Usuário cadastrado com sucesso:', data);
    return {
      success: true,
      data: data,
      message: 'Usuário cadastrado com sucesso!',
    };

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