// Verifica se o usuário está logado
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
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

document.addEventListener("DOMContentLoaded", () => {
  const groupList = document.getElementById("group-list");
  const taskArea = document.getElementById("task-area");
  const currentGroupName = document.getElementById("current-group-name");
  const taskList = document.getElementById("task-list");
  const addTaskForm = document.getElementById("add-task-form");
  const newTaskDescription = document.getElementById("new-task-description");

  const personalTaskArea = document.getElementById("personal-task-area");
  const personalTaskList = document.getElementById("personal-task-list");
  const addPersonalTaskForm = document.getElementById("add-personal-task-form");
  const newPersonalTaskDescription = document.getElementById("new-personal-task-description");
  const btnPersonalTask = document.getElementById("btn-personal-task");

  // Dados simulados para grupos e tarefas
  // Pode ser substituído por backend ou localStorage depois
  let grupos = JSON.parse(localStorage.getItem("grupos")) || [];
  let tarefasPorGrupo = JSON.parse(localStorage.getItem("tarefasPorGrupo")) || {};
  let tarefasPessoais = JSON.parse(localStorage.getItem("tarefasPessoais")) || [];

  // Função para salvar dados no localStorage
  function salvarDados() {
    localStorage.setItem("grupos", JSON.stringify(grupos));
    localStorage.setItem("tarefasPorGrupo", JSON.stringify(tarefasPorGrupo));
    localStorage.setItem("tarefasPessoais", JSON.stringify(tarefasPessoais));
  }

  // Mostrar tarefas pessoais (toggle)
  btnPersonalTask.addEventListener("click", () => {
    if (personalTaskArea.style.display === "none" || personalTaskArea.style.display === "") {
      personalTaskArea.style.display = "block";
      taskArea.style.display = "none";
    } else {
      personalTaskArea.style.display = "none";
    }
  });

  // Criar grupo
  const createGroupForm = document.getElementById("create-group-form");
  createGroupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nomeGrupo = document.getElementById("new-group-name").value.trim();
    if (!nomeGrupo) return;

    // Evitar grupos duplicados
    if (grupos.includes(nomeGrupo)) {
      alert("Este grupo já existe.");
      return;
    }

    grupos.push(nomeGrupo);
    tarefasPorGrupo[nomeGrupo] = [];
    salvarDados();
    renderGroups();
    bootstrap.Modal.getInstance(document.getElementById("createGroupModal")).hide();
    createGroupForm.reset();
  });

  // Renderiza lista de grupos
  function renderGroups() {
    groupList.innerHTML = "";
    grupos.forEach((grupo) => {
      const item = document.createElement("button");
      item.className = "list-group-item list-group-item-action";
      item.textContent = grupo;
      item.addEventListener("click", () => selectGroup(grupo));
      groupList.appendChild(item);
    });
  }

  // Seleciona um grupo e mostra tarefas
  function selectGroup(nomeGrupo) {
    currentGroupName.textContent = nomeGrupo;
    taskArea.style.display = "block";
    personalTaskArea.style.display = "none";
    renderTasks(nomeGrupo);
  }

  // Renderiza tarefas do grupo
  function renderTasks(nomeGrupo) {
    taskList.innerHTML = "";
    (tarefasPorGrupo[nomeGrupo] || []).forEach((tarefa, i) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = tarefa;
      const btnDel = document.createElement("button");
      btnDel.className = "btn btn-sm btn-danger";
      btnDel.innerHTML = '<i class="bi bi-trash"></i>';
      btnDel.addEventListener("click", () => {
        tarefasPorGrupo[nomeGrupo].splice(i, 1);
        salvarDados();
        renderTasks(nomeGrupo);
      });
      li.appendChild(btnDel);
      taskList.appendChild(li);
    });
  }

  // Adicionar tarefa ao grupo selecionado
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const tarefa = newTaskDescription.value.trim();
    if (!tarefa) return;

    const grupoSelecionado = currentGroupName.textContent;
    if (!grupoSelecionado) {
      alert("Selecione um grupo para adicionar a tarefa.");
      return;
    }

    tarefasPorGrupo[grupoSelecionado].push(tarefa);
    newTaskDescription.value = "";
    salvarDados();
    renderTasks(grupoSelecionado);
  });

  // Renderizar tarefas pessoais
  function renderPersonalTasks() {
    personalTaskList.innerHTML = "";
    tarefasPessoais.forEach((tarefa, i) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = tarefa;
      const btnDel = document.createElement("button");
      btnDel.className = "btn btn-sm btn-danger";
      btnDel.innerHTML = '<i class="bi bi-trash"></i>';
      btnDel.addEventListener("click", () => {
        tarefasPessoais.splice(i, 1);
        salvarDados();
        renderPersonalTasks();
      });
      li.appendChild(btnDel);
      personalTaskList.appendChild(li);
    });
  }

  // Adicionar tarefa pessoal
  addPersonalTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const tarefa = newPersonalTaskDescription.value.trim();
    if (!tarefa) return;
    tarefasPessoais.push(tarefa);
    newPersonalTaskDescription.value = "";
    salvarDados();
    renderPersonalTasks();
  });

  // Inicializa listas na tela
  renderGroups();
  renderPersonalTasks();
});
