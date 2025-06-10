document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");

  form.addEventListener("submit", function (e) {
    let isValid = true;
    let messages = [];

    // Verifica se o email é válido
    if (!emailInput.value.includes("@")) {
      messages.push("Email inválido.");
      isValid = false;
    }

    // Verifica se a senha tem no mínimo 8 caracteres
    if (passwordInput.value.length < 8) {
      messages.push("A senha deve ter pelo menos 6 caracteres.");
      isValid = false;
    }

    if (!isValid) {
      e.preventDefault(); // Impede envio do formulário
      alert(messages.join("\n")); // Exibe mensagens
    }
  });
});
