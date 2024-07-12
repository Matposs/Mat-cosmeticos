const galeria = document.querySelector('.galeria');
const botaoBusca = document.querySelector('#botaoBusca');
import { buscarProdutos } from "./script-pesquisa.js";
import { ordenarProdutos } from "./script-ordenar.js";
import { renderizarProdutos } from "./script-renderizar.js";
const { URL_TESTE, URL_DESENV, URL_PROD } = require('../config/config.js');

let produtosMaquiagem = [];
async function carregarProdutos() {
    try {
        const response = await fetch(`${URL_PROD}/produtos/categoria/maquiagem`);
        const data = await response.json();
        produtosMaquiagem = data;
        renderizarProdutos(produtosMaquiagem, galeria);
    } catch (error) {
        console.error("Erro ao carregar os produtos de API: ", error);
    }
}

document.getElementById('selectOrdenacao').addEventListener('change', (event) => {
    const valorOrdenacao = event.target.value;
    const listaOrdenada = ordenarProdutos(valorOrdenacao, produtosMaquiagem);
    renderizarProdutos(listaOrdenada, galeria);
});

botaoBusca.addEventListener('click', () => {
    const termoBusca = inputBusca.value.trim().toLowerCase();
    buscarProdutos(produtosMaquiagem, galeria, termoBusca);
});
document.addEventListener('DOMContentLoaded', carregarProdutos);