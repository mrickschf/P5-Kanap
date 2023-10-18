// Tableau pour stocker les données des meubles récupérées depuis l'API.
let meubleData = [];

/**
 * Récupère les données des meubles depuis l'API.
 * @async
 * @function
 * @returns {Promise<void>}
 */
const fetchMeuble = async () => {
  try {
    // Effectue une requête pour récupérer les données des meubles depuis l'API.
     
    const response = await fetch("http://localhost:3000/api/products");
    
    //Les données au format JSON obtenues depuis l'API.
    const promise = await response.json();
    
    // Assigner les données à la variable meubleData
    meubleData = promise;

    // Afficher les données dans la console
    console.log(meubleData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données des meubles :', error);
  }
};

/**
 * Affiche les données des meubles sur la page web.
 * @async
 * @function
 * @returns {Promise<void>}
 */
const meubleDisplay = async () => {
  try {
    // Récupérer les données des meubles
    await fetchMeuble();

    /**
     * L'élément HTML qui va contenir les articles de meubles.
     * @type {HTMLElement}
     */
    const container = document.getElementById("items");

    // Itérer sur chaque meuble et créer les éléments HTML correspondants
    meubleData.forEach((meuble) => {
      /**
       * L'élément ancre (lien) pour afficher plus de détails sur le meuble.
       * @type {HTMLAnchorElement}
       */
      const card = document.createElement("a");
      card.id = "items" + meuble._id;
      card.href = `./product.html?id=${meuble._id}`;

      /**
       * L'élément article qui contiendra les informations du meuble.
       * @type {HTMLArticleElement}
       */
      const article = document.createElement("article");

      /**
       * L'élément img pour afficher l'image du meuble.
       * @type {HTMLImageElement}
       */
      const image = document.createElement("img");
      image.src = meuble.imageUrl;
      image.alt = "image de meuble " + meuble.name;

      /**
       * L'élément h3 pour afficher le nom du meuble.
       * @type {HTMLHeadingElement}
       */
      const title = document.createElement("h3");
      title.className = "productName";
      title.textContent = meuble.name.toUpperCase();

      /**
       * L'élément p pour afficher la description du meuble.
       * @type {HTMLParagraphElement}
       */
      const description = document.createElement("p");
      description.className = "productDescription";
      description.textContent = meuble.description;

      // Ajouter les éléments à la structure HTML
      article.appendChild(image);
      article.appendChild(title);
      article.appendChild(description);

      card.appendChild(article);

      container.appendChild(card);
    });
  } catch (error) {
    console.error('Erreur lors de l\'affichage des meubles :', error);
  }
};

// Appeler la fonction pour afficher les meubles
meubleDisplay();

