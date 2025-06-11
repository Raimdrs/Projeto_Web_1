    // Verifica se o usuário está logado
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado) {
      // Redireciona se não estiver logado
      alert("Você precisa estar logado para acessar o sistema.");
      window.location.href = "login.html";
    } else {
      // Mostra nome do usuário
      document.getElementById("nomeUsuario").textContent = usuarioLogado.nome;
      document.getElementById("welcomeMessage").textContent = `Olá, ${usuarioLogado.nome}`;
    }

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "login.html";
    });