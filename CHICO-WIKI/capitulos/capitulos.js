const listaCapitulos = document.getElementById("cards-capitulos");
const search = document.getElementById("search");

fetch("http://localhost:3000/capitulos")
.then(response => response.json())
.then(capitulos =>{

    function renderizarCapitulos(capitulos){
        listaCapitulos.innerHTML = "";
        capitulos.forEach(capitulo => {
            const col = document.createElement("div");
            col.classList.add("col-md-6", "col-sm-12");

            const cardCapitulo = document.createElement("div");
            cardCapitulo.classList.add("componente-card-capitulo", "h-100");

            const numeroCapitulo = document.createElement("h1");
            numeroCapitulo.textContent = capitulo.capitulo;

            const nomeCapitulo = document.createElement("h2");
            nomeCapitulo.textContent = capitulo.titulo;

            const descricaoCapitulo = document.createElement("p");
            descricaoCapitulo.textContent = capitulo.descricao;

            const envolvidosCapitulo = document.createElement("p");
            envolvidosCapitulo.textContent = "Envolvidos: " + capitulo.envolvidos;

            const localCapitulo = document.createElement("p");
            localCapitulo.textContent = "Local: " + capitulo.local;

            cardCapitulo.appendChild(numeroCapitulo);
            cardCapitulo.appendChild(nomeCapitulo);
            cardCapitulo.appendChild(descricaoCapitulo);
            cardCapitulo.appendChild(envolvidosCapitulo);
            cardCapitulo.appendChild(localCapitulo);

            col.appendChild(cardCapitulo);
            listaCapitulos.appendChild(col);
        });
    }

function filtrarCapitulos(){
    const termoPesquisa = search.value.toLowerCase().trim();
    const capitulosFiltrados = capitulos.filter(capitulo =>{
        return capitulo.titulo.toLowerCase().includes(termoPesquisa);
    })
    if (capitulosFiltrados.length === 0) {
        listaCapitulos.innerHTML = "<p class='text-center text-white mt-4'>Nenhum capítulo encontrado.</p>";
    }else {
        renderizarCapitulos(capitulosFiltrados);
    }
    }
    search.addEventListener("input", () => {
         if (search.value === ""){
            renderizarCapitulos(capitulos);
        } else {
            filtrarCapitulos();
         }
    })

    renderizarCapitulos(capitulos)
})
.catch(erro => console.error("Erro:", erro));