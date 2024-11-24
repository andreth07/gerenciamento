document.addEventListener('DOMContentLoaded', function() {
    loadTeamMembers();
});

async function loadTeamMembers() {
    try {
        const response = await fetch('http://localhost:3000/api/leader/team', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const members = await response.json();
            updateTeamGrid(members);
        } else {
            console.error('Erro ao carregar membros da equipe');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

function updateTeamGrid(members) {
    const grid = document.getElementById('membersGrid');
    grid.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'member-card';
        
        const avgRating = calculateAverageRating(member.avaliacoes);
        
        card.innerHTML = `
            <img src="${member.foto || '../../img/default-avatar.png'}" alt="${member.nome}" class="member-photo">
            <div class="member-info">
                <h3 class="member-name">${member.nome}</h3>
                <p class="member-role">${member.cargo}</p>
                <div class="member-rating">
                    ${avgRating.toFixed(1)}
                    <div class="rating-stars">
                        ${generateStars(avgRating)}
                    </div>
                </div>
                <div class="member-stats">
                    <p>Última avaliação: ${formatDate(member.ultimaAvaliacao)}</p>
                </div>
            </div>
        `;

        // Adicionar evento de clique para mostrar mais detalhes
        card.addEventListener('click', () => showMemberDetails(member));
        
        grid.appendChild(card);
    });

    // Também atualiza o select de funcionários no formulário de avaliação
    updateFuncionarioSelect(members);
}

function calculateAverageRating(avaliacoes) {
    if (!avaliacoes || avaliacoes.length === 0) return 0;
    const sum = avaliacoes.reduce((acc, curr) => acc + curr.pontuacao, 0);
    return sum / avaliacoes.length;
}

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
    if (!date) return 'Não avaliado';
    return new Date(date).toLocaleDateString('pt-BR');
}

function showMemberDetails(member) {
    // Implementar modal ou painel lateral com mais detalhes do funcionário
    console.log('Detalhes do funcionário:', member);
}

function updateFuncionarioSelect(members) {
    const select = document.getElementById('funcionario');
    select.innerHTML = '<option value="">Selecione o funcionário</option>';
    
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member._id;
        option.textContent = member.nome;
        select.appendChild(option);
    });
}