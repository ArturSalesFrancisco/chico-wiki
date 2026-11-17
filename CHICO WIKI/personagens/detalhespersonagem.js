const params = new URLSearchParams(window.location.search);
const idPersonagem = Number(params.get("id"));

fetch("http://localhost:3000/personagens")
.then(response => response.json())
.then(dadosPersonagem => {
    console.log("id buscado:", idPersonagem);
    console.log("personagens:", dadosPersonagem);
    const personagem = dadosPersonagem.find(p => String(p.id) === String(idPersonagem));


    console.log("personagem encontrado:", personagem);          
    const nome = document.getElementById("nome");
    nome.textContent = personagem.nome

    const imagem = document.getElementById("imagem");
    imagem.src = `../img/${personagem.imagem}`;
    imagem.alt = personagem.nome;

    const pseudonimo = document.getElementById("pseudonimo");
    pseudonimo.textContent = personagem.pseudonimo

    const idade = document.getElementById("idade");
    idade.textContent = personagem.idade;

    const estado = document.getElementById("estado");
    estado.textContent = personagem.estado;

    const ocupacao = document.getElementById("ocupacao");
    ocupacao.textContent = personagem.ocupacao;
    
    const origem = document.getElementById("origem");
    origem.textContent = personagem.local_origem

    const especie = document.getElementById("especie");
    especie.textContent = personagem.raca;

    const genero = document.getElementById("genero");
    genero.textContent = personagem.genero

    const descricao = document.getElementById("descricao");
    descricao.textContent = personagem.descricao
})
.catch(erro => console.error("Erro:", erro));