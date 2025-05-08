function validarLogin() {
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!email || !senha) {
    alert('Por favor, preencha todos os campos.');
    return false;
  }

  return true;
}

function validarSenha() {
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar').value;

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem. Tente novamente.');
      return false;
    }
    return true;
  }
  