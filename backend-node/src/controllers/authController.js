const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "segredo_padrao_dev";

const usuarios = [
  { id: 1, nome: "Admin", email: "admin@email.com", senha: "123456", nivel: 3 },
  { id: 2, nome: "Operador", email: "op@email.com", senha: "123456", nivel: 2 },
  { id: 3, nome: "Consulta", email: "consulta@email.com", senha: "123456", nivel: 1 }
];

exports.login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      message: "Email e senha são obrigatórios"
    });
  }

  const usuario = usuarios.find(
    u => u.email === email && u.senha === senha
  );

  if (!usuario) {
    return res.status(401).json({
      message: "Credenciais inválidas"
    });
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      nivel: usuario.nivel // 🔥 ESSENCIAL
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  // ✅ RETORNO SIMPLES (frontend espera isso)
  return res.json({
    data :{
  token,        // 👈 coloque o token no nível raiz
  usuario: {
    id: usuario.id,
    nome: usuario.nome,
    nivel: usuario.nivel
  }}
});

};
