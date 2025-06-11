document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Impede envio do formulário

    const email = emailInput.value.trim();
    const senha = passwordInput.value;

    let isValid = true;
    let messages = [];

    // Verificação básica
    if (!email.includes("@")) {
      messages.push("Email inválido.");
      isValid = false;
    }

    if (senha.length < 8) {
      messages.push("A senha deve ter pelo menos 8 caracteres.");
      isValid = false;
    }

    if (!isValid) {
      alert(messages.join("\n"));
      return;
    }

    // Busca os usuários salvos
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se o e-mail e senha correspondem a algum usuário
    const usuarioEncontrado = usuarios.find(
      (u) => u.email === email && u.senha === senha
    );

    if (usuarioEncontrado) {
      // Pode salvar o login em localStorage (simulando sessão, se quiser)
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
      alert("Login realizado com sucesso!");

      // Redireciona para a página principal do sistema (ajuste o nome do arquivo se necessário)
      window.location.href = "sistema.html";
    } else {
      alert("Email ou senha incorretos.");
    }
  });
});
