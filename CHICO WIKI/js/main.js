const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const btnUsuario = document.getElementById("btn-usuario");
if(usuarioLogado){
    btnUsuario.textContent = "Logout";
}
else{
    btnUsuario.textContent = "Login";
}
const btnAdmin = document.getElementById("btn-admin");
if (!usuarioLogado || !usuarioLogado.adm){
    btnAdmin.style.display = "none";
}

btnUsuario.addEventListener("click", () => {

    if(usuarioLogado){

        sessionStorage.removeItem("usuarioLogado");

        window.location.reload();

    }else{

        window.location.href = "../login/login.html";

    }

});

const listaSecoes = document.getElementById("cards-secoes");
const search = document.getElementById("search");
const carrossel = document.getElementById("carouselExample")
const introducao = document.getElementById("sinopse")

fetch("http://localhost:3000/secoes")
.then(response => response.json())
.then(secoes =>{

    function renderizarSecoes(secoes){
        listaSecoes.innerHTML = "";
        secoes.forEach(secao => {
            const col = document.createElement("div");
            col.classList.add("col-md-4", "col-sm-6", "col-12")

            const cardSecao = document.createElement("div");
            cardSecao.classList.add("componente-card-secao");

            cardSecao.style.cursor = "pointer";
            cardSecao.addEventListener("click", () => {
            window.location.href = secao.link;
            });

            const nome = document.createElement("h2");
            nome.textContent = secao.nome_secao;

            cardSecao.style.backgroundImage = `url(../img/${secao.imagem})`;
            cardSecao.style.backgroundPosition = "center";
            cardSecao.style.backgroundSize = "cover";

            cardSecao.appendChild(nome)

            col.appendChild(cardSecao);
            listaSecoes.appendChild(col);
            
        });
    }

function filtrarSecoes(){
    const termoPesquisa = search.value.toLowerCase().trim();
    const secoesFiltradas = secoes.filter(secao => {
        return secao.nome_secao.toLowerCase().includes(termoPesquisa);
    });
    if (secoesFiltradas.length === 0) {
    listaSecoes.innerHTML = "<p class='text-center text-white mt-4'>Nenhuma seção encontrada.</p>";
    } else {
    renderizarSecoes(secoesFiltradas);
    }
    }
    search.addEventListener("input", () => {
         if (search.value === ""){
            renderizarSecoes(secoes);
            carrossel.style.display = "block";
            introducao.style.display = "block"
        } else {
            filtrarSecoes();
            carrossel.style.display = "none"
            introducao.style.display = "none"
         }
    })
    renderizarSecoes(secoes);
    })
    .catch(erro => console.error("Erro:", erro));