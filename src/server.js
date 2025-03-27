const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuarioRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());  // Para processar JSON no corpo das requisições

// Usar as rotas de usuário
app.use('/api/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
