document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const groupList = document.getElementById("group-list");
  const createGroupForm = document.getElementById("create-group-form");
  const createGroupModal = new bootstrap.Modal(document.getElementById("createGroupModal"));

  if (!token) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "login.html";
    return;
  }

  // Exibe mensagem de boas-vindas (opcional)
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  welcomeMessage.textContent = usuarioLogado?.username ? `Olá, ${usuarioLogado.username}` : "Olá!";

  // Função para carregar grupos existentes
  async function loadGroups() {
    try {
      const response = await fetch("http://localhost:8080/api/v1/groups", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Erro ao buscar grupos.");

      const groups = await response.json();
      groupList.innerHTML = "";

      if (groups.length === 0) {
        groupList.innerHTML = '<li class="list-group-item text-muted">Nenhum grupo criado ainda.</li>';
        return;
      }

      groups.forEach(group => {
        const item = document.createElement("a");
        item.className = "list-group-item list-group-item-action";
        item.textContent = group.name;
        item.href = "#";
        item.onclick = () => {
          sessionStorage.setItem("activeGroupId", group.id);
          window.location.href = "tarefas.html";
        };
        groupList.appendChild(item);
      });
    } catch (error) {
      console.error("Erro ao carregar grupos:", error.message);
      alert("Erro ao carregar grupos.");
    }
  }

  // Evento de criação de grupo
  createGroupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("new-group-name").value.trim();
    const description = document.getElementById("new-group-description").value.trim();

    if (!name || !description) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Erro ao criar grupo.");
      }

      alert("Grupo criado com sucesso!");
      createGroupForm.reset();
      createGroupModal.hide();
      loadGroups(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao criar grupo:", error.message);
      alert("Erro ao criar grupo: " + error.message);
    }
  });

  // Botão de logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuarioLogado");
    sessionStorage.clear();
    window.location.href = "login.html";
  });

  // Inicializa carregando grupos
  loadGroups();
});
