// Sistema de Detalhes do Grupo
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("authToken");
    const welcomeMessage = document.getElementById("welcomeMessage");

    if (!token) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "login.html";
        return;
    }

    // Exibe mensagem de boas-vindas (opcional)
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    welcomeMessage.textContent = usuarioLogado?.username ? `Olá, ${usuarioLogado.username}` : "Olá!";

    // Obter ID do grupo da URL
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('id');

    if (groupId == undefined || groupId === null) {
        alert('Grupo não encontrado!');
        window.location.href = 'grupos.html';
        return;
    }
    loadGroup(groupId);

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("usuarioLogado");
        sessionStorage.clear();
        window.location.href = "login.html";
    });
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

            const groupNameElem = document.getElementById('group-name');
            const groupDescriptionElem = document.getElementById('group-description');

            if (groupNameElem) groupNameElem.textContent = data.name || '';
            if (groupDescriptionElem) groupDescriptionElem.textContent = data.description || '';


            const groupMembers = data.members || [];

            // Filtrar membros do grupo específico
            const membersOfGroup = groupMembers;
            const membersList = document.getElementById('members-list');
            const noMembersDiv = document.getElementById('no-members');
            const memberCount = document.getElementById('member-count');

            membersList.innerHTML = '';

            if (membersOfGroup.length === 0) {
                noMembersDiv.style.display = 'block';
                memberCount.textContent = '0';
                return;
            }

            noMembersDiv.style.display = 'none';
            memberCount.textContent = membersOfGroup.length;

            membersOfGroup.forEach(member => {


                const memberItem = document.createElement('div');
                memberItem.className = 'list-group-item d-flex justify-content-between align-items-center member-item';

                const isAdmin = member.role === 'admin';

                memberItem.innerHTML = `
                    <div class="d-flex align-items-center">
                        <div class="member-avatar me-3">
                            ${member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h6 class="mb-0">${member.name}</h6>
                            <small class="text-muted">@${member.username}</small>
                        </div>
                    </div>
                `;

                membersList.appendChild(memberItem);
            });
        })
        .catch(error => {
            alert(error.message || 'Erro ao carregar membros do grupo.');
        });
}

function inviteUserToGroup() {
    const urlParams = new URLSearchParams(window.location.search);

    const username = document.getElementById('invite-username').value.trim();
    const feedbackDiv = document.getElementById('invite-feedback');

    if (!username) {
        showFeedback(feedbackDiv, 'Por favor, digite um nome de usuário.', 'danger');
        return;
    }

    fetch('http://localhost:8080/api/v1/groups/invite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({
            groupId: urlParams.get('id'),
            username: username
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(err => {
                    throw new Error(err || 'Erro ao enviar convite.');
                });
            }
            return response.text();
        })
        .catch(error => {
            showFeedback(feedbackDiv, error.message, 'danger');
        });

    showFeedback(feedbackDiv, 'Convite enviado com sucesso!', 'success');

    // Limpar formulário
    document.getElementById('invite-user-form').reset();
}

function goToTaskList() {
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('id');
    if (groupId) {
        window.location.href = `tarefas.html?id=${groupId}`;
    } else {
        alert('ID do grupo não encontrado.');
    }
}

function showFeedback(element, message, type) {
    element.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

/**
 * Carrega os membros do grupo e popula um elemento select com as opções
 * @param {string} groupId - ID do grupo
 * @param {string} selectElementId - ID do elemento select a ser populado
 * @param {boolean} includeDefaultOption - Se deve incluir uma opção padrão
 */
function loadGroupMembersAsOptions(groupId, selectElementId, includeDefaultOption = true) {
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
        const selectElement = document.getElementById(selectElementId);
        
        if (!selectElement) {
            console.error(`Elemento select com ID '${selectElementId}' não encontrado`);
            return;
        }
        
        // Limpar opções existentes
        selectElement.innerHTML = '';
        
        // Adicionar opção padrão (opcional)
        if (includeDefaultOption) {
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Selecione os responsáveis...';
            defaultOption.disabled = true;
            selectElement.appendChild(defaultOption);
        }
        
        // Adicionar cada membro como opção
        groupMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id; // ou member.username, dependendo do backend
            option.textContent = `${member.name} (@${member.username})`;
            option.dataset.memberId = member.id;
            option.dataset.memberUsername = member.username;
            option.dataset.memberName = member.name;
            selectElement.appendChild(option);
        });
        
        console.log(`Carregados ${groupMembers.length} membros no select ${selectElementId}`);
    })
    .catch(error => {
        console.error('Erro ao carregar membros:', error);
        alert(error.message || 'Erro ao carregar membros do grupo.');
    });
}

/**
 * Obtém os IDs dos responsáveis selecionados em um elemento select múltiplo
 * @param {string} selectElementId - ID do elemento select
 * @returns {Array<string>} Array com os IDs selecionados
 */
function getSelectedResponsibleIds(selectElementId) {
    const selectElement = document.getElementById(selectElementId);
    if (!selectElement) {
        console.error(`Elemento select com ID '${selectElementId}' não encontrado`);
        return [];
    }
    
    const selectedOptions = Array.from(selectElement.selectedOptions);
    return selectedOptions.map(option => option.value).filter(value => value !== '');
}

/**
 * Obtém informações completas dos responsáveis selecionados
 * @param {string} selectElementId - ID do elemento select
 * @returns {Array<Object>} Array com objetos contendo id, username e name
 */
function getSelectedResponsibleDetails(selectElementId) {
    const selectElement = document.getElementById(selectElementId);
    if (!selectElement) {
        console.error(`Elemento select com ID '${selectElementId}' não encontrado`);
        return [];
    }
    
    const selectedOptions = Array.from(selectElement.selectedOptions);
    return selectedOptions
        .filter(option => option.value !== '')
        .map(option => ({
            id: option.value,
            username: option.dataset.memberUsername,
            name: option.dataset.memberName
        }));
}
