const option = {
    animation: true,
    delay: 5000
}

function toast() {
    const toast = document.querySelector('.toast')
    const t = new bootstrap.Toast(toast, option)
    t.show()
}