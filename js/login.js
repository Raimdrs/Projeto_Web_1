document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.querySelector('form');
  const usernameInput = document.getElementById('loginUsername');
  const passwordInput = document.getElementById('loginPassword');
  const submitButton = document.querySelector('button[type="submit"]');

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    removeExistingErrorMessages();

    const loginData = {
      username: usernameInput.value,
      password: passwordInput.value,
    };

    submitButton.disabled = true;
    submitButton.textContent = 'Verificando...';

    fetch('http://localhost:8080/api/v1/users/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
    .then(async response => {
      if (response.ok) {
        return response.json();
      }
      const errorText = await response.text();
      throw new Error(errorText || 'Não foi possível fazer login. Verifique suas credenciais.');
    })
    .then(data => {
      console.log('Login realizado com sucesso:', data);

      // Aqui espera-se que a API retorne um token
      localStorage.setItem('authToken', data.token);

      // Redireciona para o dashboard ou página protegida
      window.location.href = 'sistema.html';
    })
    .catch(error => {
      console.error('Erro ao fazer login:', error.message);
      displayErrorMessage(error.message);

      submitButton.disabled = false;
      submitButton.textContent = 'Login';
    });
  });

  function displayErrorMessage(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'alert alert-danger mt-3 error-message';
    errorElement.textContent = message;
    loginForm.insertBefore(errorElement, submitButton);
  }

  function removeExistingErrorMessages() {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
  }
});
