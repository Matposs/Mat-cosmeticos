const galeria = document.querySelector('.galeria');
const botaoBusca = document.querySelector('#botaoBusca');
import { buscarProdutos } from "./script-pesquisa.js";
import { ordenarProdutos } from "./script-ordenar.js";
import { renderizarProdutos } from "./script-renderizar.js";
import { URL_TESTE, URL_DESENV, URL_PROD } from '../config/config.js';

let produtosManicure = [];
async function carregarProdutos() {
    try {
        const response = await fetch(`${URL_PROD}/produtos/categoria/manicure`);
        const data = await response.json();
        produtosManicure = data;
        renderizarProdutos(produtosManicure, galeria);
    } catch (error) {
        console.error("Erro ao carregar os produtos de API: ", error);
    }
}


document.getElementById('selectOrdenacao').addEventListener('change', (event) => {
    const valorOrdenacao = event.target.value;
    const listaOrdenada = ordenarProdutos(valorOrdenacao, "manicure");
    renderizarProdutos(listaOrdenada, galeria);
});

botaoBusca.addEventListener('click', () => {
    const termoBusca = inputBusca.value.trim().toLowerCase();
    buscarProdutos(produtosManicure, galeria, termoBusca);
});
document.addEventListener('DOMContentLoaded', carregarProdutos);