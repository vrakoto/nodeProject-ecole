/* SCRIPT POUR LA PAGE USER */

const formArticle = document.getElementById('formArticle')
const btnTextToggleFormArticle = document.getElementById('btnToggleFormArticle')

const articlesAssocies = document.getElementById('articlesAssocies')
const btnTextArticlesAssocies = document.getElementById('btnToggleArticlesAssocies')


/* -------------------------------------------Form Article------------------------------------------- */
if (localStorage.getItem('articleForm') === "keep") {
    formArticle.classList.toggle('toggle')
    document.getElementById('title').focus()
    btnTextToggleFormArticle.textContent = "Masquer le formulaire"
} else {
    btnTextToggleFormArticle.textContent = "Ajouter un article"
}

/**
 * Affiche / masque le formulaire pour ajouter un article
 * 
 * @returns void
 */
function toggleArticleForm() {
    if (!localStorage.getItem('articleForm')) {
        localStorage.setItem('articleForm', "keep")
        formArticle.classList.toggle('toggle')
        document.getElementById('title').focus()
        btnTextToggleFormArticle.textContent = "Cacher le formulaire"
    } else {
        localStorage.removeItem('articleForm')
        formArticle.classList.remove('toggle')
        btnTextToggleFormArticle.textContent = "Ajouter un article"
    }
}


/* -------------------------------------------Articles associés------------------------------------------- */
if (localStorage.getItem('articlesAssocies') === "keep") {
    articlesAssocies.classList.toggle('toggle')
    btnTextArticlesAssocies.textContent = "Masquer les articles"
} else {
    btnTextArticlesAssocies.textContent = "Afficher les articles associés"
}

/**
 * Affiche / masque les articles associés de l'user
 * 
 * @returns void
 */
function toggleArticlesAssocies() {
    if (!localStorage.getItem('articlesAssocies')) {
        localStorage.setItem('articlesAssocies', "keep")
        articlesAssocies.classList.toggle('toggle')
        btnTextArticlesAssocies.textContent = "Masquer les articles"
    } else {
        localStorage.removeItem('articlesAssocies')
        articlesAssocies.classList.remove('toggle')
        btnTextArticlesAssocies.textContent = "Afficher les articles associés"
    } 
}