import { mostrarProductos } from "./mostrarProductos.js";

export const obtenerProductos = async (data, mensaje) => {
  try {
    if (!data || data.length === 0) {
      const grid = document.querySelector(".products-grid");
      if (grid) grid.innerHTML = "";
      if (mensaje) {
        mensaje.textContent = "No hay productos disponibles.";
      }
      return;
    }

    mostrarProductos(data, mensaje);
    if (mensaje) {
      mensaje.textContent = "";
    }
  } catch (error) {
    if (mensaje) {
      mensaje.textContent = "No se pudieron cargar los productos.";
    }
    console.error(error);
  }
};
