const bannerItemWidth = window.innerWidth;
let currentIndex = 0;
let produtos = [];
let precoTotal;
const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const produtosCarrossel = document.querySelector('.carrossel__conteudo');

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
    produtos = await carregarJson('/produtos/produtos.json');
    produtos.slice(0, 8).forEach(produto => {
        const card = criarProdutoCard(produto);
        produtosCarrossel.appendChild(card);
    });
    const cardComprarButtons = document.querySelectorAll('.botao-comprar');
    cardComprarButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const produto = produtos[index];
            openModal(`
                <h2 class="modal_texto" >Produto adicionado ao carrinho!</h2> 
                <div class="modal__div__principal">
                    <div class="modal__img">
                        <img src="${produto.src}" alt="imagem do produto">
                        <div class="modal__nome">
                            <h3>${produto.nome}</h3>
                            <h4>${produto.descricao}</h4>
                        </div>
                    </div>
                    <div class="modal__preco">
                        <h3>Preço: R$${formatarPreco(produto.preco)}</h3> 
                    </div>
                </div>
            `);
            adicionarProdutoAoCarrinho(produto);
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
        <img src="${produto.src}" alt="${produto.nome}">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <span>R$${formatarPreco(produto.preco)}</span>
        <button class="botao-comprar">Comprar</button>
    `;
    return card;
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
    if (currentIndex < produtosCarrossel.children.length - 4) { // Avança até o quarto item antes do fim
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
    carrinhoItens.innerHTML = '';
    carrinho.forEach(produto => {
        const item = document.createElement('div');
        item.classList.add('carrinho__item');
        item.innerHTML = `
        <div class="carrinho__item__info">
        <div class="carrinho__item__info__img">
            <img src="${produto.src}" alt="${produto.nome}">
        </div>
        <div class="carrinho__item__info__nome">
            <h3 id="item__nome">${produto.nome}</h3>
            <p>${produto.descricao}</p>
        </div>
        <div class="carrinho__item__info__quantidade">
            <label for="quantidade-${produto.nome}"></label>
            <select id="quantidade-${produto.nome.replace(/\s+/g, '-').replace(/[^\w-]/g, '')}" name="quantidade">
                ${criarOptionsQuantidade(produto.quantidade)}
            </select>
            <div class="carrinho__item__info__quantidade__remover">
                    <button data-nome="${produto.nome}" class="remover">remover</button>
             </div>
        </div>
        <div class="carrinho__item__info__preco">
            <p>R$${formatarPreco(produto.preco * produto.quantidade)}</p>
        </div>
    </div>
`;
        carrinhoItens.appendChild(item);
        totalProdutos += produto.quantidade;
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
        <button id="finalizar-compra">Finalizar Compra</button>
    `;
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
    const index = carrinho.findIndex(item => item.nome === produto.nome);
    if (index !== -1) {
        carrinho[index].quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    const carrinhoItens = document.querySelector('.carrinho__cheio__itens');
    carrinhoItens.innerHTML = '';
    criarCarrinhoCheio();
    calcularPrecoTotal();
}
function removerProdutoCarrinho(produto) {
    const index = carrinho.findIndex(item => item.nome === produto.nome);
    if (index !== -1) {
        if (confirm("Deseja excluir?")) {
            carrinho.splice(index, 1);
            localStorage.removeItem('carrinho', JSON.stringify(carrinho));
            const carrinhoItens = document.querySelector('.carrinho__cheio__itens');
            carrinhoItens.innerHTML = '';
            criarCarrinhoCheio();
            calcularPrecoTotal();
            if (carrinho.length == 0) location.reload();
        } else {
            return
        }
    } else {
        console.error('Produto não encontrado no carrinho:', produto);
    }
}

function calcularPrecoTotal() {
    precoTotal = 0;
    carrinho.forEach(produto => {
        precoTotal += produto.preco * produto.quantidade;
    });
    document.querySelector('.preco__total h2').innerText = `Preço Total: R$${formatarPreco(precoTotal)}`;
}

function atualizarQuantidade(event, produtoAtualizado) {
    produtoAtualizado.quantidade = parseInt(event.target.value);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    calcularPrecoTotal();
    const carrinhoItens = document.querySelector('.carrinho__cheio__itens');
    carrinhoItens.innerHTML = '';
    criarCarrinhoCheio();
}

function vincularEventosQuantidade() {
    carrinho.forEach(produto => {
        if (!produto || !produto.nome) {
            console.error("Produto inválido ou sem nome:", produto);
            return;
        }
        const produtoNomeRegex = produto.nome.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        const selectQuantidade = document.querySelector(`#quantidade-${produtoNomeRegex}`);
        if (selectQuantidade) {
            selectQuantidade.addEventListener('change', (event) => atualizarQuantidade(event, produto));
        } else {
            console.error("Elemento select não encontrado para o produto:", produto);
        }
    });
}
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remover')) {
        const produtoNome = event.target.dataset.nome;
        const produto = carrinho.find(item => item.nome === produtoNome);
        removerProdutoCarrinho(produto);
    }
});

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

function aplicarCupom() {
    const cupom = document.getElementById('cupom').value;
    const precoTotalElement = document.querySelector('.preco__total h2');
    const precoTotalSemDesconto = precoTotal;
    let precoComDesconto = precoTotal;

    if (cupom === '20OFF') {
        precoComDesconto = precoTotal * 0.8;
        precoTotalElement.innerHTML = `
            <span style="text-decoration: line-through;">${formatarPreco(precoTotalSemDesconto)}</span>
            <span style="color: green; margin-left: 10px;"><br> Preço total: R$${formatarPreco(precoComDesconto)}</span>
        `;
    } else {
        alert('Cupom inválido!');
    }
}