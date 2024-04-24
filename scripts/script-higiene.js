const galeria = document.querySelector('.galeria');
const botaoBusca = document.querySelector('#botaoBusca');
import { buscarProdutos } from "./script-pesquisa.js";
import { ordenarProdutos } from "./script-ordenar.js";
import { renderizarProdutos } from "./script-renderizar.js";

let produtosHigiene = [];
fetch('/produtos/higiene.json')
    .then(response => response.json())
    .then(data => {
        produtosHigiene = data;
        renderizarProdutos(produtosHigiene, galeria);
    })
    .catch(error => {
        console.log("Erro ao carregar o arquivo .JSON: ", error);
    });


document.getElementById('selectOrdenacao').addEventListener('change', (event) => {
    const valorOrdenacao = event.target.value;
    const listaOrdenada = ordenarProdutos(valorOrdenacao, produtosHigiene);
    renderizarProdutos(listaOrdenada, galeria);
});

renderizarProdutos(produtosHigiene, galeria);

botaoBusca.addEventListener('click', () => {
    const termoBusca = inputBusca.value.trim().toLowerCase();
    buscarProdutos(produtosHigiene, galeria, termoBusca);
});