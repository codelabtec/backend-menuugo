
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

process.on('SIGINT', gracefulShutdown); // Ctrl+C encerra o processo mas pode ser retomado com npm start sem dar comflito
process.on('SIGTERM', gracefulShutdown); // kill command

// Ao apertar Ctrl+Z o processo é suspenso e pode ser retomado com npm start
process.on('SIGTSTP', () => {
  gracefulShutdown();
});

function gracefulShutdown() {
  console.log('Iniciando encerramento gracioso...');
  
  server.close(() => {
    console.log('Servidor HTTP fechado.');
    process.exit(0);
  });
  
  // Força o encerramentocapós 10 segundos se o servidor não fechar normalmente
  setTimeout(() => {
    console.error('Não foi possível fechar as conexões a tempo, forçando encerramento');
    process.exit(1);
  }, 10000);
}