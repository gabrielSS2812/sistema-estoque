/* =========================
   PERMISSÕES
========================= */
const PERMISSOES = {
  CONSULTA: 1,
  OPERADOR: 2,
  ADMIN: 3
};


/* =========================
   CONTROLE DE ABAS
========================= */
const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

/* =========================
   APLICAR PERMISSÕES
========================= */
function aplicarPermissoes() {
  // Operação
  if (usuarioAtual.nivel < PERMISSOES.OPERADOR) {
    document
      .querySelector('[data-tab="operacao"]')
      .style.display = "none";
  }

  // Administração
  if (usuarioAtual.nivel < PERMISSOES.ADMIN) {
    document
      .querySelector('[data-tab="admin"]')
      .style.display = "none";
  }
}

/* =========================
   INIT
========================= */
aplicarPermissoes();
