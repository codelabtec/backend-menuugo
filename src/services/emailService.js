import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const enviarEmailConfirmacao = async (email, token) => {
    try {
        const confirmUrl = `https://menuugo.com/confirmar?token=${token}`;

        await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Confirme seu Cadastro - MenuuGo',
            html: `<p>Bem-vindo ao <strong>MenuuGo</strong>!</p>
                   <p>Para ativar sua conta, clique no link abaixo:</p>
                   <p><a href="${confirmUrl}">Confirmar Cadastro</a></p>`
        });

        console.log(`📧 E-mail de confirmação enviado para: ${email}`);
    } catch (error) {
        console.error("Erro ao enviar e-mail de confirmação:", error.message);
        throw new Error("Erro ao enviar o e-mail de confirmação.");
    }
};

export const enviarEmailRecuperacao = async (email, codigo) => {
    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Recuperação de Senha - MenuuGo',
            html: `<p>Seu código de recuperação é: <strong>${codigo}</strong></p>
                   <p>Use este código para redefinir sua senha no MenuuGo.</p>`
        });

        console.log(`📧 E-mail de recuperação enviado para: ${email}`);
    } catch (error) {
        console.error("Erro ao enviar e-mail de recuperação:", error.message);
        throw new Error("Erro ao enviar o e-mail de recuperação.");
    }
};
