const galeria = document.querySelector('.galeria');
const botaoBusca = document.querySelector('#botaoBusca');
import { buscarProdutos } from "./script-pesquisa.js";
import { ordenarProdutos } from "./script-ordenar.js";
import { renderizarProdutos } from "./script-renderizar.js";

let produtosMaquiagem = [];
fetch('/produtos/maquiagem.json')
    .then(response => response.json())
    .then(data => {
        produtosMaquiagem = data;
        renderizarProdutos(produtosMaquiagem, galeria);
    })
    .catch(error => {
        console.log("Erro ao carregar o arquivo .JSON: ", error);
    });


document.getElementById('selectOrdenacao').addEventListener('change', (event) => {
    const valorOrdenacao = event.target.value;
    const listaOrdenada = ordenarProdutos(valorOrdenacao, produtosMaquiagem);
    renderizarProdutos(listaOrdenada, galeria);
});

renderizarProdutos(produtosMaquiagem, galeria);

botaoBusca.addEventListener('click', () => {
    const termoBusca = inputBusca.value.trim().toLowerCase();
    buscarProdutos(produtosMaquiagem, galeria, termoBusca);
});