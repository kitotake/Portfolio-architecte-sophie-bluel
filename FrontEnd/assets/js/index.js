const btnAll = document.querySelector(".filter__btn-id-null");
const btnId1 = document.querySelector(".filter__btn-id-1");
const btnId2 = document.querySelector(".filter__btn-id-2");
const btnId3 = document.querySelector(".filter__btn-id-3");

const sectionProjets = document.querySelector(".gallery"); 

let data = null;
let id;
generationProjets(data, null);

function resetSectionProjets() {  
	sectionProjets.innerHTML = "";
}

async function generationProjets(data, id) { 
    try {
        const response = await fetch('http://localhost:5678/api/works'); 
        data = await response.json();
    }
    catch{
        const p = document.createElement("p");
        p.classList.add("error");
        p.innerHTML = "Une erreur est survenue lors de la récupération des projets<br><br>Une tentative de reconnexion automatique auras lieu dans une minute<br><br><br><br>Si le problème persiste, veuillez contacter l'administrateur du site";
        sectionProjets.appendChild(p);
        await new Promise(resolve => setTimeout(resolve, 60000));
        window.location.href = "../index.html";
    }

    resetSectionProjets()

    if ([1, 2, 3].includes(id)) {
        data = data.filter(data => data.categoryId == id);}

    document.querySelectorAll(".filter__btn").forEach(btn => {
        btn.classList.remove("filter__btn--active");})
    document.querySelector(`.filter__btn-id-${id}`).classList.add("filter__btn--active");

    if (data.length === 0 || data === undefined) { 
        const p = document.createElement("p");
        p.classList.add("error");
        p.innerHTML = "Aucun projet à afficher <br><br>Toutes nos excuses pour la gêne occasionnée";
        sectionProjets.appendChild(p);
        return;}

    if (id === null || [1, 2, 3].includes(id)) {
        for (let i = 0; i < data.length; i++) {
            
            const figure = document.createElement("figure"); 
            sectionProjets.appendChild(figure);
            figure.classList.add(`js-projet-${data[i].id}`);
            const img = document.createElement("img");
            img.src = data[i].imageUrl;
            img.alt = data[i].title;
            figure.appendChild(img);

            const figcaption = document.createElement("figcaption");
            figcaption.innerHTML = data[i].title;
            figure.appendChild(figcaption);
        }
}}

btnAll.addEventListener("click", () => { generationProjets(data, null);})
btnId1.addEventListener("click", () => { generationProjets(data, 1);})
btnId2.addEventListener("click", () => { generationProjets(data, 2);})
btnId3.addEventListener("click", () => { generationProjets(data, 3);})

function resetmodaleSectionProjets() {  
	modaleSectionProjets.innerHTML = "";
}

let modale = null;
let dataAdmin;
const modaleSectionProjets = document.querySelector(".js-admin-projets"); 

const openModale = function(e) {
    e.preventDefault()
    modale = document.querySelector(e.target.getAttribute("href"))

    modaleProjets(); 
    setTimeout(() => {
        modale.style.display = null
        modale.removeAttribute("aria-hidden")
        modale.setAttribute("aria-modal", "true")
    }, 25);
    document.querySelectorAll(".js-modale-projet").forEach(a => {
        a.addEventListener("click", openModaleProjet)});

    modale.addEventListener("click", closeModale)
    modale.querySelector(".js-modale-close").addEventListener("click", closeModale)
    modale.querySelector(".js-modale-stop").addEventListener("click", stopPropagation)

};

async function modaleProjets() { 
    const response = await fetch('http://localhost:5678/api/works'); 
    dataAdmin = await response.json();
    resetmodaleSectionProjets()
    for (let i = 0; i < dataAdmin.length; i++) {
        
        const div = document.createElement("div");
        div.classList.add("gallery__item-modale");
        modaleSectionProjets.appendChild(div);

        const img = document.createElement("img");
        img.src = dataAdmin[i].imageUrl;
        img.alt = dataAdmin[i].title;
        div.appendChild(img);

        const p = document.createElement("p");
        div.appendChild(p);
        p.classList.add(dataAdmin[i].id, "js-delete-work");


        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can"); 
        p.appendChild(icon);

        const a = document.createElement("a");
        a.innerHTML = "Éditer";
        div.appendChild(a);
    }
    deleteWork()
}


const closeModale = function(e) {
    e.preventDefault()
    if (modale === null) return

    
    modale.setAttribute("aria-hidden", "true")
    modale.removeAttribute("aria-modal")

    modale.querySelector(".js-modale-close").removeEventListener("click", closeModale)

    window.setTimeout(function() {
        modale.style.display = "none"
        modale = null
        resetmodaleSectionProjets()
    }, 300)
};


const stopPropagation = function(e) {
    e.stopPropagation()
};
document.querySelectorAll(".js-modale").forEach(a => {
    a.addEventListener("click", openModale)
});
window.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModale(e)
        closeModaleProjet(e)}
});


const token = localStorage.getItem("token");
const AlredyLogged = document.querySelector(".js-alredy-logged");

adminPanel()
function adminPanel() {
    document.querySelectorAll(".admin__modifer").forEach(a => {
        if (token === null) {
            return;
        }
        else {
            a.removeAttribute("aria-hidden")
            a.removeAttribute("style")
            AlredyLogged.innerHTML = "deconnexion";
        }
    });
}
function deleteWork() {
    let btnDelete = document.querySelectorAll(".js-delete-work");
    for (let i = 0; i < btnDelete.length; i++) {
        btnDelete[i].addEventListener("click", deleteProjets);
    }}

async function deleteProjets() {

    console.log("DEBUG DEBUT DE FUNCTION SUPRESSION")
    console.log(this.classList[0])
    console.log(token)

    await fetch(`http://localhost:5678/api/works/${this.classList[0]}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
    })

    .then (response => {
        console.log(response)
        if (response.status === 204) {
            console.log("DEBUG SUPPRESION DU PROJET " + this.classList[0])
            refreshPage(this.classList[0])
        }
        else if (response.status === 401) {
            alert("Vous n'êtes pas autorisé à supprimer ce projet, merci de vous connecter avec un compte valide")
            window.location.href = "login.html";
        }
    })
    .catch (error => {
        console.log(error)
    })
}

async function refreshPage(i){
    modaleProjets();

    const projet = document.querySelector(`.js-projet-${i}`);
    projet.style.display = "none";
}


let modaleProjet = null;
const openModaleProjet = function(e) {
    e.preventDefault()
    modaleProjet = document.querySelector(e.target.getAttribute("href"))

    modaleProjet.style.display = null
    modaleProjet.removeAttribute("aria-hidden")
    modaleProjet.setAttribute("aria-modal", "true")

    modaleProjet.addEventListener("click", closeModaleProjet)
    modaleProjet.querySelector(".js-modale-close").addEventListener("click", closeModaleProjet)
    modaleProjet.querySelector(".js-modale-stop").addEventListener("click", stopPropagation)

    modaleProjet.querySelector(".js-modale-return").addEventListener("click", backToModale)
};

const closeModaleProjet = function(e) {
    if (modaleProjet === null) return

    modaleProjet.setAttribute("aria-hidden", "true")
    modaleProjet.removeAttribute("aria-modal")

    modaleProjet.querySelector(".js-modale-close").removeEventListener("click", closeModaleProjet)
    modaleProjet.querySelector(".js-modale-stop").removeEventListener("click", stopPropagation)

    modaleProjet.style.display = "none"
    modaleProjet = null
    
    closeModale(e)
};

const backToModale = function(e) {
    e.preventDefault()
    modaleProjet.style.display = "none"
    modaleProjet = null
    modaleProjets(dataAdmin)
};



const btnAjouterProjet = document.querySelector(".js-add-work");
btnAjouterProjet.addEventListener("click", addWork);

async function addWork(event) {
    event.preventDefault();

    const title = document.querySelector(".js-title").value;
    const categoryId = document.querySelector(".js-categoryId").value;
    const image = document.querySelector(".js-image").files[0];


    if (title === "" || categoryId === "" || image === undefined) {
        alert("Merci de remplir tous les champs");
        return;
    } else if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
        alert("Merci de choisir une catégorie valide");
        return;
        } else {
    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", categoryId);
        formData.append("image", image);

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.status === 201) {
            alert("Projet ajouté avec succès :)");
            modaleProjets(dataAdmin);
            backToModale(event);
            generationProjets(data, null);
            
        } else if (response.status === 400) {
            alert("Merci de remplir tous les champs");
        } else if (response.status === 500) {
            alert("Erreur serveur");
        } else if (response.status === 401) {
            alert("Vous n'êtes pas autorisé à ajouter un projet");
            window.location.href = "login.html";
    }}

    catch (error) {
        console.log(error);
}}}