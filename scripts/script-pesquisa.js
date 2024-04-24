import { renderizarProdutos } from "./script-renderizar.js";

export function buscarProdutos(produtos, classeHtml, termoBusca) {
    if (termoBusca === "") {
        return renderizarProdutos(produtos, classeHtml);
    }

    const produtosEncontrados = produtos.filter((produto) => {
        const nomeProduto = produto.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return nomeProduto === termoBusca;
    });

    if (produtosEncontrados.length === 0) {
        const produtosContemTermo = produtos.filter((produto) => {
            const nomeProduto = produto.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return nomeProduto.includes(termoBusca);
        });

        if (produtosContemTermo.length > 0) {
            renderizarProdutos(produtosContemTermo, classeHtml);
        } else {
            alert("Produto não encontrado");
            renderizarProdutos(produtos, classeHtml);
        }
    } else {
        renderizarProdutos(produtosEncontrados, classeHtml);
    }
}