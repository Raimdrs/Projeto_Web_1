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

  taskTypeSelect?.addEventListener("change", () => {
    const type = taskTypeSelect.value;
    normalSection.style.display = type === "normal" ? "block" : "none";
    recorrenteSection.style.display = type === "recorrente" ? "block" : "none";
    
  });

  // Captura os parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('id') || urlParams.get('groupId');

  if (!groupId) {
    alert("ID do grupo não encontrado.");
    window.location.href = "grupos.html";
    return;
  }

  // Preenche automaticamente o input do groupId e bloqueia edição
  const groupIdInput = document.getElementById("groupId");
  if (groupIdInput) {
    groupIdInput.value = groupId;
    groupIdInput.readOnly = true; // Opcional: evita que usuário edite
  }

  function loadGroupMembersAsOptions(groupId) {
    
    fetch(`http://localhost:8080/api/v1/groups/${groupId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Erro ao buscar membros do grupo');
        return response.json();
      })
      .then(data => {
        const groupMembers = data.members || [];

        const responsibleDiv = document.getElementById("responsibleSelect")

        const selectElement = document.createElement('select');       
        selectElement.setAttribute("class", "form-multi-select")
        selectElement.setAttribute("id", "responsibleIds")
        selectElement.setAttribute('multiple', ''); 
        selectElement.setAttribute("data-coreui-search", "global")

        const scriptElement = document.createElement("script")
        scriptElement.setAttribute("src", "https://cdn.jsdelivr.net/npm/@coreui/coreui-pro@5.14.2/dist/js/coreui.bundle.min.js")
        
        // Adicionar cada membro como opção
        groupMembers.forEach((member, index) => {
          console.log(`Adicionando membro ${index + 1}:`, member);
          const option = document.createElement('option');
          option.value = member.id;
          option.textContent = `${member.name} (@${member.username})`;
          selectElement.appendChild(option);
        });
        console.log(selectElement)
        responsibleDiv.appendChild(selectElement)
        responsibleDiv.appendChild(scriptElement)
      })
      .catch(error => {
        console.error('Erro ao carregar membros:', error);
        alert(error.message || 'Erro ao carregar membros do grupo.');
      });
  }

  loadGroupMembersAsOptions(groupId)

  document.getElementById("task-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const description = document.getElementById("description").value;
    const taskType = taskTypeSelect.value;

    let taskData = {};
    let endpoint = "";

    if (taskType === "normal") {
      const date = document.getElementById("date").value;
      taskData = { description, date, groupId };
      endpoint = `/api/v1/tasks/${groupId}`;
    } else {
      const endDate = document.getElementById("endDate").value;
      const checkboxes = document.querySelectorAll('#recorrente-section input[type="checkbox"]:checked');
      const daysOfWeek = Array.from(checkboxes).map(cb => cb.value);
      function getSelectedResponsibleIds() {
        const responsibleSelect = document.getElementById('responsibleIds');
        const selectedOptions = Array.from(responsibleSelect.selectedOptions);
        return selectedOptions.map(option => option.value);
      }
      const responsibleIds = getSelectedResponsibleIds();

      taskData = {
        description,
        groupId,
        daysOfWeek,
        endDate,
        responsibleIds
      };
      endpoint = "/api/v1/tasks/recurring";
    }

    try {
      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });

      if (!res.ok) throw new Error(await res.text());

      alert("Tarefa criada com sucesso!");
      window.location.href = `tarefas.html?id=${groupId}`;
    } catch (err) {
      alert("Erro ao criar tarefa: " + err.message);
    }
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuarioLogado");
    sessionStorage.clear();
    window.location.href = "login.html";
  });
});
