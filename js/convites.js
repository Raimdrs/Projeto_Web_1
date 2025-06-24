document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const groupList = document.getElementById("invite-list");

  if (!token) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "login.html";
    return;
  }

  // Exibe mensagem de boas-vindas (opcional)
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  welcomeMessage.textContent = usuarioLogado?.username ? `Olá, ${usuarioLogado.username}` : "Olá!";

  // Função para carregar grupos existentes
  async function loadInvites() {
    try {
      const response = await fetch("http://localhost:8080/api/v1/groups/invite", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Erro ao buscar convites.");

      const invite = await response.json();
      groupList.innerHTML = "";

      if (invite.length === 0) {
        groupList.innerHTML = '<span class="list-invite-item text-muted p-2">Nenhum convite pendente ainda.</span>';
        return;
      }

      invite.forEach(invite => {
        const item = document.createElement("div");
        item.className = "list-group-item list-group-item-action d-flex p-2";
        const nameSpan = document.createElement("span");
        nameSpan.textContent = invite.groupName;
        nameSpan.style.fontWeight = "bold";
        nameSpan.className = "my-auto"; // centraliza verticalmente com flexbox
        item.appendChild(nameSpan);

        // Botão Aceitar
        // Container para os botões
        const btnContainer = document.createElement("div");
        btnContainer.className = "ms-auto"; // empurra para a direita com flex

        const acceptBtn = document.createElement("button");
        acceptBtn.textContent = "Aceitar";
        acceptBtn.className = "btn btn-success btn-sm mx-1";
        acceptBtn.addEventListener("click", async () => {
          try {
            const response = await fetch(`http://localhost:8080/api/v1/groups/invite/response`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ inviteId: invite.id, response: "ACCEPTED" })
            });
            if (!response.ok) throw new Error("Erro ao aceitar convite.");
            item.remove();
          } catch (err) {
            alert("Erro ao aceitar convite.");
          }
        });

        // Botão Negar
        const denyBtn = document.createElement("button");
        denyBtn.textContent = "Negar";
        denyBtn.className = "btn btn-danger btn-sm mx-1";
        denyBtn.addEventListener("click", async () => {
          try {
            const response = await fetch(`http://localhost:8080/api/v1/groups/invite/response`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ inviteId: invite.id, response: "REJECTED" })
            });
            if (!response.ok) throw new Error("Erro ao negar convite.");
            item.remove();
          } catch (err) {
            alert("Erro ao negar convite.");
          }
        });

        btnContainer.appendChild(acceptBtn);
        btnContainer.appendChild(denyBtn);
        item.appendChild(btnContainer);
        groupList.appendChild(item);
      });
    } catch (error) {
      console.error("Erro ao carregar grupos:", error.message);
      alert("Erro ao carregar grupos.");
    }
  }

  // Botão de logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuarioLogado");
    sessionStorage.clear();
    window.location.href = "login.html";
  });
  loadInvites();
});
