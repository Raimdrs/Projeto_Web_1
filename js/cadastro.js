  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault(); // impede o envio até que as validações passem

    const nome = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const senha = document.getElementById("registerPassword").value;
    const confirmarSenha = document.getElementById("confirmPassword").value;

    // Verificações
    if (nome.length < 3) {
      alert("O nome deve ter pelo menos 3 caracteres.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Digite um email válido.");
      return;
    }

    if (senha.length < 8) {
      alert("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    // Se todas as validações passarem, pode enviar o formulário
    alert("Cadastro realizado com sucesso!");
    this.submit(); // agora envia o formulário
  });
