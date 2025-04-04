
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuarioRoutes from './routes/usuarioRoutes.js'; // Corrigido para importar as rotas de usuário

dotenv.config();

const app = express();

app.use(express.json());  // Para processar JSON no corpo das requisições
app.use(cors());

// Middleware para debug - ADICIONE ANTES do express.json()
app.use((req, res, next) => {
  const originalBody = JSON.stringify(req.body);
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  console.log(`[HEADERS] Content-Type: ${req.headers['content-type']}`);
  console.log(`[RAW BODY] ${req.rawBody || 'No raw body'}`);
  console.log(`[BODY BEFORE PARSING] ${originalBody}`);
  
  next();
});

// Middleware para processar JSON - IMPORTANTE
app.use(express.json());

// Middleware para verificar se o body foi parseado corretamente
app.use((req, res, next) => {
  console.log(`[BODY AFTER PARSING] ${JSON.stringify(req.body)}`);
  next();
});

// Usar as rotas de usuário
app.use('/api/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
