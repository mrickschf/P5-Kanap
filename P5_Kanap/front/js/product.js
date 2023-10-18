// Données du produit.
let productData = null;

/**
 * Récupère les paramètres de l'URL.
 * @type {string}
 */
const queryParams = window.location.search;


/**
 * Analyse les paramètres de l'URL.
 * @type {URLSearchParams}
 */
const urlParams = new URLSearchParams(queryParams);

/**
 * Récupère l'ID du produit depuis les paramètres de l'URL.
 * @type {string|null}
 */
const productId = urlParams.get("id");

// Récupère les détails du produit depuis l'API.
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Échec de la récupération des données");
    }
  })
  .then((data) => {
    // Met à jour productData avec les données du produit.
    productData = data; 
    showProductDetails(productData); // Appeler la fonction en utilisant productData
  })
  .catch((err) => {
    console.error("Erreur lors de la récupération des données :", err);
  });

  /**
 * Affiche les détails du produit.
 * @param {Object} product - Les détails du produit.
 */
function showProductDetails(product) {
  showProductImage(product);
  showProductName(product);
  showProductPrice(product);
  showProductDescription(product);
  chooseProductColor(product);
}

/**
 * Affiche l'image du produit.
 * @param {Object} product - Les détails du produit.
 */
function showProductImage(product) {
  const itemImg = document.querySelector(".item__img");
  itemImg.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
}


/**
 * Affiche le nom du produit.
 * @param {Object} product - Les détails du produit.
 */
function showProductName(product) {
  const title = document.querySelector("#title");
  title.innerText = product.name;
}

/**
 * Affiche le prix du produit.
 * @param {Object} product - Les détails du produit.
 */
function showProductPrice(product) {
  const price = document.querySelector("#price");
  price.textContent = product.price;
}

/**
 * Affiche la description du produit.
 * @param {Object} product - Les détails du produit.
 */
function showProductDescription(product) {
  const description = document.querySelector("#description");
  description.textContent = product.description;
}

/**
 * Permet de choisir la couleur du produit.
 * @param {Object} product - Les détails du produit.
 */
function chooseProductColor(product) {
  const colorsSelect = document.querySelector("#colors"); // Utiliser le sélecteur correct

  // Supprimer d'abord toutes les options existantes
  colorsSelect.innerHTML = "";

  // couleur disponible comme option
  product.colors.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    colorsSelect.appendChild(option);
  });

  // écouteur d'événement pour gérer le changement de couleur
  colorsSelect.addEventListener("change", (event) => {
    const selectedColor = event.target.value;
    console.log("Couleur sélectionnée :", selectedColor);
    // Vous pouvez effectuer d'autres actions ici, comme mettre à jour l'affichage ou effectuer des requêtes supplémentaires si nécessaire
  });
}

/**
 * Récupère le bouton "Ajouter au panier".
 * @type {HTMLElement}
 */
const addToCartButton = document.querySelector("#addToCart");

/**
 * Gestionnaire d'événement pour le bouton "Ajouter au panier".
 */
addToCartButton.addEventListener("click", () => {
  const selectedColor = document.querySelector("#colors").value;
  const selectedQuantity = parseInt(document.querySelector("#quantity").value);

  if (selectedQuantity <= 0) {
    alert("Veuillez sélectionner une quantité valide.");
    return;
  }

  // Récupérer les détails du produit depuis productData (chargé depuis l'API)
  const productDetails = {
    productId: productData._id, // Assurez-vous que la clé correspond au nom utilisé dans votre panier
    name: productData.name,
    imageUrl: productData.imageUrl,
    altTxt: productData.altTxt,
    price: productData.price,
  };

  // Ajouter le produit au panier
  addToCart(productDetails, selectedColor, selectedQuantity);

  console.log("Produit ajouté au panier :", productDetails);
});

/**
 * Ajoute un produit au panier.
 * @param {Object} product - Les détails du produit.
 * @param {string} color - La couleur du produit.
 * @param {number} quantity - La quantité du produit.
 */
function addToCart(product, color, quantity) {
  const cartItem = {
    product: product,
    color: color,
    quantity: quantity
  };

  // Récupérer le panier depuis le localStorage s'il existe
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Ajouter le nouvel article au panier
  cart.push(cartItem);

  // Enregistrer le panier mis à jour dans le localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  console.log('Produit ajouté au panier :', cartItem);
}
