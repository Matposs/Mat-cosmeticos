const bannerItemWidth = window.innerWidth;
let currentIndex = 0;
let produtos = [];
let precoTotal;
const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const produtosCarrossel = document.querySelector('.carrossel__conteudo');
import { URL_TESTE, URL_DESENV, URL_PROD } from '../config/config.js';

document.addEventListener('DOMContentLoaded', () => {
    if (document.title === "Carrinho") {
        criarCarouselProdutos();
        const carrinhoCheio = document.querySelector('.carrinho__cheio');
        const carrinhoVazio = document.querySelector('.carrinho__vazio');
        if (Array.isArray(carrinho) && carrinho.length > 0) {
            carrinhoCheio.style.display = 'flex';
            carrinhoVazio.style.display = 'none';
            criarCarrinhoCheio();
            vincularEventosQuantidade();
            calcularPrecoTotal();
        } else {
            carrinhoCheio.style.display = 'none';
            carrinhoVazio.style.display = 'flex';
        }
    }
});

async function criarCarouselProdutos() {
    const response = await fetch(`${URL_PROD}/produtos`);
    const produtos = await response.json();
    produtos.slice(0, 8).forEach(produto => {
        const card = criarProdutoCard(produto);
        produtosCarrossel.appendChild(card);
    });
    const cardComprarButtons = document.querySelectorAll('.botao-comprar');
    cardComprarButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            openModal(`
                <h2 class="modal_texto">Produto adicionado ao carrinho!</h2> 
                <div class="modal__div__principal">
                    <div class="modal__img">
                        <img src="${produtos[index].src}" alt="imagem do produto">
                        <div class="modal__nome">
                            <h3>${produtos[index].nome}</h3>
                            <h4>${produtos[index].descricao}</h4>
                        </div>
                    </div>
                    <div class="modal__preco">
                        <h3>Preço: R$${formatarPreco(produtos[index].preco)}</h3> 
                    </div>
                </div>
            `);

            adicionarProdutoAoCarrinho(produtos[index]);
            setTimeout(() => {
                closeModal();
            }, 3000);
        });
    });
}

function criarProdutoCard(produto) {
    const card = document.createElement('div');
    card.classList.add('carrossel__item');
    card.innerHTML = `
        <img src="${produto.src || produto.produtoId.src}" alt="${produto.nome || produto.produtoId.nome}">
        <h3>${produto.nome || produto.produtoId.nome}</h3>
        <p>${produto.descricao || produto.produtoId.descricao}</p>
        <span>R$${formatarPreco(produto.preco || produto.produtoId.preco)}</span>
        <button class="botao-comprar">Comprar</button>
    `;
    return card;
}

function atualizarPrecoProduto(produto) {
    const produtoNome = produto.nome || produto.produtoId.nome;
    const produtoNomeSanitizado = produtoNome.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const quantidade = produto.quantidade || produto.produtoId.quantidade;
    const preco = produto.preco || produto.produtoId.preco;
    const precoProdutoTotal = preco * quantidade;

    const precoElemento = document.querySelector(`#quantidade-${produtoNomeSanitizado}`).closest('.carrinho__item').querySelector('.carrinho__item__info__preco p');
    precoElemento.innerText = `R$${formatarPreco(precoProdutoTotal)}`;
}

async function carregarJson(caminho) {
    const response = await fetch(caminho);
    const data = await response.json();
    return data;
}

const carrossel = document.querySelector('.carrossel');

function atualizarPosicaoSlide() {
    const slideWidth = window.innerWidth < 768 ? carrossel.clientWidth / 2 : carrossel.clientWidth / 4;
    carrossel.querySelector('.carrossel__conteudo').style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

function proximoSlide() {
    if (currentIndex < produtosCarrossel.children.length - 4) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    atualizarPosicaoSlide();
}

function voltarSlide() {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = produtosCarrossel.children.length - 4;
    }
    atualizarPosicaoSlide();
}

document.querySelector('.carrossel__nav--right').addEventListener('click', proximoSlide);
document.querySelector('.carrossel__nav--left').addEventListener('click', voltarSlide);

let touchStartX;
let touchEndX;

carrossel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

carrossel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleGesture();
});

function handleGesture() {
    if (touchEndX < touchStartX) {
        proximoSlide();
    } else if (touchEndX > touchStartX) {
        voltarSlide();
    }
}

function formatarPreco(preco) {
    return parseFloat(preco).toFixed(2);
}

function criarCarrinhoCheio() {
    const carrinhoCheio = document.querySelector('.carrinho__cheio');
    const carrinhoItens = document.querySelector('.carrinho__cheio__itens');
    let totalProdutos = 0;
    let precoTotal = 0;
    carrinhoItens.innerHTML = '';

    carrinho.forEach(produto => {
        const produtoNome = produto.nome || produto.produtoId.nome;
        const produtoNomeSanitizado = produtoNome.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        const quantidade = produto.quantidade || produto.produtoId.quantidade;
        const preco = produto.preco || produto.produtoId.preco;
        const precoProdutoTotal = preco * quantidade;

        const item = document.createElement('div');
        item.classList.add('carrinho__item');
        item.innerHTML = `
        <div class="carrinho__item__info">
            <div class="carrinho__item__info__img">
                <img src="${produto.src || produto.produtoId.src}" alt="${produtoNome}">
            </div>
            <div class="carrinho__item__info__nome">
                <h3 id="item__nome">${produtoNome}</h3>
                <p>${produto.descricao || produto.produtoId.descricao}</p>
            </div>
            <div class="carrinho__item__info__quantidade">
                <label for="quantidade-${produtoNomeSanitizado}"></label>
                <select id="quantidade-${produtoNomeSanitizado}" name="quantidade">
                    ${criarOptionsQuantidade(quantidade)}
                </select>
                <div class="carrinho__item__info__quantidade__remover">
                    <button data-nome="${produtoNome}" class="remover">remover</button>
                </div>
            </div>
            <div class="carrinho__item__info__preco">
                <p>R$${formatarPreco(precoProdutoTotal)}</p>
            </div>
        </div>`;

        carrinhoItens.appendChild(item);
        totalProdutos += quantidade;
        precoTotal += precoProdutoTotal;
    });

    const carrinhoComprar = document.querySelector('.carrinho__cheio__comprar');
    carrinhoComprar.innerHTML = `
    <div class="preco__total">
        <h2> Preço Total: R$${formatarPreco(precoTotal)}</h2>
    </div>
    <div class="cupom-desconto">
        <label for="cupom">Tem cupom de desconto?</label>
        <input type="text" id="cupom" name="cupom" placeholder="Use o cupom 20OFF">
        <button id="aplicar-cupom">Aplicar</button>
    </div>
    <button id="finalizar-compra">Finalizar Compra</button>`;

    document.getElementById('aplicar-cupom').addEventListener('click', aplicarCupom);
    document.querySelector('.carrinho__cheio__h2').innerText = `Sacola (${totalProdutos} produtos)`;
    vincularEventosQuantidade();
    return carrinhoCheio;
}

function criarOptionsQuantidade(quantidade) {
    let options = '';
    for (let i = 1; i <= 10; i++) {
        options += `<option value="${i}" ${i === quantidade ? 'selected' : ''}>${i}</option>`;
    }
    return options;
}

function adicionarProdutoAoCarrinho(produto) {
    const index = carrinho.findIndex(item => {
        const itemId = item.produtoId ? item.produtoId._id : item._id;
        const produtoId = produto.produtoId ? produto.produtoId._id : produto._id;
        return itemId === produtoId;
    });

    if (index !== -1) {
        carrinho[index].quantidade++;
    } else {
        produto.quantidade = 1;
        carrinho.push(produto);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    calcularPrecoTotal();
    criarCarrinhoCheio();
}

function vincularEventosQuantidade() {
    const selectElements = document.querySelectorAll('.carrinho__item__info__quantidade select');
    const removeButtons = document.querySelectorAll('.remover');

    selectElements.forEach(select => {
        select.addEventListener('change', (e) => {
            const produtoNome = e.target.closest('.carrinho__item').querySelector('#item__nome').innerText;
            atualizarQuantidade(produtoNome, e.target.value);
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const produtoNome = e.target.dataset.nome;
            removerProdutoCarrinho(produtoNome);
        });
    });
}

function atualizarQuantidade(nomeProduto, novaQuantidade) {
    const produto = carrinho.find(item => (item.nome || item.produtoId.nome) === nomeProduto);
    if (produto) {
        produto.quantidade = parseInt(novaQuantidade, 10);
        atualizarPrecoProduto(produto);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        calcularPrecoTotal();
    }
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

function removerProdutoCarrinho(nomeProduto) {
    const index = carrinho.findIndex(item => (item.nome || item.produtoId.nome) === nomeProduto);
    if (index !== -1) {
        const confirmacao = confirm(`Você realmente deseja excluir o produto "${nomeProduto}" do seu carrinho?`);
        if (confirmacao) {
            carrinho.splice(index, 1);
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            if (carrinho.length > 0) {
                criarCarrinhoCheio();
            }
            else {
                window.location.reload();
            }
        }
        else return
    }
}

function calcularPrecoTotal() {
    const carrinhoCheio = document.querySelector('.carrinho__cheio');
    const precoTotalElemento = carrinhoCheio.querySelector('.preco__total h2');
    const precoTotal = carrinho.reduce((total, produto) => {
        const preco = produto.preco || produto.produtoId.preco;
        return total + (preco * (produto.quantidade || produto.produtoId.quantidade));
    }, 0);
    precoTotalElemento.innerText = `Preço Total: R$${formatarPreco(precoTotal)}`;
}

function aplicarCupom() {
    const cupomInput = document.querySelector('#cupom');
    const cupomValor = cupomInput.value.trim().toUpperCase();
    const desconto = cupomValor === '20OFF' ? 0.20 : 0;
    const carrinhoCheio = document.querySelector('.carrinho__cheio');
    const precoTotalElemento = carrinhoCheio.querySelector('.preco__total h2');
    const precoTotalOriginal = carrinho.reduce((total, produto) => {
        const preco = produto.preco || produto.produtoId.preco;
        return total + (preco * (produto.quantidade || produto.produtoId.quantidade));
    }, 0);

    const precoComDesconto = precoTotalOriginal * (1 - desconto);
    if (desconto == 0) {
        return
    } else {
        precoTotalElemento.innerHTML = `<span style="text-decoration: line-through;">${formatarPreco(precoTotalOriginal)}</span>
            <span style="color: green; margin-left: 10px;"><br> Preço total: R$${formatarPreco(precoComDesconto)}</span>`;
    }
}
