import { listarProdutos, entradaProduto, saidaProduto } from "./api";

const tabela = document.getElementById("tabelaConsulta");
const buscaInput = document.getElementById("busca");

let produtosCache = [];

/* =========================
   CARREGAR CONSULTA
========================= */
export async function carregarConsulta() {
  produtosCache = await listarProdutos();
  renderTabela(produtosCache);
}

/* =========================
   RENDER TABELA
========================= */
function renderTabela(produtos) {
  tabela.innerHTML = "";

  produtos.forEach(produto => {
    const status =
      produto.quantidade <= produto.estoque_minimo
        ? "REPOR"
        : "OK";

    const tr = document.createElement("tr");
    tr.className = status === "REPOR" ? "alerta" : "";

    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${produto.quantidade}</td>
      <td>${produto.estoque_minimo}</td>
      <td>${status}</td>
      <td>
        <button class="entrada" data-id="${produto.id}">+1</button>
        <button class="saida" data-id="${produto.id}">-1</button>
      </td>
    `;

    tabela.appendChild(tr);
  });
}

/* =========================
   EVENT DELEGATION
========================= */
tabela.addEventListener("click", async (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  try {
    if (e.target.classList.contains("entrada")) {
      await entradaProduto(id, 1);
    }

    if (e.target.classList.contains("saida")) {
      await saidaProduto(id, 1);
    }

    await carregarConsulta();
  } catch (err) {
    alert(err.message || "Erro na operação");
  }
});

/* =========================
   BUSCA
========================= */
buscaInput.addEventListener("input", () => {
  const termo = buscaInput.value.toLowerCase();

  const filtrados = produtosCache.filter(p =>
    p.nome.toLowerCase().includes(termo)
  );

  renderTabela(filtrados);
});

/* =========================
   INIT
========================= */
carregarConsulta();
