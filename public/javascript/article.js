function editFormArticle(currentBtn) {
    currentBtn.style.display = "none"
    document.getElementById('title').removeAttribute('readonly') 
    document.getElementById('description').removeAttribute('readonly')
    document.getElementById('title').focus()
    document.getElementById('btnEditArticle').style.display = "block"
}