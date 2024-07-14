const form = document.getElementById('signupForm');
import { URL_TESTE, URL_DESENV, URL_PROD } from '../config/config.js';

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const nome = formData.get('nome');
    const email = formData.get('email');
    const senha = formData.get('senha');
    const senhaConfirmar = formData.get('senhaConfirmar');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Por favor, insira um email válido.");
        return;
    }
    if (senha.length < 5) {
        alert("A senha deve ter pelo menos 5 caracteres.");
        return;
    }
    if (senha !== senhaConfirmar) {
        alert("As senhas não correspondem.");
        return;
    }
    try {
        const response = await fetch(`${URL_PROD}/usuarios/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha, senhaConfirmar })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.msg || 'Erro ao registrar usuário');
        }

        alert("Sucesso ao criar usuário! Redirecionando..");
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.message);
        alert("Erro ao cadastrar novo usuário, por favor tente novamente");
    }
});