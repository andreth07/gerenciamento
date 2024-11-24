document.addEventListener('DOMContentLoaded', function() {
    loadBonificacoes();
});

async function loadBonificacoes() {
    try {
        const response = await fetch('http://localhost:3000/api/admin/bonificacoes', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const bonificacoes = await response.json();
            updateBonificacoesView(bonificacoes);
        }
    } catch (error) {
        console.error('Erro ao carregar bonificações:', error);
    }
}

function updateBonificacoesView(bonificacoes) {
    const container = document.querySelector('.equipes-list');
    container.innerHTML = '';

    bonificacoes.forEach(equipe => {
        const equipeElement = document.createElement('div');
        equipeElement.className = 'equipe-card';
        
        equipeElement.innerHTML = `
            <h3>${equipe.nome}</h3>
            <div class="funcionarios-list">
                ${equipe.funcionarios.map(func => `
                    <div class="funcionario-item ${func.bonificado ? 'bonificado' : ''}">
                        <span>${func.nome}</span>
                        <span class="avaliacao">Avaliação: ${func.avaliacao}/10</span>
                        ${func.bonificado ? '<span class="badge-bonus">Bonificado</span>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        container.appendChild(equipeElement);
    });
}