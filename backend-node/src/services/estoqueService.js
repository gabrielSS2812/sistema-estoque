const fs = require("fs");
const path = require("path");

const produtosPath = path.join(__dirname, "../data/produtos.json");
const movimentacoesPath = path.join(__dirname, "../data/movimentacoes.json");

function lerJSON(caminho) {
  return JSON.parse(fs.readFileSync(caminho, "utf-8"));
}

function salvarJSON(caminho, dados) {
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
}

function listarProdutos() {
  return lerJSON(produtosPath);
}

function entradaProduto(id, quantidade) {
  const produtos = lerJSON(produtosPath);
  const movimentacoes = lerJSON(movimentacoesPath);

  const produto = produtos.find(p => p.id === id);
  if (!produto) throw new Error("Produto não encontrado");

  produto.quantidade += quantidade;

  movimentacoes.push({
    id: movimentacoes.length + 1,
    produto_id: id,
    tipo: "entrada",
    quantidade,
    data: new Date().toISOString()
  });

  salvarJSON(produtosPath, produtos);
  salvarJSON(movimentacoesPath, movimentacoes);

  return produto;
}

function saidaProduto(id, quantidade) {
  const produtos = lerJSON(produtosPath);
  const movimentacoes = lerJSON(movimentacoesPath);

  const produto = produtos.find(p => p.id === id);
  if (!produto) throw new Error("Produto não encontrado");

  if (produto.quantidade < quantidade) {
    throw new Error("Estoque insuficiente");
  }

  produto.quantidade -= quantidade;

  movimentacoes.push({
    id: movimentacoes.length + 1,
    produto_id: id,
    tipo: "saida",
    quantidade,
    data: new Date().toISOString()
  });

  salvarJSON(produtosPath, produtos);
  salvarJSON(movimentacoesPath, movimentacoes);

  return produto;
}

function verificarAlertas() {
  const produtos = lerJSON(produtosPath);
  return produtos.filter(p => p.quantidade <= p.estoque_minimo);
}

module.exports = {
  listarProdutos,
  entradaProduto,
  saidaProduto,
  verificarAlertas
};
