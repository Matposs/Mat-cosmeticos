export function renderizarProdutos(listaProdutos, classeHtml) {
    classeHtml.innerHTML = "";
    listaProdutos.forEach((produto) => {
        const div = document.createElement('div');
        div.classList.add('coluna');

        const img = document.createElement('img');
        img.src = produto.src;

        const informacoes = document.createElement('div');
        informacoes.innerHTML = `
            <h2 class="informacoes__nome">${produto.nome}</h2>
            <h3 class="informacoes__descricao">${produto.descricao}</h3>
            <p class="informacoes__preco">R$ ${produto.preco.toFixed(2)}</p>
            <button class="botao__informacoes">Comprar</button>
        `;
        div.appendChild(img);
        div.appendChild(informacoes);
        classeHtml.appendChild(div);
    });
}