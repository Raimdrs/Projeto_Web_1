document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const welcomeMessage = document.getElementById("welcomeMessage");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  welcomeMessage.textContent = usuarioLogado?.username ? `Olá, ${usuarioLogado.username}` : "Olá!";

  const taskTypeSelect = document.getElementById("taskType");
  const normalSection = document.getElementById("normal-section");
  const recorrenteSection = document.getElementById("recorrente-section");

  taskTypeSelect.addEventListener("change", () => {
    const type = taskTypeSelect.value;
    normalSection.style.display = type === "normal" ? "block" : "none";
    recorrenteSection.style.display = type === "recorrente" ? "block" : "none";
  });

  // Obtém o groupId da URL
  console.log("URL completa:", window.location.href);
  console.log("Query string:", window.location.search);

  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('id');
  console.log("groupId capturado:", groupId);

  if (!groupId) {
    alert("ID do grupo não encontrado.");
    window.location.href = "grupos.html";
    return;
  }
  loadGroup(groupId);

    // Atualiza o botão de nova tarefa com o groupId
  const addTaskBtn = document.getElementById("add-task-btn");
  if (addTaskBtn && groupId) {
    addTaskBtn.href = `nova-tarefa.html?id=${groupId}`;
  }

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuarioLogado");
    sessionStorage.clear();
    window.location.href = "login.html";
  });
});


