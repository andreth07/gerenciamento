import config from '../config/api.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`${config.API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', data.userType);

                // Redirecionar baseado no tipo de usuário
                if (data.userType === 'admin') {
                    window.location.href = '/src/pages/admin/dashboard.html';
                } else if (data.userType === 'leader') {
                    window.location.href = '/src/pages/leader/dashboard.html';
                }
            } else {
                alert(data.message || 'Erro ao fazer login');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor');
        }
    });
});