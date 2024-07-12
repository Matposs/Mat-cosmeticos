let favoritos = [];
import { URL_TESTE, URL_DESENV, URL_PROD } from '../config/config.js';
const url = URL_PROD;

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (window.location.pathname === '/views/favoritos.html') {
        if (!token) {
            window.location.href = '/views/login.html';
            return;
        }
        try {
            const response = await fetch(`${url}/favoritos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Token inválido');
            }

            favoritos = await response.json();
            if (favoritos.length > 0) {
                renderizarProdutosFavoritos(favoritos, document.querySelector('.galeria'));
            }
            document.querySelector('.favoritos__vazio').style.display = favoritos.length > 0 ? 'none' : 'flex';
            document.querySelector('.favoritos__cheio').style.display = favoritos.length > 0 ? 'flex' : 'none';
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
            window.location.href = '/views/login.html';
        }
    }
});
export async function favoritarProduto(produto) {
    const token = localStorage.getItem('token');
    if (!token || !verificarToken(token)) {
        window.location.href = '/views/login.html';
        return;
    }
    try {
        const index = await isFavoritado(produto);
        const options = {
            method: index ? 'DELETE' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(produto)
        };
        const response = await fetch(`${url}/favoritos/${index ? `${produto._id}` : ''}`, options);
        if (!response.ok) {
            throw new Error('Erro ao atualizar favoritos');
        }
        window.location.reload();

    } catch (error) {
        console.error('Erro ao favoritar produto:', error);
    }
}
export async function verificarToken(token) {
    try {
        const response = await fetch(`${URL_PROD}/favoritos/verify-token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.valid;
    } catch (err) {
        console.error('Error verifying token:', err);
        return false;
    }
}

export async function isFavoritado(produto) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${url}/favoritos/${produto._id}/isFavoritado`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao verificar se é favorito');
        }
        const data = await response.json();
        return data.isFavorito;
    } catch (error) {
        console.error('Erro ao verificar se é favorito:', error);
        return false;
    }
}

export async function renderizarProdutosFavoritos(listaProdutos, classeHtml) {
    classeHtml.innerHTML = "";

    for (let produto of listaProdutos) {
        const div = document.createElement('div');
        div.classList.add('coluna');

        const img = document.createElement('img');
        img.src = produto.produtoId.src;

        const divImg = document.createElement('div');
        divImg.classList.add('coluna__imagem');

        const favoritosButton = document.createElement('button');
        favoritosButton.classList.add('botao__favoritar');
        const favorito = await isFavoritado(produto);
        const src = favorito ? "/src/favorites__filled.png" : "/src/favorites.png";
        favoritosButton.innerHTML = `<img src = "${src}" alt = "ícone de favoritar"> `;

        favoritosButton.addEventListener('click', (event) => {
            event.stopPropagation();
            favoritarProduto(produto);
        });

        const informacoes = document.createElement('div');
        informacoes.classList.add('informacoes');
        informacoes.innerHTML = `
        <h2> ${produto.produtoId.nome}</>
            <h3 class="informacoes__descricao">${produto.produtoId.descricao}</h3>
            <p class="informacoes__preco">R$ ${formatarPreco(produto.produtoId.preco)}</p>
            <button class="botao__informacoes">Comprar</button>
        `;

        informacoes.querySelector('.botao__informacoes').addEventListener('click', () => {
            openModal(`
            <h2 class="modal_texto"> Produto adicionado ao carrinho!</>
        <div class="modal__div__principal">
            <div class="modal__img"><img src="${produto.produtoId.src}" alt="imagem do produto">
                <div class="modal__nome"> <h3>${produto.produtoId.nome}</h3>
                    <h4>${produto.produtoId.descricao}</h4>
                </div>
            </div>
            <div class="modal__preco">
                <h3>Preço: R$${formatarPreco(produto.produtoId.preco)}</h3>
            </div>
            <div class="modal__botoes">
                <button id="modal__botoes__return">Continuar Comprando</button>
                <button id="modal__botoes__sacola">Ir para a sacola></button>
            </div>
        </div>
            `);
            adicionarProdutoAoCarrinho(produto);
            const botaoReturn = document.getElementById('modal__botoes__return');
            botaoReturn.addEventListener('click', () => {
                closeModal();
            });
            const botaoSacola = document.getElementById('modal__botoes__sacola');
            botaoSacola.addEventListener('click', () => {
                window.location.href = 'carrinho.html';
            });
        });

        div.appendChild(divImg);
        divImg.appendChild(img);
        divImg.appendChild(favoritosButton);
        div.appendChild(informacoes);
        classeHtml.appendChild(div);
    }
}
function formatarPreco(preco) {
    return parseFloat(preco).toFixed(2);
}

const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');

function openModal(content) {
    modalContent.innerHTML = content;
    modalOverlay.style.display = 'block';
    setTimeout(() => {
        modalOverlay.classList.add('show');
        document.querySelector('.modal').classList.add('show');
    }, 10);
}

function closeModal() {
    modalOverlay.classList.remove('show');
    document.querySelector('.modal').classList.remove('show');
    setTimeout(() => {
        modalOverlay.style.display = 'none';
    }, 500);
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

function adicionarProdutoAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const index = carrinho.findIndex(item => item.nome === produto.nome);
    if (index !== -1) {
        carrinho[index].quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}
