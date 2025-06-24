document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");

  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('id');

  if (groupId == undefined || groupId === null) {
    alert('Grupo não encontrado!');
    window.location.href = 'grupos.html';
    return;
  }

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const welcomeMessage = document.getElementById("welcomeMessage");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  welcomeMessage.textContent = usuarioLogado?.username ? `Olá, ${usuarioLogado.username}` : "Olá!";

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuarioLogado");
    sessionStorage.clear();
    window.location.href = "login.html";
  });

  const init = () => {
    loadGroup(groupId);
    fetchTasksByGroupAndDate(new Date().toISOString().split('T')[0]);
  };

  init();
});

function loadGroup(groupId) {
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

      const groupNameElem = document.getElementById('current-group-name');
      if (groupNameElem) groupNameElem.textContent = data.name || '';

    })
    .catch(error => {
      alert(error.message || 'Erro ao carregar membros do grupo.');
    });

}
function fetchTasksByGroupAndDate(date) {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('id');

  return fetch(`http://localhost:8080/api/v1/tasks/${groupId}/${date}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`
    }
  })
    .then(response => {
      if (!response.ok) throw new Error('Erro ao buscar tarefas');
      return response.json();
    })
    .then(tasks => {
      // Exibe as tarefas na tela
      const taskList = document.getElementById('task-list');
      taskList.innerHTML = '';
      if (!tasks || tasks.length === 0) {
        taskList.innerHTML = '<li class="list-group-item text-muted">Nenhuma tarefa neste grupo nesta data.</li>';
      } else {
        tasks.forEach(task => {
          const taskElement = document.createElement('li');
          taskElement.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'task-completed' : ''}`;
          let bgColor = '';
          if (task.status === "OVERDUE") {
            bgColor = 'background-color: #f8d7da;'; // vermelho claro
          } else if (task.status === "COMPLETED") {
            bgColor = 'background-color: #cfe2ff;'; // azul claro
          } else if (task.status === "TODO") {
            bgColor = 'background-color: #f8f9fa;'; // cinza claro
          }
          taskElement.style = `cursor: pointer; ${bgColor}`;
          taskElement.dataset.taskId = task.id;
          // Define a cor de fundo conforme o status da tarefa

          taskElement.innerHTML = `
            <div style="width: 100%; display: flex; align-items: center;">
              <label class="form-check-label">${task.description}</label>
              <span class="badge bg-primary ms-2">${task.responsibleName ? task.responsibleName : 'Sem responsável'}</span>
              <button class="btn btn-primary btn-sm ms-auto complete-task-btn" data-task-id="${task.id}" ${task.status === "COMPLETED" ? 'disabled' : ''}>
              Concluir
              </button>
            </div>
            `;

          // Adiciona o event listener ao botão "Concluir"
          const completeBtn = taskElement.querySelector('.complete-task-btn');
          if (completeBtn) {
            completeBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              concluirTask(groupId, task.id)
                .then(() => fetchTasksByGroupAndDate(date))
                .catch(error => alert(error.message || 'Erro ao concluir tarefa.'));
            });
          }
          taskList.appendChild(taskElement);
        });
      }
    })
    .catch(error => {
      alert(error.message || 'Erro ao carregar tarefas.');
    });
}

function concluirTask(groupId, taskId) {
  return fetch(`http://localhost:8080/api/v1/tasks/${groupId}/${taskId}/complete`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`
    }
  })
    .then(response => {
      if (!response.ok) throw new Error('Erro ao concluir tarefa');
      return true;
    });
}

function buscarTarefasPorData() {
  const taskDateInput = document.getElementById('task-date');
  if (taskDateInput) {
    const selectedDate = taskDateInput.value;
    if (selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      fetchTasksByGroupAndDate(selectedDate);
    } else {
      alert('Selecione uma data válida.');
    }
  }
}

function goToNewTask() {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('id');
  if (groupId) {
    window.location.href = `nova-tarefa.html?id=${groupId}`;
  } else {
    alert('Grupo não encontrado!');
  }
}

function goToGroupDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('id');
  if (groupId) {
    window.location.href = `detalhes-grupo.html?id=${groupId}`;
  } else {
    alert('Grupo não encontrado!');
  }
}