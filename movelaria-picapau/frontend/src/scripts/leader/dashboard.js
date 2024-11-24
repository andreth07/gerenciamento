import config from '../../config/api.js';

async function loadLeaderInfo() {
    try {
        const response = await fetch(`${config.API_URL}/api/leader/info`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('leaderName').textContent = data.name;
            document.getElementById('teamName').textContent = `Equipe ${data.teamNumber}`;
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'leader') {
        window.location.href = '../login.html';
        return;
    }

    // Carregar informações do líder
    loadLeaderInfo();

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
        localStorage.removeItem('teamId');
        window.location.href = '../login.html';
    });
});

async function loadLeaderInfo() {
    try {
        const response = await fetch('http://localhost:3000/api/leader/info', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('leaderName').textContent = data.name;
            document.getElementById('teamName').textContent = `Equipe ${data.teamNumber}`;
            localStorage.setItem('teamId', data.teamId);
        } else {
            console.error('Erro ao carregar informações do líder');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}