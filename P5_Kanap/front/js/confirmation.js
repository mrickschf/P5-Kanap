document.addEventListener('DOMContentLoaded', function() {
  const orderNumberElement = document.getElementById('orderId');
  
  // Générer un numéro de commande (ici, je génère un nombre aléatoire à 8 chiffres)
  const orderNumber = generateOrderNumber();
  
  // Afficher le numéro de commande sur la page
  orderNumberElement.textContent = orderNumber;
});

// Fonction pour générer un numéro de commande (exemple avec un nombre aléatoire à 8 chiffres)
function generateOrderNumber() {
  return Math.floor(Math.random() * 90000000) + 10000000;
}

