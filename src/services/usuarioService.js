import { supabase } from '../config/supabase.js';
import generateCode from '../utils/generateCode.js';
import 'dotenv/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


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

    try{ 
      const result = await resend.emails.send({
        from: 'MenuuGo - Cardápios Digitais <no-reply@menuugo.com>',
        to: [email],
        subject: 'Recuperação de Senha',
        html:`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperação de Senha Menuugo</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              font-family: 'Inter', sans-serif;
            }
            
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #E71D36;
              overflow: hidden;
            }
            
            .header {
              text-align: center;
              padding: 16px 0;
              background-color: #E71D36;
            }
            
            .header img {
              width: 150px;
              margin: 0 auto;
              display: block;
            }
            
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0px;
            }
            
            h1 {
              text-align: center;
              color: #1F1E1E;
              font-weight: 600;
              margin-top: 0;
              font-size: 32px;
              line-height: 120%;
            }
            
            p {
              color: #555;
              line-height: 1.6;
              margin: 15px 0;
            }
            
            .code {
              font-size: 24px;
              background-color: #EBEBEB;
              padding: 16px;
              border-radius: 8px;
              color: #238F19;
              text-align: center;
              font-weight: 600;
              margin: 20px 0;
            }
            
            hr {
              border: none;
              height: 1px;
              background-color: #eee;
              margin: 30px 0 20px;
            }
            
            .footer {
              text-align: center;
              padding: 20px;
              background-color: #E71D36;
              color: white;
            }
            
            .footer small {
              color: rgba(255, 255, 255, 0.8);
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://menuugo.com/assets/logo.png" alt="Logo Menuugo" />
            </div>
            
            <div class="content">
              <h1>Recuperação de Senha</h1>
              
              <p>Olá! Seu código de recuperação é:</p>
              
              <div class="code">
                ${codigoRecuperacao}
              </div>
              
              <p>
                Use este código para redefinir sua senha. Caso não tenha solicitado,
                ignore este e-mail.
              </p>
              
              <hr />
            </div>
            
            <div class="footer">
              <small>© 2025 Menuugo. Todos os direitos reservados.</small>
            </div>
      </div>
    </body>
    `,

      });
      console.log('Email enviado com sucesso:', result);
    }
    catch (error) {
      console.error('🚨 Erro ao enviar email:', error.message);
      throw new Error('Erro ao enviar email de recuperação.');
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