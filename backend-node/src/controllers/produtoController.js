const produtoService = require("../services/produtoService");

exports.listar = (req, res) => {
  const produtos = produtoService.listar();

  res.json({
    success: true,
    data: produtos
  });
};

exports.buscar = (req, res) => {
  const id = Number(req.params.id);
  const produto = produtoService.buscarPorId(id);

  if (!produto) {
    const err = new Error("Produto não encontrado");
    err.statusCode = 404;
    throw err;
  }

  res.json({
    success: true,
    data: produto
  });
};

exports.criar = (req, res) => {
  const produto = produtoService.criar(req.body);

  res.status(201).json({
    success: true,
    message: "Produto criado com sucesso",
    data: produto
  });
};

exports.atualizar = (req, res) => {
  const id = Number(req.params.id);
  const produto = produtoService.atualizar(id, req.body);

  if (!produto) {
    const err = new Error("Produto não encontrado");
    err.statusCode = 404;
    throw err;
  }

  res.json({
    success: true,
    message: "Produto atualizado com sucesso",
    data: produto
  });
};

exports.remover = (req, res) => {
  const id = Number(req.params.id);
  const removido = produtoService.remover(id);

  if (!removido) {
    const err = new Error("Produto não encontrado");
    err.statusCode = 404;
    throw err;
  }

  res.status(204).send();
};
