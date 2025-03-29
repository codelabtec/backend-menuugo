
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuarioRoutes from './routes/usuarioRoutes.js'; // Corrigido para importar as rotas de usuário

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());  // Para processar JSON no corpo das requisições

// Usar as rotas de usuário
app.use('/api/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
