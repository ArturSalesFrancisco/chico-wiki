const usuarioLogado = JSON.parse(
    sessionStorage.getItem("usuarioLogado")
);

if (!usuarioLogado || !usuarioLogado.adm) {
    alert("Acesso negado!");
    window.location.href = "../index.html";
}

const seletor = document.getElementById("tipo-cadastro");
const areaFormulario = document.getElementById("area-formulario")
const listaItens = document.getElementById("lista-itens")
listaItens.style.display = "none"
let personagemEditando = null;
let capituloEditando = null;

function mostrarFormularioPersonagem(){
    areaFormulario.innerHTML = `
        <h2>NOVO PERSONAGEM</h2>
        <form id="form-personagem" class="form-grid">
            <input id="nome-personagem" placeholder="Nome: ">
            <input id="pseudonimo-personagem" placeholder="Pseudonimo: ">
            <input id="idade-personagem" placeholder="Idade: ">
            <input id="estado-personagem" placeholder="Estado: ">
            <textarea id="descricao-personagem" placeholder="Descrição: "></textarea>
            <input id="ocupacao-personagem" placeholder="Ocupação: ">
            <input id="origem-personagem" placeholder="Local de origem: ">
            <input id="especie-personagem" placeholder="Raça: ">
            <input id="genero-personagem" placeholder="Gênero: ">
            <button type="submit" id="salvar-personagem" class="btn-cadastrar-adm">CADASTRAR</button>
        </form>
        `;

        const btnSalvarPersonagem = document.getElementById("salvar-personagem");

        btnSalvarPersonagem.addEventListener("click", cadastrarPersonagem);
    }

function cadastrarPersonagem(event) {

    event.preventDefault();
    const nomePersonagem = document.getElementById("nome-personagem").value.trim();
    const pseudonimoPersonagem = document.getElementById("pseudonimo-personagem").value.trim();
    const idadePersonagem = Number(document.getElementById("idade-personagem").value);
    const estadoPersonagem = document.getElementById("estado-personagem").value.trim();
    const descricaoPersonagem = document.getElementById("descricao-personagem").value.trim();
    const ocupacaoPersonagem = document.getElementById("ocupacao-personagem").value.trim().split(",").map(item => item.trim());
    const origemPersonagem = document.getElementById("origem-personagem").value.trim().split(",").map(item => item.trim());
    const racaPersonagem = document.getElementById("especie-personagem").value.trim();
    const generoPersonagem = document.getElementById("genero-personagem").value.trim();

    const novoPersonagem = {
    nome: nomePersonagem,
    pseudonimo: pseudonimoPersonagem,
    idade: idadePersonagem,
    estado: estadoPersonagem,
    imagem: "../img/default.jpg",
    descricao: descricaoPersonagem,
    ocupacao: ocupacaoPersonagem,
    local_origem: origemPersonagem,
    raca: racaPersonagem,
    genero: generoPersonagem
};

    if (personagemEditando) {

    fetch(
        `http://localhost:3000/personagens/${personagemEditando}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoPersonagem)
        }
    )
    .then(res => res.json())
    .then(() => {

        alert("Personagem atualizado!");

        personagemEditando = null;

        document.getElementById(
            "salvar-personagem"
        ).textContent = "Cadastrar";

        document.getElementById(
            "form-personagem"
        ).reset();

        carregarPersonagens();
    });

} else {

    fetch("http://localhost:3000/personagens", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novoPersonagem)
    })
    .then(res => res.json())
    .then(() => {

        alert("Personagem cadastrado!");

        document.getElementById(
            "form-personagem"
        ).reset();

        carregarPersonagens();
    });

}
}

function carregarPersonagens(){
    const listaPersonagens = document.getElementById("lista-itens");
    fetch("http://localhost:3000/personagens")
    .then(res => res.json())
    .then(personagens => {
        listaPersonagens.innerHTML =`
        <h2>PERSONAGENS CADASTRADOS</h2>
        `;

        const divListaPersonagens = document.createElement("div");
        listaPersonagens.appendChild(divListaPersonagens);
        divListaPersonagens.classList.add("lista-grid")

        personagens.forEach(personagem => {
            const divPersonagem = document.createElement("div");
            divPersonagem.classList.add("div-crud")
            divPersonagem.innerHTML =`
            <strong>${personagem.nome}</strong>
            <button class="btn-editar">Editar</button>
            <button class="btn-excluir">Excluir</button>
            `;

            const btnExcluir = divPersonagem.querySelector(".btn-excluir");
            btnExcluir.addEventListener("click", () => {
                if (!confirm("Deseja excluir?")) {
                    return;
                }

                fetch(`http://localhost:3000/personagens/${personagem.id}`,{
                        method: "DELETE"
                    })
                .then(() => {
                    alert("Personagem removido!");
                    carregarPersonagens();
                });
            });
            const btnEditar = divPersonagem.querySelector(".btn-editar");
            btnEditar.addEventListener("click", () => {
                personagemEditando = personagem.id;
                document.getElementById("nome-personagem").value = personagem.nome;
                document.getElementById("pseudonimo-personagem").value = personagem.pseudonimo;
                document.getElementById("idade-personagem").value = personagem.idade;
                document.getElementById("estado-personagem").value = personagem.estado;
                document.getElementById("descricao-personagem").value = personagem.descricao;
                document.getElementById("ocupacao-personagem").value = personagem.ocupacao.join(", ");
                document.getElementById("origem-personagem").value = personagem.local_origem.join(", ");
                document.getElementById("especie-personagem").value = personagem.raca;
                document.getElementById("genero-personagem").value = personagem.genero;
                document.getElementById("salvar-personagem").textContent = "Salvar Alterações";
            });

            divListaPersonagens.appendChild(divPersonagem)

        });
}
)}

function mostrarFormularioCapitulo(){
    areaFormulario.innerHTML = `
    <h2>NOVO CAPÍTULO</h2>
    <form id="form-capitulo" class="form-grid">
        <input id="numeracao-capitulo" placeholder="Numeração: ">
        <input id="titulo-capitulo" placeholder="Título: ">
        <textarea id="descricao-capitulo" placeholder="Descrição: "></textarea>
        <input id="envolvidos-capitulo" placeholder="Envolvidos: ">
        <input id="local-capitulo" placeholder="Local: ">
        <button type="submit" id="salvar-capitulo" class="btn-cadastrar-adm">CADASTRAR</button>
    </form>
    `;

    const btnSalvarCapitulo = document.getElementById("salvar-capitulo");

    btnSalvarCapitulo.addEventListener("click", cadastrarCapitulo);
}

function carregarCapitulos(){
    const listaCapitulos = document.getElementById("lista-itens");
    fetch("http://localhost:3000/capitulos")
    .then(res => res.json())
    .then(capitulos => {
        listaCapitulos.innerHTML =`
        <h2>CAPÍTULOS CADASTRADOS</h2>
        `;

        const divListaCapitulos = document.createElement("div");
        listaCapitulos.appendChild(divListaCapitulos);
        divListaCapitulos.classList.add("lista-grid")


        capitulos.forEach(capitulo => {
            const divCapitulo = document.createElement("div");
            divCapitulo.classList.add("div-crud")
            divCapitulo.innerHTML =`
            <strong>${capitulo.titulo}</strong>
            <button class="btn-editar">Editar</button>
            <button class="btn-excluir">Excluir</button>
            `;

            const btnExcluir = divCapitulo.querySelector(".btn-excluir");
            btnExcluir.addEventListener("click", () => {
                if (!confirm("Deseja excluir?")) {
                    return;
                }

                fetch(`http://localhost:3000/capitulos/${capitulo.id}`,{
                        method: "DELETE"
                    })
                .then(() => {
                    alert("Capítulo removido!");
                    carregarCapitulos();
                });
            });

            const btnEditar = divCapitulo.querySelector(".btn-editar");
            btnEditar.addEventListener("click", () => {
                capituloEditando = capitulo.id
                document.getElementById("numeracao-capitulo").value = capitulo.capitulo;
                document.getElementById("titulo-capitulo").value = capitulo.titulo;
                document.getElementById("descricao-capitulo").value = capitulo.descricao;
                document.getElementById("envolvidos-capitulo").value = capitulo.envolvidos.join(", ");
                document.getElementById("local-capitulo").value = capitulo.local;
                document.getElementById("salvar-capitulo").textContent = "Salvar Alterações";
            })

            divListaCapitulos.appendChild(divCapitulo);

        });
}
)}

function cadastrarCapitulo(event){
    event.preventDefault();
    const numeracaoCapitulo = document.getElementById("numeracao-capitulo").value.trim();
    const tituloCapitulo = document.getElementById("titulo-capitulo").value.trim();
    const descricaoCapitulo = document.getElementById("descricao-capitulo").value.trim();
    const envolvidosCapitulo = document.getElementById("envolvidos-capitulo").value.trim().split(",").map(item => item.trim());
    const localCapitulo = document.getElementById("local-capitulo").value.trim();

    const novoCapitulo = {
        capitulo: numeracaoCapitulo,
        titulo: tituloCapitulo,
        descricao: descricaoCapitulo,
        envolvidos: envolvidosCapitulo,
        local: localCapitulo
    };

    if (capituloEditando) {

    fetch(`http://localhost:3000/capitulos/${capituloEditando}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoCapitulo)
        }
    )
    .then(res => res.json())
    .then(() => {
        alert("Capítulo atualizado!");
        capituloEditando = null;

        document.getElementById("salvar-capitulo").textContent = "Cadastrar";
        document.getElementById("form-capitulo").reset();

        carregarCapitulos();
    });

} else {

    fetch("http://localhost:3000/capitulos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novoCapitulo)
    })
    .then(res => res.json())
    .then(() => {
        alert("Capítulo cadastrado!");
        document.getElementById("form-capitulo").reset();
        carregarCapitulos();
    });
}
}

function mostrarMensagemInicial() {
    areaFormulario.innerHTML = `
        <p class="mensagem-seletor">SELECIONE UM TIPO DE CADASTRO</p>
    `;
}

seletor.addEventListener("change", () => {

    if (!seletor.value || seletor.value === "selecione") {

        mostrarMensagemInicial();
        listaItens.style.display = "none";
        return;
    }

    listaItens.style.display = "block";

    if (seletor.value === "personagens") {
        mostrarFormularioPersonagem();
        carregarPersonagens();
    }

    if (seletor.value === "capitulos") {
        mostrarFormularioCapitulo();
        carregarCapitulos();
    }
});

mostrarMensagemInicial();