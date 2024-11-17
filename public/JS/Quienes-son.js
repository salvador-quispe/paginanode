function toggleDetail(detailId, button) {
    const detailText = document.getElementById(detailId);
    if (detailText.style.display === "none" || detailText.style.display === "") {
        detailText.style.display = "inline"; // Mostrar texto adicional
        button.textContent = "Ver menos"; // Cambiar texto del botón
    } else {
        detailText.style.display = "none"; // Ocultar texto adicional
        button.textContent = "Ver más"; // Cambiar texto del botón
    }
}
