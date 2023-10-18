document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const orderNumberElement = document.getElementById('orderNumber');

    if (orderId) {
        orderNumberElement.textContent = orderId;
    } else {
        orderNumberElement.textContent = "Numéro de commande non disponible";
    }
});
