document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const activeGroupId = Number(sessionStorage.getItem('activeGroupId'));

  // 1. Guarda de Rota
  if (!usuarioLogado) {
    alert("Você precisa estar logado para acessar o sistema.");
    window.location.href = "login.html";
    return;
  }
  // Se não houver um grupo ativo, volta para a página de grupos
  if (!activeGroupId) {
    alert("Nenhum grupo selecionado.");
    window.location.href = "grupos.html";
    return;
  }

  // 2. Elementos da página
  const currentGroupName = document.getElementById('current-group-name');
  const taskList = document.getElementById('task-list');
  const addTaskForm = document.getElementById('add-task-form');

  let data = { groups: [], tasks: [] };

  // 3. Funções de dados e renderização
  const saveData = () => {
    localStorage.setItem(`taskShareData_${usuarioLogado.email}`, JSON.stringify(data));
  };

  const loadData = () => {
    const savedData = localStorage.getItem(`taskShareData_${usuarioLogado.email}`);
    if (savedData) {
      data = JSON.parse(savedData);
    }
  };

  const renderTasks = () => {
    taskList.innerHTML = '';
    const tasksOfActiveGroup = data.tasks.filter(task => task.groupId === activeGroupId);

    if (tasksOfActiveGroup.length === 0) {
      taskList.innerHTML = '<li class="list-group-item text-muted">Nenhuma tarefa neste grupo.</li>';
    } else {
      tasksOfActiveGroup.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'task-completed' : ''}`;
        taskElement.dataset.taskId = task.id;
        taskElement.innerHTML = `
          <div>
            <input class="form-check-input me-2 task-checkbox" type="checkbox" ${task.completed ? 'checked' : ''}>
            <label class="form-check-label">${task.description}</label>
          </div>
          <button class="btn btn-danger btn-sm delete-task-btn"><i class="bi bi-trash-fill"></i></button>
        `;
        taskList.appendChild(taskElement);
      });
    }
  };

  // 4. Event Listeners
  addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskDescriptionInput = document.getElementById('new-task-description');
    const newTaskDescription = taskDescriptionInput.value.trim();
    if (newTaskDescription) {
      const newTask = { id: Date.now(), groupId: activeGroupId, description: newTaskDescription, completed: false };
      data.tasks.push(newTask);
      saveData();
      renderTasks();
      taskDescriptionInput.value = '';
    }
  });

  taskList.addEventListener('click', (e) => {
    const taskElement = e.target.closest('li');
    if (!taskElement) return;
    const taskId = Number(taskElement.dataset.taskId);

    if (e.target.matches('.task-checkbox')) {
      const task = data.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        saveData();
        renderTasks(); // Re-renderiza para aplicar o estilo de completado
      }
    }

    if (e.target.closest('.delete-task-btn')) {
      if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        data.tasks = data.tasks.filter(t => t.id !== taskId);
        saveData();
        renderTasks();
      }
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    sessionStorage.removeItem('activeGroupId');
    window.location.href = "login.html";
  });
  
  // 5. Inicialização da página
  const init = () => {
    loadData();
    const activeGroup = data.groups.find(g => g.id === activeGroupId);
    if (activeGroup) {
      currentGroupName.textContent = activeGroup.name;
    } else {
      // Caso o grupo tenha sido deletado em outra aba, por exemplo
      alert("Grupo não encontrado.");
      window.location.href = "grupos.html";
      return;
    }
    renderTasks();
  };

  init();
});