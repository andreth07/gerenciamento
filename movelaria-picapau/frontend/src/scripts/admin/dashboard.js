document.addEventListener('DOMContentLoaded', function() {
    // Navegação entre abas
    const navLinks = document.querySelectorAll('.nav-links li[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all links and contents
            navLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked link and corresponding content
            link.classList.add('active');
            document.getElementById(link.dataset.tab).classList.add('active');
        });
    });

    // Logout
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        window.location.href = '../login.html';
    });

    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../login.html';
    }

    // Carregar dados do dashboard
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        const response = await fetch('http://localhost:3000/api/admin/dashboard', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            updateDashboardCards(data);
        }
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
    }
}

function updateDashboardCards(data) {
    document.getElementById('totalFuncionarios').textContent = data.totalFuncionarios || 0;
    document.getElementById('totalCurriculos').textContent = data.totalCurriculos || 0;
    document.getElementById('totalBonificacoes').textContent = data.totalBonificacoes || 0;
}