function editFormArticle(currentBtn) {
    currentBtn.style.setProperty("display", "none", "important")
    document.getElementById('title').removeAttribute('readonly') 
    document.getElementById('description').removeAttribute('readonly')
    document.getElementById('title').focus()
    document.getElementById('btnEditArticle').style.display = "block"
}