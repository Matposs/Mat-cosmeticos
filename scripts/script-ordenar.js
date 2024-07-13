import { URL_TESTE, URL_DESENV, URL_PROD } from '../config/config.js';
export async function ordenarProdutos(valorOrdenacao, categoria) {
    const response = await fetch(`${URL_PROD}/ordenar?valorOrdenacao=${valorOrdenacao}&categoria=${categoria}`);
    const produtosOrdenados = await response.json();
    return produtosOrdenados;
}