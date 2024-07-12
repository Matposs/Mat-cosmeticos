const loginForm = document.getElementById('loginForm');
const loginContainer = document.getElementById('login-container');
const welcomeContainer = document.getElementById('welcome-container');
const welcomeMessage = document.getElementById('welcome-message');
const logoutButton = document.getElementById('logout-button');
const { URL_TESTE, URL_DESENV, URL_PROD } = require('../config/config.js');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(`${URL_PROD}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.msg || 'Erro ao fazer login');
        }
        const { token } = responseData;
        localStorage.setItem('token', token);
        alert("Sucesso! Redirecionando..");
        displayWelcomeMessage();
    } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        alert("Erro ao fazer login, por favor tente novamente");
    }
});

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    displayLoginForm();
});

function displayWelcomeMessage() {
    welcomeMessage.innerText = `Bem vindo! Você está conectado`;
    loginContainer.style.display = 'none';
    welcomeContainer.style.display = 'block';
}

function displayLoginForm() {
    loginContainer.style.display = 'block';
    welcomeContainer.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        displayWelcomeMessage();
    } else {
        displayLoginForm();
    }
});
