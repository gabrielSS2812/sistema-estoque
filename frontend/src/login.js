console.log("LOGIN.JS CARREGADO");

const form = document.getElementById("loginForm");
const erro = document.getElementById("erroLogin");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // 🔥 EVITA RELOAD DA PÁGINA

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  erro.textContent = "";

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const json = await res.json();

    if (!res.ok) {
      erro.textContent = json.message || "Erro ao fazer login";
      return;
    }

    const token = json.data?.token;

    if (!token) {
      erro.textContent = "Token não recebido do servidor";
      return;
    }

    // ✅ salva token
    localStorage.setItem("token", token);

    // ✅ redireciona
    window.location.href = "/";

  } catch (err) {
    console.error(err);
    erro.textContent = "Erro de conexão com o servidor";
  }
});
