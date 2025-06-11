document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o envio tradicional do formulário

    const nome = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const senha = document.getElementById("registerPassword").value;
    const confirmSenha = document.getElementById("confirmPassword").value;

    // Validação básica
    if (senha.length < 8) {
      alert("A senha deve conter no mínimo 8 caracteres.");
      return;
    }

    if (senha !== confirmSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    // Verifica se já existe um usuário com o mesmo e-mail
    const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioExistente = usuariosSalvos.find(u => u.email === email);

    if (usuarioExistente) {
      alert("Este e-mail já está cadastrado.");
      return;
    }

    // Cria objeto do usuário
    const novoUsuario = {
      nome,
      email,
      senha
    };

    // Salva no localStorage (como array de usuários)
    usuariosSalvos.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosSalvos));

    alert("Conta criada com sucesso!");
    window.location.href = "login.html"; // redireciona para a tela de login
  });
});
