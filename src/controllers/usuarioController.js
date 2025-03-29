// controllers/usuarioController.js
import usuarioService from '../services/usuarioService.js'; // Corrigido para importar o serviço de usuário

// Função para cadastrar o usuário
const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, numero } = req.body;

  console.log('Dados recebidos para cadastro:', { nome, email, senha, numero }); // Verifique os dados recebidos

  try {
    //salva um novo usuário no banco de dados
    const usuario = await usuarioService.criarUsuario(nome, email, senha, numero);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario });
  } catch (err) {
    console.log('Erro na função de cadastro:', err);  // Verifique o erro
    res.status(500).json({ message: err.message });
  }
};


// Função para fazer o login do usuário
const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await usuarioService.loginUsuario(email, senha);

    //verifica se o usuário existe
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário ou senha inválidos' });
    }

    res.status(200).json({ message: 'Login realizado com sucesso!', usuario });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Função para recuperar senha do usuário
const recuperarSenha = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await usuarioService.recuperarSenha(email);
    res.status(200).json({ message: 'Código de recuperação enviado para o e-mail.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  cadastrarUsuario,
  loginUsuario,
  recuperarSenha
};
