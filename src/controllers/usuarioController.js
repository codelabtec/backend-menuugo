// controllers/usuarioController.js
import usuarioService from '../services/usuarioService.js'; // Corrigido para importar o serviço de usuário

// Função para cadastrar o usuário
const cadastrarUsuario = async (req, res) => {

  try {
    
    const { nome, email, senha, numero } = req.body;
    
    console.log('Dados recebidos para cadastro:', { nome, email, senha, numero }); // Verifique os dados recebidos
    
    
    // Validações básicas
    if (!nome || !email || !senha || !numero) {
      return res.status(400).json({ 
        message: 'Todos os campos são obrigatórios' 
      });
    }
    
    //salva um novo usuário no banco de dados
    const usuario = await usuarioService.criarUsuario(nome, email, senha, numero);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario });
  
    // Verificar se houve erro de email já existente
    if (result.error && result.code === 'EMAIL_EXISTS') {
      return res.status(400).json({
        code: 'EMAIL_EXISTS',
        message: result.message
      });
    }

    // Se não houve erro, retornar sucesso
    return res.status(201).json({
      message: result.message || 'Usuário cadastrado com sucesso',
      data: result.data
    });
  
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

// Função para atualizar a senha com código de recuperação
const atualizarSenhaComCodigo = async (req, res) => {
  const { email, codigo, novaSenha } = req.body;

  try {
    const result = await usuarioService.atualizarSenhaComCodigo(email, codigo, novaSenha);
    res.status(200).json({ message: result.message });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



export default {
  cadastrarUsuario,
  loginUsuario,
  recuperarSenha,
  atualizarSenhaComCodigo
};
