export function ordenarProdutos(valorOrdenacao, listaDeProdutos) {
    switch (valorOrdenacao) {
        case "menor-preco":
            return listaDeProdutos.sort((a, b) => a.preco || a.produtoId.preco - b.preco || b.produtoId.preco);
        case "maior-preco":
            return listaDeProdutos.sort((a, b) => b.preco || b.produtoId.preco - a.preco || a.produtoId.preco);
        case "a-z":
            return listaDeProdutos.sort((a, b) => a.nome.localeCompare(b.nome));
        case "z-a":
            return listaDeProdutos.sort((a, b) => b.nome.localeCompare(a.nome));
        default:
            return listaDeProdutos;
    }
}