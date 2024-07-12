const bannerItems = document.querySelector('.banner__loja__itens');
const bannerItemWidth = window.innerWidth;
let currentIndex = 0;
let autoSlideInterval = setInterval(proximoSlide, 5000);

document.getElementById('menu-toggle').addEventListener('click', function () {
    document.querySelector('.menu').classList.toggle('active');
});

function atualizarPosicaoSlide() {
    bannerItems.style.transform = `translateX(-${currentIndex * bannerItemWidth}px)`;
}

function proximoSlide() {
    currentIndex = (currentIndex + 1) % bannerItems.children.length;
    atualizarPosicaoSlide();
}

function voltarSlide() {
    currentIndex = (currentIndex - 1 + bannerItems.children.length) % bannerItems.children.length;
    atualizarPosicaoSlide();
}

document.querySelector('.banner__nav--right').addEventListener('click', proximoSlide);
document.querySelector('.banner__nav--left').addEventListener('click', voltarSlide);

let startX;
bannerItems.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    clearInterval(autoSlideInterval);
});

bannerItems.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
        proximoSlide();
    } else if (endX - startX > 50) {
        voltarSlide();
    }
    autoSlideInterval = setInterval(proximoSlide, 5000);
});

document.querySelectorAll('.produto__destaque__item').forEach(item => {
    item.addEventListener('click', function () {
        const newSrc = this.querySelector('img').src;
        const destaqueImg = document.querySelector('.produto__destaque__imagem__container img');
        destaqueImg.src = newSrc;
    });
});

async function carregarJson(caminho) {
    const response = await fetch(caminho);
    const data = await response.json();
    return data
}
async function carregarProdutos() {
    const response = await fetch('http://localhost:3000/produtos');
    const produtos = await response.json();
    const produtosAleatorios = produtos.sort(() => 0.5 - Math.random()).slice(0, 4);
    const produtoEmDestaque = selecionarItemAleatorio(produtos);

    const produtoPrincipal = document.querySelector('.div__pai__body__produto__principal');
    const listaDestaque = document.querySelector('.destaque__lista');

    produtoPrincipal.innerHTML = `
        <h1 class="h1__esquerda">Nosso queridinho do mês!</h1>
        <div class="produto__imagem">
            <img src="${produtoEmDestaque.src}" alt="${produtoEmDestaque.nome}">
            <div class="produto__nome">${produtoEmDestaque.nome}</div>
        </div>
        <div class="produto__detalhes">
            <p>${produtoEmDestaque.descricao}</p>
            <span>R$${formatarPreco(produtoEmDestaque.preco)}</span>
            <button class="botao__informacoes">Comprar</button>
        </div>
    `;
    produtoPrincipal.querySelector('.botao__informacoes').addEventListener('click', () => {
        openModal(`
        <h2 class="modal_texto" >Produto adicionado no seu carrinho!</h2> <div class="modal__div__principal">
        <div class="modal__img"><img src="${produtoEmDestaque.src}" alt="imagem do produto">
            <div class="modal__nome"> <h3>${produtoEmDestaque.nome}</h3>
            <h4>${produtoEmDestaque.descricao}</h4>
            </div>
            </div>
            <div class="modal__preco">
                <h3>Preço: R$${formatarPreco(produtoEmDestaque.preco)}</h3> 
            </div>
            <div class="modal__botoes">
            <button id="modal__botoes__return">Continuar Comprando</button>
            <button id="modal__botoes__sacola">Ir para a sacola ></button>
            </div>
        </div>
        `);
        adicionarProdutoAoCarrinho(produtoEmDestaque);
        const botaoReturn = document.getElementById('modal__botoes__return');
        botaoReturn.addEventListener('click', () => {
            closeModal();
        })
        const botaoSacola = document.getElementById('modal__botoes__sacola');
        botaoSacola.addEventListener('click', () => {
            window.location.href = 'views/carrinho.html';
        })
    });

    listaDestaque.innerHTML = '';

    produtosAleatorios.forEach((produto, index) => {
        atualizarDestaque(produtos[0]);
        const item = document.createElement('div');
        item.className = 'produto__destaque__item';
        item.innerHTML = `
            <img src="${produto.src}" alt="${produto.nome}">
            <div>${produto.nome}</div>
        `;
        item.addEventListener('click', () => atualizarDestaque(produto));
        listaDestaque.appendChild(item);
    });
}

function atualizarDestaque(produto) {
    const destaquePrincipal = document.querySelector('.div__pai__body__destaque .destaque__principal');
    destaquePrincipal.innerHTML = `
        <img src="${produto.src}" alt="${produto.nome}">
        <div class="destaque__nome">${produto.nome}</div>
        <div class="produto__detalhes">
            <p>${produto.descricao}</p>
            <span>R$ ${formatarPreco(produto.preco)}</span>
            <button id="destaque__comprar">Comprar</button>
        </div>
    `;
    const destaqueComprar = document.getElementById('destaque__comprar');
    destaqueComprar.addEventListener('click', () => {
        openModal(`
        <h2 class="modal_texto" >Produto adicionado no seu carrinho!</h2> <div class="modal__div__principal">
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
            window.location.href = 'views/carrinho.html';
        })
    });
}
function selecionarItemAleatorio(lista) {
    const indiceAleatorio = Math.floor(Math.random() * lista.length);
    return lista[indiceAleatorio];
}
function formatarPreco(preco) {
    return parseFloat(preco).toFixed(2);
}
document.addEventListener('DOMContentLoaded', carregarProdutos);
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

//Estou tendo que reutilizar varias funcoes no ctrl + c ctrl +v
// O import de funcoes esta quebrando minhas telas no local
function adicionarProdutoAoCarrinho(produto) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const index = carrinho.findIndex(item => item.nome === produto.nome);
    if (index !== -1) {
        carrinho[index].quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    const carrinhoItens = document.querySelector('.carrinho__cheio__itens');
}