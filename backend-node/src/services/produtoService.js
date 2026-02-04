const fs = require("fs");
const path = require("path");
const AppError = require("../utils/AppError");

const produtosPath = path.join(__dirname, "../data/produtos.json");

function lerProdutos() {
  return JSON.parse(fs.readFileSync(produtosPath, "utf-8"));
}

function salvarProdutos(produtos) {
  fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));
}

function listar() {
  return lerProdutos();
}

function buscarPorId(id) {
  const produtos = lerProdutos();
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    throw new AppError("Produto não encontrado", 404);
  }

  return produto;
}

function criar(produto) {
  if (!produto.nome || produto.nome.trim() === "") {
    throw new AppError("Nome do produto é obrigatório", 400);
  }

  const produtos = lerProdutos();

  const novoProduto = {
    id: produtos.length ? produtos[produtos.length - 1].id + 1 : 1,
    nome: produto.nome,
    categoria: produto.categoria || "Geral",
    quantidade: Number(produto.quantidade) || 0,
    estoque_minimo: Number(produto.estoque_minimo) || 0,
    preco: Number(produto.preco) || 0
  };

  produtos.push(novoProduto);
  salvarProdutos(produtos);

  return novoProduto;
}

function atualizar(id, dados) {
  const produtos = lerProdutos();
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    throw new AppError("Produto não encontrado", 404);
  }

  if (dados.nome !== undefined && dados.nome.trim() === "") {
    throw new AppError("Nome do produto não pode ser vazio", 400);
  }

  produto.nome = dados.nome ?? produto.nome;
  produto.categoria = dados.categoria ?? produto.categoria;
  produto.quantidade =
    dados.quantidade !== undefined ? Number(dados.quantidade) : produto.quantidade;
  produto.estoque_minimo =
    dados.estoque_minimo !== undefined
      ? Number(dados.estoque_minimo)
      : produto.estoque_minimo;
  produto.preco =
    dados.preco !== undefined ? Number(dados.preco) : produto.preco;

  salvarProdutos(produtos);
  return produto;
}

function remover(id) {
  const produtos = lerProdutos();
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    throw new AppError("Produto não encontrado", 404);
  }

  if (produto.quantidade > 0) {
    throw new AppError(
      "Não é possível excluir produto com estoque disponível",
      409
    );
  }

  const filtrados = produtos.filter(p => p.id !== id);
  salvarProdutos(filtrados);
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};
