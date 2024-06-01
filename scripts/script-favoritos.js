const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
const favoritosCheio = document.querySelector('.galeria');
const favoritosVazio = document.querySelector('.favoritos__vazio');

document.addEventListener('DOMContentLoaded', () => {
    if (document.title === "Favoritos") {
        renderizarProdutosFavoritos(favoritos, favoritosCheio);
        if (favoritos.length > 0) {
            favoritosCheio.style.display = 'flex';
            favoritosVazio.style.display = 'none';
        } else {
            favoritosCheio.style.display = 'none';
            favoritosVazio.style.display = 'flex';
        }
    }
});

export function favoritarProduto(produto) {
    const index = favoritos.findIndex(item => item.nome === produto.nome);
    if (index !== -1) {
        favoritos.splice(index, 1);
        if (document.title === "Favoritos") {
            location.reload();
        }
    } else {
        favoritos.push(produto);
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    console.log('Favoritos atualizados:', favoritos);
}

function isProdutoFavoritado(produto) {
    return favoritos.some(item => item.nome === produto.nome);
}

function renderizarProdutosFavoritos(listaProdutos, classeHtml) {
    classeHtml.innerHTML = "";
    listaProdutos.forEach((produto) => {
        const div = document.createElement('div');
        div.classList.add('coluna');

        const img = document.createElement('img');
        img.src = produto.src;

        const divImg = document.createElement('div');
        divImg.classList.add('coluna__imagem')

        const favoritosButton = document.createElement('button');
        favoritosButton.classList.add('botao__favoritar');
        favoritosButton.innerHTML = `<img src="/src/favorites${isProdutoFavoritado(produto) ? '__filled' : ''}.png" alt="ícone de favoritar">`;

        if (isProdutoFavoritado(produto)) {
            favoritosButton.classList.add('favoritado');
        }

        favoritosButton.addEventListener('click', () => {
            favoritarProduto(produto);
            renderizarProdutosFavoritos(listaProdutos, classeHtml);
        });

        const informacoes = document.createElement('div');
        informacoes.classList.add('informacoes');
        informacoes.innerHTML = `
            <h2>${produto.nome}</h2>
            <h3 class="informacoes__descricao">${produto.descricao}</h3>
            <p class="informacoes__preco">R$ ${formatarPreco(produto.preco)}</p>
            <button class="botao__informacoes">Comprar</button>
        `;

        informacoes.querySelector('.botao__informacoes').addEventListener('click', () => {
            openModal(`
            <h2 class="modal_texto" >Produto adicionado ao carrinho!</h2> <div class="modal__div__principal">
            <div class="modal__img"><img src="${produto.src}" alt="imagem do produto">
                <div class="modal__nome"> <h3>${produto.nome}</h3>
                <h4>${produto.descricao}</h4>
                </div>
                </div>
                <div class="modal__preco">
                    <h3>Preço: R$${formatarPreco(produto.preco)}</h3> 
                </div>
                <div class="modal__botoes">
                    <button id="modal__botoes__return">Continuar Comprando</button>
                    <button id="modal__botoes__sacola">Ir para a sacola ></button>
                </div>
            </div>
            `);
            adicionarProdutoAoCarrinho(produto);
            const botaoReturn = document.getElementById('modal__botoes__return');
            botaoReturn.addEventListener('click', () => {
                closeModal();
            })
            const botaoSacola = document.getElementById('modal__botoes__sacola');
            botaoSacola.addEventListener('click', () => {
                window.location.href = 'carrinho.html';
            })
        });

        div.appendChild(divImg);
        divImg.appendChild(img);
        divImg.appendChild(favoritosButton);
        div.appendChild(informacoes);
        classeHtml.appendChild(div);
    });
}

document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('botao__favoritar')) {
        const produtoNome = target.closest('.coluna').querySelector('h2').textContent;
        const produto = listaProdutos.find(produto => produto.nome === produtoNome);
        favoritarProduto(produto);
        renderizarProdutosFavoritos(listaProdutos, classeHtml);
    }
});

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