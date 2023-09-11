document.addEventListener('DOMContentLoaded', function() {
   // Récupérez le formulaire une fois que le document est chargé
   const orderForm = document.querySelector('.cart__order__form');
 // Sélectionnez l'élément où vous afficherez les produits du panier
 const cartItemsSection = document.getElementById('cart__items');
 const totalQuantityElement = document.getElementById('totalQuantity');
 const totalPriceElement = document.getElementById('totalPrice');
 
 // Récupérez le panier depuis le localStorage
 let cart = JSON.parse(localStorage.getItem('cart')) || [];
 
 // Fonction pour supprimer un modèle du panier
 function removeModelFromCart(productId, color) {
   const cartItemsToRemove = cart.filter(item => item.product.productId === productId && item.color === color);
   if (cartItemsToRemove.length > 0) {
     const indexesToRemove = cartItemsToRemove.map(itemToRemove => cart.indexOf(itemToRemove));
     indexesToRemove.sort((a, b) => b - a); // Triez les index en ordre décroissant pour éviter les erreurs d'index
     indexesToRemove.forEach(index => {
       cart.splice(index, 1);
     });
     localStorage.setItem('cart', JSON.stringify(cart));
     displayCartItems(); // Mettre à jour l'affichage après suppression
   }
 }
 
 // Fonction pour mettre à jour la quantité d'un produit dans le panier
 function updateCartItemQuantity(productId, color, newQuantity) {
   const cartItemToUpdate = cart.find(item => item.product.productId === productId && item.color === color);
   if (cartItemToUpdate) {
     cartItemToUpdate.quantity = newQuantity;
     localStorage.setItem('cart', JSON.stringify(cart));
     displayCartItems(); // Mettre à jour l'affichage après modification de la quantité
   }
 }
 
 // Fonction pour afficher les produits du panier et le prix total
 function displayCartItems() {
   cartItemsSection.innerHTML = ''; // Effacez le contenu existant
 
   // Créez un objet pour stocker les produits regroupés par modèle
   const groupedProducts = {};
 
   let totalQuantity = 0;
   let totalPrice = 0;
 
   cart.forEach(cartItem => {
     const cartItemId = cartItem.product.productId;
     const cartItemColor = cartItem.color;
 
     // Groupez les produits par modèle (id + couleur)
     const key = `${cartItemId}-${cartItemColor}`;
 
     if (groupedProducts[key]) {
       // Si le produit existe déjà dans le groupe, mettez à jour la quantité
       groupedProducts[key].quantity += cartItem.quantity;
     } else {
       // Sinon, ajoutez le produit au groupe
       groupedProducts[key] = { ...cartItem };
     }
 
     // Mettez à jour le total de quantité et le prix total
     totalQuantity += cartItem.quantity;
     totalPrice += cartItem.product.price * cartItem.quantity;
   });
 
   // Parcourez les produits groupés pour les afficher dans le panier
   for (const key in groupedProducts) {
     const groupedCartItem = groupedProducts[key];
 
     const cartItemArticle = document.createElement('article');
     cartItemArticle.classList.add('cart__item');
     cartItemArticle.dataset.id = groupedCartItem.product.productId;
     cartItemArticle.dataset.color = groupedCartItem.color;
 
     const cartItemImage = document.createElement('div');
     cartItemImage.classList.add('cart__item__img');
     cartItemImage.innerHTML = `<img src="${groupedCartItem.product.imageUrl}" alt="${groupedCartItem.product.altTxt}">`;
 
     const cartItemContent = document.createElement('div');
     cartItemContent.classList.add('cart__item__content');
 
     const cartItemDescription = document.createElement('div');
     cartItemDescription.classList.add('cart__item__content__description');
     cartItemDescription.innerHTML = `
       <h2>${groupedCartItem.product.name}</h2>
       <p>${groupedCartItem.color}</p>
       <p>${groupedCartItem.product.price} €</p>
     `;
 
     const cartItemSettings = document.createElement('div');
     cartItemSettings.classList.add('cart__item__content__settings');
 
     const cartItemQuantity = document.createElement('div');
     cartItemQuantity.classList.add('cart__item__content__settings__quantity');
     cartItemQuantity.innerHTML = `
       <p>Qté : </p>
       <button class="decrementQuantity">-</button>
       <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${groupedCartItem.quantity}">
       <button class="incrementQuantity">+</button>
     `;
 
     const decrementButton = cartItemQuantity.querySelector('.decrementQuantity');
     const incrementButton = cartItemQuantity.querySelector('.incrementQuantity');
     const quantityInput = cartItemQuantity.querySelector('.itemQuantity');
 
     decrementButton.addEventListener('click', () => {
       const currentQuantity = parseInt(quantityInput.value);
       const newQuantity = currentQuantity > 1 ? currentQuantity - 1 : 1;
       quantityInput.value = newQuantity;
       updateCartItemQuantity(groupedCartItem.product.productId, groupedCartItem.color, newQuantity);
     });
 
     incrementButton.addEventListener('click', () => {
       const currentQuantity = parseInt(quantityInput.value);
       const newQuantity = currentQuantity + 1;
       quantityInput.value = newQuantity;
       updateCartItemQuantity(groupedCartItem.product.productId, groupedCartItem.color, newQuantity);
     });
 
     const cartItemDelete = document.createElement('div');
     cartItemDelete.classList.add('cart__item__content__settings__delete');
     cartItemDelete.innerHTML = '<p class="deleteItem">Supprimer</p>';
     
     cartItemDelete.addEventListener('click', () => {
       // Supprimer le modèle du panier
       removeModelFromCart(groupedCartItem.product.productId, groupedCartItem.color);
     });
 
     cartItemSettings.appendChild(cartItemQuantity);
     cartItemSettings.appendChild(cartItemDelete);
 
     cartItemContent.appendChild(cartItemDescription);
     cartItemContent.appendChild(cartItemSettings);
 
     cartItemArticle.appendChild(cartItemImage);
     cartItemArticle.appendChild(cartItemContent);
 
     cartItemsSection.appendChild(cartItemArticle);
   }
 
   // Mettez à jour le texte du prix total
   totalQuantityElement.textContent = totalQuantity;
   totalPriceElement.textContent = totalPrice.toFixed(2) + ' €';
 }
 
 // Appelez la fonction pour afficher les produits du panier lors du chargement de la page
 displayCartItems();

 function validateForm() {
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const addressInput = document.getElementById('address');
  const cityInput = document.getElementById('city');
  const emailInput = document.getElementById('email');

  const firstNameValue = firstNameInput.value.trim();
  const lastNameValue = lastNameInput.value.trim();
  const addressValue = addressInput.value.trim();
  const cityValue = cityInput.value.trim();
  const emailValue = emailInput.value.trim();

  const nameRegex = /^[A-Za-z]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let isValid = true;

  if (!nameRegex.test(firstNameValue)) {
    document.getElementById('firstNameErrorMsg').textContent = "Le prénom ne doit contenir que des lettres.";
    isValid = false;
  } else {
    document.getElementById('firstNameErrorMsg').textContent = "";
  }

  if (!nameRegex.test(lastNameValue)) {
    document.getElementById('lastNameErrorMsg').textContent = "Le nom ne doit contenir que des lettres.";
    isValid = false;
  } else {
    document.getElementById('lastNameErrorMsg').textContent = "";
  }

  if (!addressValue) {
    document.getElementById('addressErrorMsg').textContent = "Veuillez entrer votre adresse.";
    isValid = false;
  } else {
    document.getElementById('addressErrorMsg').textContent = "";
  }

  if (!cityValue) {
    document.getElementById('cityErrorMsg').textContent = "Veuillez entrer votre ville.";
    isValid = false;
  } else {
    document.getElementById('cityErrorMsg').textContent = "";
  }

  if (!emailRegex.test(emailValue)) {
    document.getElementById('emailErrorMsg').textContent = "Veuillez entrer une adresse e-mail valide.";
    isValid = false;
  } else {
    document.getElementById('emailErrorMsg').textContent = "";
  }

  return isValid;
}



// Gestionnaire d'événement pour soumettre le formulaire
orderForm.addEventListener('submit', function(event) {
  event.preventDefault();

  if (validateForm()) {
    // Envoyez les données à l'API ici
    const formData = new FormData(orderForm);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Générer un numéro de commande aléatoire
    const orderNumber = Math.floor(Math.random() * 1000000000); 

    // Rediriger vers la page de confirmation avec le numéro de commande
    window.location.href = `confirmation.html?orderNumber=${orderNumber}`;

    // Utilisez 'data' pour envoyer les données à l'API
    console.log(data);
  }
});


});