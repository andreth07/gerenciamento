document.addEventListener('DOMContentLoaded', function() {
    const avaliacaoForm = document.getElementById('avaliacaoForm');
    
    avaliacaoForm.addEventListener('submit', submitAvaliacao);
    
    // Carregar histórico inicial
    loadHistorico();
    
    // Configurar filtros
    setupFilters();
});

async function submitAvaliacao(e) {
    e.preventDefault();

    const avaliacao = {
        funcionarioId: document.getElementById('funcionario').value,
        mes: document.getElementById('mes').value,
        pontuacao: document.getElementById('pontuacao').value,
        observacoes: document.getElementById('observacoes').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/leader/avaliacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(avaliacao)
        });

        if (response.ok) {
            alert('Avaliação registrada com sucesso!');
            avaliacaoForm.reset();
            loadHistorico(); // Recarrega o histórico
            loadTeamMembers(); // Atualiza os cards dos membros
        } else {
            const error = await response.json();
            alert(error.message || 'Erro ao registrar avaliação');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar avaliação');
    }
}

async function loadHistorico() {
    const mes = document.getElementById('filterMes').value;
    const funcionarioId = document.getElementById('filterFuncionario').value;

    try {
        let url = 'http://localhost:3000/api/leader/avaliacoes';
        const params = new URLSearchParams();
        
        if (mes) params.append('mes', mes);
        if (funcionarioId) params.append('funcionarioId', funcionarioId);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const avaliacoes = await response.json();
            updateHistoricoTable(avaliacoes);
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }
}

function updateHistoricoTable(avaliacoes) {
    const tbody = document.querySelector('#historicoTable tbody');
    tbody.innerHTML = '';

    avaliacoes.forEach(avaliacao => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${avaliacao.funcionario.nome}</td>
            <td>${getNomeMes(avaliacao.mes)}</td>
            <td>
                <div class="rating-display">
                    ${avaliacao.pontuacao}
                    <div class="rating-stars">
                        ${generateStars(avaliacao.pontuacao)}
                    </div>
                </div>
            </td>
            <td>${avaliacao.observacoes || '-'}</td>
            <td>${formatDate(avaliacao.createdAt)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function setupFilters() {
    const filterMes = document.getElementById('filterMes');
    const filterFuncionario = document.getElementById('filterFuncionario');

    // Preencher meses no filtro
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    filterMes.innerHTML = '<option value="">Todos os meses</option>';
    meses.forEach((mes, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = mes;
        filterMes.appendChild(option);
    });

    // Adicionar eventos de filtro
    filterMes.addEventListener('change', loadHistorico);
    filterFuncionario.addEventListener('change', loadHistorico);
}

function getNomeMes(numeroMes) {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[numeroMes - 1];
}

// Funções auxiliares
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }

    return stars;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}