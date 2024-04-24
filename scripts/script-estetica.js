import { renderizarProdutos } from "./script-renderizar.js";
import { buscarProdutos } from "./script-pesquisa.js";
import { ordenarProdutos } from "./script-ordenar.js";
const galeria = document.querySelector('.galeria');
const botaoBusca = document.querySelector('#botaoBusca');

let produtosEstetica = [];
fetch('/produtos/estetica.json')
    .then(response => response.json())
    .then(data => {
        produtosEstetica = data;
        renderizarProdutos(produtosEstetica, galeria);
    })
    .catch(error => {
        console.log("Erro ao carregar o arquivo .JSON: ", error);
    });

document.getElementById('selectOrdenacao').addEventListener('change', (event) => {
    const valorOrdenacao = event.target.value;
    const listaOrdenada = ordenarProdutos(valorOrdenacao, produtosEstetica);
    renderizarProdutos(listaOrdenada, galeria);
});


renderizarProdutos(produtosEstetica, galeria);

botaoBusca.addEventListener('click', () => {
    const termoBusca = inputBusca.value.trim().toLowerCase();
    buscarProdutos(produtosEstetica, galeria, termoBusca);
});