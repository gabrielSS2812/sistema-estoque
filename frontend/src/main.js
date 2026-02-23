import {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  excluirProduto,
  entradaProduto,
  saidaProduto
} from "./api";

import { carregarConsulta } from "./consulta";
import "./style.css";

/* =========================
   PERMISSÕES
========================= */
const PERMISSOES = {
  CONSULTA: 1,
  OPERADOR: 2,
  ADMIN: 3
};

/* =========================
   USUÁRIO DO JWT
========================= */
function getUsuarioLogado(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload || typeof payload.nivel !== "number") return null;
    return payload;
  } catch {
    return null;
  }
}

/* =========================
   APLICAR PERMISSÕES NA UI
========================= */
function aplicarPermissoesUI(usuario) {
  if (usuario.nivel < PERMISSOES.OPERADOR) {
    document.querySelector('[data-tab="operacao"]')?.remove();
    document.getElementById("operacao")?.remove();
  }

  if (usuario.nivel < PERMISSOES.ADMIN) {
    document.querySelector('[data-tab="admin"]')?.remove();
    document.getElementById("admin")?.remove();
  }
}

/* =========================
   CONTROLE DE TABS
========================= */
function inicializarTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      const content = document.getElementById(tabId);

      if (!content) return;

      tabs.forEach(b => b.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      content.classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  const usuario = getUsuarioLogado(token);

  if (!usuario) {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
    return;
  }

  aplicarPermissoesUI(usuario);
  inicializarTabs();

  const lista = document.getElementById("listaProdutos");
  const btnCadastrar = document.getElementById("btnCadastrar");

  /* =========================
     CARREGAR PRODUTOS
  ========================= */
  async function carregarProdutos() {
    try {
      const produtos = await listarProdutos();
      lista.innerHTML = "";

      produtos.forEach(p => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td><input class="edit-nome" value="${p.nome}" /></td>
          <td>${p.quantidade}</td>
          <td><input class="edit-min" type="number" value="${p.estoque_minimo}" /></td>
          <td>
            <button class="salvar" data-id="${p.id}">💾</button>
            <button class="excluir" data-id="${p.id}">🗑</button>
            <button class="entrada" data-id="${p.id}">+1</button>
            <button class="saida" data-id="${p.id}">-1</button>
          </td>
        `;

        lista.appendChild(tr);
      });

      if (usuario.nivel < PERMISSOES.ADMIN) {
        document.querySelectorAll(".salvar, .excluir").forEach(b => b.remove());
      }

    } catch (err) {
      console.error(err);
    }
  }

  /* =========================
     EVENTOS DOS BOTÕES
  ========================= */
  lista.addEventListener("click", async (e) => {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    try {

      // ENTRADA
      if (e.target.classList.contains("entrada")) {
        await entradaProduto(id, 1);
        await carregarProdutos();
        document.dispatchEvent(new Event("estoqueAtualizado"));
      }

      // SAÍDA
      if (e.target.classList.contains("saida")) {
        await saidaProduto(id, 1);
        await carregarProdutos();
        document.dispatchEvent(new Event("estoqueAtualizado"));
      }

      // SALVAR
      if (e.target.classList.contains("salvar")) {
        const tr = e.target.closest("tr");

        const nome = tr.querySelector(".edit-nome").value;
        const minimo = Number(tr.querySelector(".edit-min").value);

        await atualizarProduto(id, {
          nome,
          estoque_minimo: minimo
        });

        await carregarProdutos();
        document.dispatchEvent(new Event("estoqueAtualizado"));
      }

      // EXCLUIR
      if (e.target.classList.contains("excluir")) {
        if (!confirm("Deseja excluir este produto?")) return;

        await excluirProduto(id);
        await carregarProdutos();
        document.dispatchEvent(new Event("estoqueAtualizado"));
      }

    } catch (err) {
      console.error(err);
      alert(err.message || "Erro na operação");
    }
  });

  /* =========================
     CADASTRO
  ========================= */
  btnCadastrar?.addEventListener("click", async () => {

    if (usuario.nivel < PERMISSOES.ADMIN) {
      return alert("Sem permissão");
    }

    try {
      const produto = {
        nome: nome.value,
        categoria: categoria.value,
        preco: Number(preco.value),
        estoque_minimo: Number(estoque_minimo.value)
      };

      await criarProduto(produto);

      await carregarProdutos();
      document.dispatchEvent(new Event("estoqueAtualizado"));

    } catch (err) {
      console.error(err);
      alert(err.message);
    }

  });

  /* =========================
     INIT
  ========================= */
  await carregarProdutos();
  await carregarConsulta();

});
