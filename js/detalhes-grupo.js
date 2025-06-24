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
