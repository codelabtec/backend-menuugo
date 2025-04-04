// routes/usuarioRoutes.js
import express from 'express';
import { Router } from 'express';
import usuarioController from '../controllers/usuarioController.js'; // Corrigido para importar o controlador de usuário

const router = Router();
// Definindo as rotas para o controlador de usuário

router.post('/cadastrar', usuarioController.cadastrarUsuario);
router.post('/login', usuarioController.loginUsuario);
router.post('/recuperar-senha', usuarioController.recuperarSenha);
router.post('/redefinir-senha', usuarioController.atualizarSenhaComCodigo);



export default router;
