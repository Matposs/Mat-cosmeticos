const galeria = document.querySelector('.galeria');
const botaoBusca = document.querySelector('#botaoBusca');
import { buscarProdutos } from "./script-pesquisa.js";
import { ordenarProdutos } from "./script-ordenar.js";
import { renderizarProdutos } from "./script-renderizar.js";

let produtosCabelo = [];
fetch('/produtos/cabelo.json')
    .then(response => response.json())
    .then(data => {
        produtosCabelo = data;
        renderizarProdutos(produtosCabelo, galeria);
    })
    .catch(error => {
        console.log("Erro ao carregar o arquivo .JSON: ", error);
    });


document.getElementById('selectOrdenacao').addEventListener('change', (event) => {
    const valorOrdenacao = event.target.value;
    const listaOrdenada = ordenarProdutos(valorOrdenacao, produtosCabelo);
    renderizarProdutos(listaOrdenada, galeria);
});

renderizarProdutos(produtosCabelo, galeria);

botaoBusca.addEventListener('click', () => {
    const termoBusca = inputBusca.value.trim().toLowerCase();
    buscarProdutos(produtosCabelo, galeria, termoBusca);
});