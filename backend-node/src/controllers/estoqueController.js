const produtoService = require("../services/produtoService");
const AppError = require("../utils/AppError");

function listar(req, res) {
  const produtos = produtoService.listar();
  res.json({ data: produtos });
}

function entrada(req, res) {
  const { id, quantidade } = req.body;

  if (!id || !quantidade) {
    throw new AppError("ID e quantidade são obrigatórios", 400);
  }

  const produto = produtoService.buscarPorId(Number(id));

  produtoService.atualizar(produto.id, {
    quantidade: produto.quantidade + Number(quantidade)
  });

  res.status(200).json({ message: "Entrada registrada" });
}

function saida(req, res) {
  const { id, quantidade } = req.body;

  if (!id || !quantidade) {
    throw new AppError("ID e quantidade são obrigatórios", 400);
  }

  const produto = produtoService.buscarPorId(Number(id));

  if (produto.quantidade < quantidade) {
    throw new AppError("Estoque insuficiente", 400);
  }

  produtoService.atualizar(produto.id, {
    quantidade: produto.quantidade - Number(quantidade)
  });

  res.status(200).json({ message: "Saída registrada" });
}

function alertas(req, res) {
  const produtos = produtoService.listar();
  const alertas = produtos.filter(
    p => p.quantidade <= p.estoque_minimo
  );

  res.json({ data: alertas });
}

module.exports = {
  listar,
  entrada,
  saida,
  alertas
};


