const listaPersonagens = document.getElementById("cards-personagens");
const search = document.getElementById("search");
const btnFavoritos = document.getElementById("filtro-favoritos");
let mostrandoFavoritos = false;

const usuarioLogado = JSON.parse(
    sessionStorage.getItem("usuarioLogado")
);

fetch("http://localhost:3000/personagens")
.then(response => response.json())
.then(personagens =>{

    function gerarGraficosPizza(canvasId, contagem){
        const grafico = document.getElementById(canvasId).getContext("2d");
        new Chart(grafico, {
            type: "pie",
            data: {
                labels: Object.keys(contagem),
                datasets: [{
                    data: Object.values(contagem),
                    backgroundColor: [
                        "#ff0037", "#0099ff", "#ffb700","#25d557", "#7134eb", "#f72560", "#11ff00"
                    ],
                    borderColor: "#000000",
                    borderWidth: 3
                }]
            },
            options: {
                plugins: {
                    legend: {position: "bottom", labels: {color: "white"}}
                }
            }
        });
    }

    const contagemEspecie = {};
    personagens.forEach(personagem => {
        contagemEspecie[personagem.raca] = (contagemEspecie[personagem.raca] || 0) + 1;
    })
    gerarGraficosPizza("graficoPorRaca", contagemEspecie);

    const contagemOrigem = {};
    personagens.forEach(personagem => {
        const locaisOrigem = Array.isArray(personagem.local_origem) ? personagem.local_origem : [personagem.local_origem];
        locaisOrigem.forEach(local => {
            const localLimpo = local.trim();
            contagemOrigem[localLimpo] = (contagemOrigem[localLimpo] || 0) + 1;
        });
    });
    gerarGraficosPizza("graficoPorOrigem", contagemOrigem);

    const faixas = {
        "1-10 anos": 0,
        "11-20 anos": 0,
        "21-40 anos": 0,
        "41-60 anos": 0,
        "61+ anos": 0
    };
    personagens.forEach(personagem => {
        const idade = personagem.idade;
        if (idade <= 10) faixas["1-10 anos"]++;
        else if (idade <= 20) faixas["11-20 anos"]++;
        else if (idade <= 40) faixas["21-40 anos"]++;
        else if (idade <= 60) faixas["41-60 anos"]++;
        else faixas["61+ anos"]++;
    });
    const faixasFiltradas = Object.fromEntries(
        Object.entries(faixas).filter(([, v]) => v > 0)
    );
    gerarGraficosPizza("graficoPorIdade", faixasFiltradas);

    function renderizarPersonagens(personagens){
        listaPersonagens.innerHTML = "";
        personagens.forEach(personagem => {
            const col = document.createElement("div");
            col.classList.add("col-md-3", "col-sm-4", "col-6")

            const cardPersonagem = document.createElement("div");
            cardPersonagem.classList.add("componente-card-personagem", "h-100");

            cardPersonagem.style.cursor = "pointer";
            cardPersonagem.addEventListener("click", () => {
            window.location.href = `detalhespersonagem.html?id=${personagem.id}`;
            });

            const faixaNome = document.createElement("div");
            faixaNome.classList.add("faixa-nome");

            const favorito = document.createElement("button");
            favorito.innerHTML = "☆";
            favorito.classList.add("btn-favorito");
            faixaNome.appendChild(favorito);

            const meusFavoritos =
                usuarioLogado &&
                usuarioLogado.favoritos &&
                usuarioLogado.favoritos.includes(personagem.id);

            favorito.innerHTML = meusFavoritos ? "★" : "☆";

            let favoritado = false

            favorito.addEventListener("click", (event) => {
                event.stopPropagation();

                if (!usuarioLogado) {
                    alert("Faça login para favoritar!");
                    return;
                }

                if (!usuarioLogado.favoritos) {
                    usuarioLogado.favoritos = [];
                }

                const jaExiste =
                    usuarioLogado.favoritos.includes(personagem.id);

                if (jaExiste) {

                    usuarioLogado.favoritos =
                        usuarioLogado.favoritos.filter(
                            id => id !== personagem.id
                        );

                    favorito.innerHTML = "☆";

                } else {

                    usuarioLogado.favoritos.push(personagem.id);

                    favorito.innerHTML = "★";
                }

                sessionStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify(usuarioLogado)
                );
                fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        favoritos: usuarioLogado.favoritos
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log("Favoritos atualizados!");
                })
                .catch(err => {
                    console.error(err);
                });
            });

            const nomePersonagem = document.createElement("h2");
            nomePersonagem.textContent = personagem.nome;
            faixaNome.appendChild(nomePersonagem);

            const imagem = document.createElement("img");
            imagem.src = `../img/${personagem.imagem}`;
            imagem.alt = personagem.nome;
            imagem.classList.add("img-fluid");

            cardPersonagem.appendChild(imagem);
            cardPersonagem.appendChild(faixaNome);
            col.appendChild(cardPersonagem);
            listaPersonagens.appendChild(col);
            
        });
    }
    
    function filtrarFavoritos() {
    if (!usuarioLogado) {
        alert("Faça login para usar favoritos!");
        return;
    }

    const favoritos = usuarioLogado.favoritos || [];
    const personagensFavoritos = personagens.filter(personagem =>
        favoritos.includes(personagem.id)
    );

    renderizarPersonagens(personagensFavoritos);
    }

    function filtrarPersonagens() {
        const termoPesquisa = search.value.toLowerCase().trim();
        const personagensFiltrados = personagens.filter( personagem => {
            return personagem.nome.toLowerCase().includes(termoPesquisa);
        })
        if (personagensFiltrados.length === 0) {
            listaPersonagens.innerHTML = "<p class='text-center text-white mt-4'>Nenhum personagem encontrado.</p>";
        } else {
            renderizarPersonagens(personagensFiltrados);
        }
        }
    search.addEventListener("input", () => {
         if (search.value === ""){
            renderizarPersonagens(personagens);
        } else {
            filtrarPersonagens();
         }
    })
    btnFavoritos.addEventListener("click", () => {
    mostrandoFavoritos = !mostrandoFavoritos;

    if (mostrandoFavoritos) {
        filtrarFavoritos();
        btnFavoritos.textContent = "Mostrar Todos";
    } else {
        renderizarPersonagens(personagens);
        btnFavoritos.textContent = "Mostrar Favoritos";
    }
    });

    renderizarPersonagens(personagens);
})

.catch(erro => console.error("Erro:", erro));