// Attend que le document HTML soit complètement chargé avant d'exécuter le code.
document.addEventListener("DOMContentLoaded", function () {
  /** @type {HTMLFormElement} */
  const orderForm = document.querySelector(".cart__order__form");

  /** @type {HTMLElement} */
  const cartItemsSection = document.getElementById("cart__items");

  /** @type {HTMLElement} */
  const totalQuantityElement = document.getElementById("totalQuantity");

  /** @type {HTMLElement} */
  const totalPriceElement = document.getElementById("totalPrice");

  /** @type {CartItem[]} */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  /**
   * Supprime un modèle du panier en fonction de son ID de produit et de sa couleur.
   * @param {number} productId - L'ID du produit à supprimer.
   * @param {string} color - La couleur du produit à supprimer.
   */
  function removeModelFromCart(productId, color) {
    const cartItemsToRemove = cart.filter(
      (item) => item.product.productId === productId && item.color === color
    );
    if (cartItemsToRemove.length > 0) {
      const indexesToRemove = cartItemsToRemove.map((itemToRemove) =>
        cart.indexOf(itemToRemove)
      );
      indexesToRemove.sort((a, b) => b - a);
      indexesToRemove.forEach((index) => {
        cart.splice(index, 1);
      });
      updateCartTotals();
      displayCartItems();
    }
  }

  /**
   * Met à jour la quantité d'un produit dans le panier.
   * @param {number} productId - L'ID du produit à mettre à jour.
   * @param {string} color - La couleur du produit à mettre à jour.
   * @param {number} newQuantity - La nouvelle quantité du produit.
   */
  function updateCartItemQuantity(productId, color, newQuantity) {
    const cartItemToUpdate = cart.find(
      (item) => item.product.productId === productId && item.color === color
    );
    if (cartItemToUpdate) {
      cartItemToUpdate.quantity = newQuantity;
      updateCartTotals();
      displayCartItems();
    }
  }

  //Efface le contenu du panier et met à jour l'affichage.
  function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    updateCartTotals();
    displayCartItems();
  }

  //Met à jour les totaux du panier (quantité totale et prix total).
  function updateCartTotals() {
    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach((cartItem) => {
      totalQuantity += cartItem.quantity;
      totalPrice += cartItem.product.price * cartItem.quantity;
    });

    totalQuantityElement.textContent = totalQuantity;
    totalPriceElement.textContent = totalPrice.toFixed(2) + " €";
  }

  //Affiche les produits du panier et met à jour le prix total.
  function displayCartItems() {
    cartItemsSection.innerHTML = "";
    const groupedProducts = {};

    cart.forEach((cartItem) => {
      const cartItemId = cartItem.product.productId;
      const cartItemColor = cartItem.color;
      const key = `${cartItemId}-${cartItemColor}`;

      if (groupedProducts[key]) {
        groupedProducts[key].quantity += cartItem.quantity;
        groupedProducts[key].totalPrice +=
          cartItem.product.price * cartItem.quantity;
      } else {
        groupedProducts[key] = {
          ...cartItem,
          totalPrice: cartItem.product.price * cartItem.quantity,
        };
      }
    });

    for (const key in groupedProducts) {
      const groupedCartItem = groupedProducts[key];
      const cartItemArticle = document.createElement("article");
      cartItemArticle.classList.add("cart__item");
      cartItemArticle.dataset.id = groupedCartItem.product.productId;
      cartItemArticle.dataset.color = groupedCartItem.color;
      const cartItemImage = document.createElement("div");
      cartItemImage.classList.add("cart__item__img");
      cartItemImage.innerHTML = `<img src="${groupedCartItem.product.imageUrl}" alt="${groupedCartItem.product.altTxt}">`;
      const cartItemContent = document.createElement("div");
      cartItemContent.classList.add("cart__item__content");
      const cartItemDescription = document.createElement("div");
      cartItemDescription.classList.add("cart__item__content__description");
      cartItemDescription.innerHTML = `
        <h2>${groupedCartItem.product.name}</h2>
        <p>${groupedCartItem.color}</p>
        <p>${groupedCartItem.product.price} €</p>
        <p>Total : ${groupedCartItem.totalPrice.toFixed(2)} €</p>
      `;
      const cartItemSettings = document.createElement("div");
      cartItemSettings.classList.add("cart__item__content__settings");
      const cartItemQuantity = document.createElement("div");
      cartItemQuantity.classList.add("cart__item__content__settings__quantity");
      cartItemQuantity.innerHTML = `
        <p>Qté : </p>
        <button class="decrementQuantity">-</button>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${groupedCartItem.quantity}">
        <button class="incrementQuantity">+</button>
      `;
      const decrementButton =
        cartItemQuantity.querySelector(".decrementQuantity");
      const incrementButton =
        cartItemQuantity.querySelector(".incrementQuantity");
      const quantityInput = cartItemQuantity.querySelector(".itemQuantity");
      decrementButton.addEventListener("click", () => {
        const currentQuantity = parseInt(quantityInput.value);
        const newQuantity = currentQuantity > 1 ? currentQuantity - 1 : 1;
        quantityInput.value = newQuantity;
        updateCartItemQuantity(
          groupedCartItem.product.productId,
          groupedCartItem.color,
          newQuantity
        );
      });
      incrementButton.addEventListener("click", () => {
        const currentQuantity = parseInt(quantityInput.value);
        const newQuantity = currentQuantity + 1;
        quantityInput.value = newQuantity;
        updateCartItemQuantity(
          groupedCartItem.product.productId,
          groupedCartItem.color,
          newQuantity
        );
      });
      const cartItemDelete = document.createElement("div");
      cartItemDelete.classList.add("cart__item__content__settings__delete");
      cartItemDelete.innerHTML = '<p class="deleteItem">Supprimer</p>';
      cartItemDelete.addEventListener("click", () => {
        removeModelFromCart(
          groupedCartItem.product.productId,
          groupedCartItem.color
        );
      });
      cartItemSettings.appendChild(cartItemQuantity);
      cartItemSettings.appendChild(cartItemDelete);
      cartItemContent.appendChild(cartItemDescription);
      cartItemContent.appendChild(cartItemSettings);
      cartItemArticle.appendChild(cartItemImage);
      cartItemArticle.appendChild(cartItemContent);
      cartItemsSection.appendChild(cartItemArticle);
    }

    updateCartTotals();
  }
  // Appeler la fonction pour afficher les produits du panier lors du chargement de la page
  displayCartItems();

  /**
   * Valide le formulaire de commande avant de l'envoyer.
   * @returns {boolean} - True si le formulaire est valide, sinon False.
   */
  function validateForm() {
    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const addressInput = document.getElementById("address");
    const cityInput = document.getElementById("city");
    const emailInput = document.getElementById("email");
    const firstNameValue = firstNameInput.value.trim();
    const lastNameValue = lastNameInput.value.trim();
    const addressValue = addressInput.value.trim();
    const cityValue = cityInput.value.trim();
    const emailValue = emailInput.value.trim();
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!nameRegex.test(firstNameValue)) {
      document.getElementById("firstNameErrorMsg").textContent =
        "Le prénom ne doit contenir que des lettres.";
      isValid = false;
    } else {
      document.getElementById("firstNameErrorMsg").textContent = "";
    }

    if (!nameRegex.test(lastNameValue)) {
      document.getElementById("lastNameErrorMsg").textContent =
        "Le nom ne doit contenir que des lettres.";
      isValid = false;
    } else {
      document.getElementById("lastNameErrorMsg").textContent = "";
    }

    if (!addressValue) {
      document.getElementById("addressErrorMsg").textContent =
        "Veuillez entrer votre adresse.";
      isValid = false;
    } else {
      document.getElementById("addressErrorMsg").textContent = "";
    }

    if (!cityValue) {
      document.getElementById("cityErrorMsg").textContent =
        "Veuillez entrer votre ville.";
      isValid = false;
    } else {
      document.getElementById("cityErrorMsg").textContent = "";
    }

    if (!emailRegex.test(emailValue)) {
      document.getElementById("emailErrorMsg").textContent =
        "Veuillez entrer une adresse e-mail valide.";
      isValid = false;
    } else {
      document.getElementById("emailErrorMsg").textContent = "";
    }

    return isValid;
  }

  /**
   * Envoie les données de commande à l'API.
   * @param {Object} orderData - Les données de commande.
   */
  function sendOrderToAPI(orderData) {
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        const confirmationPageUrl = `confirmation.html?orderId=${data.orderNumber}`;
        window.location.href = confirmationPageUrl;
        window.location.href = `confirmation.html?orderId=${orderNumber}`;
        clearCart();
      })
      .catch((error) =>
        console.error("Erreur lors de l'envoi de la commande à l'API:", error)
      );
  }

  // Gestionnaire d'événement pour soumettre le formulaire de commande
  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validateForm()) {
      const formData = new FormData(orderForm);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      sendOrderToAPI(data);
    }
  });
});
