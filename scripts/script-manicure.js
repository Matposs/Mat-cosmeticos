const galeria = document.querySelector('.galeria');
const botaoBusca = document.querySelector('#botaoBusca');
import { buscarProdutos } from "./script-pesquisa.js";
import { ordenarProdutos } from "./script-ordenar.js";
import { renderizarProdutos } from "./script-renderizar.js";

let produtosManicure = [];
fetch('/produtos/manicure.json')
    .then(response => response.json())
    .then(data => {
        produtosManicure = data;
        renderizarProdutos(produtosManicure, galeria);
    })
    .catch(error => {
        console.log("Erro ao carregar o arquivo .JSON: ", error);
    });


document.getElementById('selectOrdenacao').addEventListener('change', (event) => {
    const valorOrdenacao = event.target.value;
    const listaOrdenada = ordenarProdutos(valorOrdenacao, produtosManicure);
    renderizarProdutos(listaOrdenada, galeria);
});

renderizarProdutos(produtosManicure, galeria);

botaoBusca.addEventListener('click', () => {
    const termoBusca = inputBusca.value.trim().toLowerCase();
    buscarProdutos(produtosManicure, galeria, termoBusca);
});