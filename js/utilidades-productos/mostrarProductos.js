import { agregarProducto } from "./agregarProducto.js";
const container = document.querySelector(".products-grid");

export const mostrarProductos = (productos, elem) => {
  if (!productos) {
    elem.textContent = "No hay productos disponibles.";
    return;
  }
  container.innerHTML = "";
  agregarProducto(productos, container);
};
