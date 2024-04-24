const bannerItems = document.querySelector('.banner__loja__itens');
const bannerItemWidth = window.innerWidth;
let currentIndex = 0;
let autoSlideInterval = setInterval(proximoSlide, 5000);

const produtos = [
    {
        nome: "Shampoo masculino",
        descricao: "Shampoo para cabelos castanhos",
        preco: "R$ 35,90",
        imagem: "./src/cabeloMasc01.png"
    },
    {
        nome: "Batom vermelho",
        descricao: "Batom vermelho para festas",
        preco: "R$ 39,90",
        imagem: "./src/batom01.png"
    },
    {
        nome: "Creme de rosto",
        descricao: "Creme noturno para o rosto",
        preco: "R$ 22,90",
        imagem: "./src/creme01.png"
    },
    {
        nome: "Shampoo anticaspa",
        descricao: "Shampoo para tratamento da caspa",
        preco: "R$ 31,50",
        imagem: "./src/produto01.png"
    },
];
const produtoEmDestaque = {
    nome: "Batom Vermelho",
    descricao: "Batom vermelho para festas",
    preco: "R$ 39,90",
    imagem: "./src/batom01.png"
}


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
function carregarProdutos() {
    const produtoPrincipal = document.querySelector('.div__pai__body__produto__principal');
    const listaDestaque = document.querySelector('.destaque__lista');

    produtoPrincipal.innerHTML = `
    <h1 class="h1__esquerda">Nosso queridinho do mês!</h1>
                <div class="produto__imagem">
                    <img src="${produtoEmDestaque.imagem}" alt="${produtoEmDestaque.nome}">
                    <div class="produto__nome">${produtoEmDestaque.nome}</div>
                </div>
                <div class="produto__detalhes">
                    <p>${produtoEmDestaque.descricao}</p>
                    <span>${produtoEmDestaque.preco}</span>
                    <button>Comprar</button>
                </div>
            `;
    produtos.forEach((produto, index) => {
        atualizarDestaque(produtos[0]);
        const item = document.createElement('div');
        item.className = 'produto__destaque__item';
        item.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <div>${produto.nome}</div>
        `;
        item.addEventListener('click', () => atualizarDestaque(produto));
        listaDestaque.appendChild(item);
    });
}

function atualizarDestaque(produto) {
    const destaquePrincipal = document.querySelector('.div__pai__body__destaque .destaque__principal');
    const destaqueComprar = document.querySelector('.div__pai__body__destaque');
    destaquePrincipal.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="destaque__nome">${produto.nome}</div>
        <div class="produto__detalhes">
        <p>${produto.descricao}</p>
        <span>${produto.preco}</span>
        <button>Comprar</button>
    </div>
    `;
}
document.addEventListener('DOMContentLoaded', carregarProdutos);



