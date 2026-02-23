const API_URL = "http://localhost:3000/api";

/* =========================
   TOKEN
========================= */
function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

/* =========================
   TRATAMENTO PADRÃO
========================= */
async function tratarResposta(res) {
  if (res.status === 204) return null;

  let json = null;
  try {
    json = await res.json();
  } catch {}

  if (res.status === 401) {
    alert("Sessão expirada. Faça login novamente.");
    logout();
    throw new Error("Não autorizado");
  }

  if (!res.ok) {
    throw new Error(json?.message || "Erro na requisição");
  }

  return json?.data ?? json;
}

/* =========================
   FETCH COM JWT
========================= */
async function fetchComAuth(url, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers
  });

  return tratarResposta(res);
}

/* =========================
   PRODUTOS
========================= */
export function listarProdutos() {
  return fetchComAuth(`${API_URL}/produtos`);
}

export function criarProduto(produto) {
  return fetchComAuth(`${API_URL}/produtos`, {
    method: "POST",
    body: JSON.stringify(produto)
  });
}

export function atualizarProduto(id, dados) {
  return fetchComAuth(`${API_URL}/produtos/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados)
  });
}

export function excluirProduto(id) {
  return fetchComAuth(`${API_URL}/produtos/${id}`, {
    method: "DELETE"
  });
}

/* =========================
   ESTOQUE
========================= */
export function entradaProduto(id, quantidade) {
  return fetchComAuth(`${API_URL}/estoque/entrada`, {
    method: "POST",
    body: JSON.stringify({ id, quantidade })
  });
}

export function saidaProduto(id, quantidade) {
  return fetchComAuth(`${API_URL}/estoque/saida`, {
    method: "POST",
    body: JSON.stringify({ id, quantidade })
  });
}

