import { renderizarProdutos } from "./script-renderizar.js";
import { buscarProdutos } from "./script-pesquisa.js";
import { ordenarProdutos } from "./script-ordenar.js";
const galeria = document.querySelector('.galeria');
const botaoBusca = document.querySelector('#botaoBusca');
import { URL_TESTE, URL_DESENV, URL_PROD } from '../config/config.js';

let produtosEstetica = [];
async function carregarProdutos() {
    try {
        const response = await fetch(`${URL_PROD}/produtos/categoria/estetica`);
        const data = await response.json();
        produtosEstetica = data;
        renderizarProdutos(produtosEstetica, galeria);
    } catch (error) {
        console.error("Erro ao carregar os produtos de API: ", error);
    }
}

document.getElementById('selectOrdenacao').addEventListener('change', async (event) => {
    const valorOrdenacao = event.target.value;
    const listaOrdenada = await ordenarProdutos(valorOrdenacao, "estetica");
    renderizarProdutos(listaOrdenada, galeria);
});

botaoBusca.addEventListener('click', () => {
    const termoBusca = inputBusca.value.trim().toLowerCase();
    buscarProdutos(produtosEstetica, galeria, termoBusca);
});

document.addEventListener('DOMContentLoaded', carregarProdutos);