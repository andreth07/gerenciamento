// Adicionar classe de erro com animação
function showError(element) {
    element.classList.add('error');
    setTimeout(() => {
        element.classList.remove('error');
    }, 800);
}

// Adicionar loading no botão
function toggleButtonLoading(button, state) {
    if (state) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}