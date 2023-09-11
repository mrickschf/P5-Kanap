let meubleData = [];

const fetchMeuble = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((promise) => {
      meubleData = promise;
      console.log(meubleData);
    });
};

const meubleDisplay = async () => {
  await fetchMeuble();

  const container = document.getElementById("items");
  meubleData.forEach((meuble) => {
    const card = document.createElement("a");
    card.id = "items" + meuble._id;
    card.href = `./product.html?id=${meuble._id}`;


    const article = document.createElement("article");

    const image = document.createElement("img");
    image.src = meuble.imageUrl;
    image.alt = "image de meuble " + meuble.name;

    const title = document.createElement("h3");
    title.className = "productName";
    title.textContent = meuble.name.toUpperCase();

    const description = document.createElement("p");
    description.className = "productDescription";
    description.textContent = meuble.description;

    article.appendChild(image);
    article.appendChild(title);
    article.appendChild(description);

    card.appendChild(article);

    container.appendChild(card);
  });
};

meubleDisplay();

