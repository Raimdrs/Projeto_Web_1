document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita o envio tradicional do formulário

    const nome = document.getElementById("registerName").value.trim();
    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const senha = document.getElementById("registerPassword").value;
    const confirmSenha = document.getElementById("confirmPassword").value;

    // Validações
    if (senha.length < 8) {
      alert("A senha deve conter no mínimo 8 caracteres.");
      return;
    }

    if (senha !== confirmSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    const userData = {
      name: nome,
      username: username,
      email: email,
      password: senha
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        alert("Conta criada com sucesso!");
        window.location.href = "login.html";
      } else {
        const errorText = await response.text();
        alert("Erro ao criar conta: " + errorText);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  });
});
