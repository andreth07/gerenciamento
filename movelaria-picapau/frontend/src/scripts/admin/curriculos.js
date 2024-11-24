import config from '../../config/api.js';

async function uploadCurriculo(formData) {
    try {
        const response = await fetch(`${config.API_URL}/api/admin/curriculos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Erro no upload');
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}



document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('curriculoModal');
    const addBtn = document.getElementById('addCurriculoBtn');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('curriculoForm');

    // Carregar currículos ao iniciar
    loadCurriculos();

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

        const formData = new FormData();
        formData.append('nome', document.getElementById('nomeCandidato').value);
        formData.append('email', document.getElementById('emailCandidato').value);
        formData.append('cargoPretendido', document.getElementById('cargoPretendido').value);
        formData.append('curriculo', document.getElementById('curriculo').files[0]);

        try {
            const response = await fetch('http://localhost:3000/api/admin/curriculos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (response.ok) {
                modal.style.display = 'none';
                loadCurriculos();
                alert('Currículo cadastrado com sucesso!');
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao cadastrar currículo');
        }
    });
});

async function loadCurriculos() {
    try {
        const response = await fetch('http://localhost:3000/api/admin/curriculos', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const curriculos = await response.json();
            updateCurriculosTable(curriculos);
        }
    } catch (error) {
        console.error('Erro ao carregar currículos:', error);
    }
}

function updateCurriculosTable(curriculos) {
    const tbody = document.querySelector('#curriculosTable tbody');
    tbody.innerHTML = '';

    curriculos.forEach(curr => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${curr.nome}</td>
            <td>${curr.email}</td>
            <td>${curr.cargoPretendido}</td>
            <td>${new Date(curr.dataEnvio).toLocaleDateString()}</td>
            <td>${curr.status}</td>
            <td>
                <button onclick="viewCurriculo('${curr._id}')" class="btn-view">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="updateStatus('${curr._id}')" class="btn-status">
                    <i class="fas fa-sync-alt"></i>
                </button>
                <button onclick="deleteCurriculo('${curr._id}')" class="btn-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}