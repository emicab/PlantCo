import "../../componentes/ProductCard.js";

export const agregarProducto = (data, elem) => {
  data.forEach((p) => {
    const card = document.createElement("product-card");
    card.producto = p;
    elem.appendChild(card);
  });
};
