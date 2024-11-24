document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('funcionarioModal');
    const addBtn = document.getElementById('addFuncionarioBtn');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('funcionarioForm');

    // Carregar funcionários ao iniciar
    loadFuncionarios();

    // Abrir modal
    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        form.reset();
    });

    // Fechar modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Submeter formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const funcionario = {
            nome: document.getElementById('nome').value,
            cargo: document.getElementById('cargo').value,
            equipe: document.getElementById('equipe').value,
            dataAdmissao: document.getElementById('dataAdmissao').value
        };

        try {
            const response = await fetch('http://localhost:3000/api/admin/funcionarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(funcionario)
            });

            if (response.ok) {
                modal.style.display = 'none';
                loadFuncionarios();
                alert('Funcionário cadastrado com sucesso!');
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao cadastrar funcionário');
        }
    });
});

async function loadFuncionarios() {
    try {
        const response = await fetch('http://localhost:3000/api/admin/funcionarios', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const funcionarios = await response.json();
            updateFuncionariosTable(funcionarios);
        }
    } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
    }
}

function updateFuncionariosTable(funcionarios) {
    const tbody = document.querySelector('#funcionariosTable tbody');
    tbody.innerHTML = '';

    funcionarios.forEach(func => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${func.nome}</td>
            <td>${func.cargo}</td>
            <td>${func.equipe}</td>
            <td>${new Date(func.dataAdmissao).toLocaleDateString()}</td>
            <td>
                <button onclick="editFuncionario('${func._id}')" class="btn-edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteFuncionario('${func._id}')" class="btn-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function deleteFuncionario(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/funcionarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                loadFuncionarios();
                alert('Funcionário excluído com sucesso!');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir funcionário');
        }
    }
}