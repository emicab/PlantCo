import { agregarAlCarrito, leerCarrito } from "./carrito.js";

const agregarBtn = document.getElementById("agregar-carrito");

export const productosAgregados = leerCarrito();

const enCarrito = (id) => {
  return leerCarrito().some((p) => p.id === id);
};

agregarBtn?.addEventListener("click", () => {
  const idProducto = Number(agregarBtn.dataset.id);
  if (!idProducto) return;

  agregarAlCarrito(idProducto);

  const original = agregarBtn.textContent;
  agregarBtn.textContent = "¡Agregado al Carrito! ✓";
  agregarBtn.disabled = true;
  setTimeout(() => {
    agregarBtn.textContent = original;
    agregarBtn.disabled = false;
  }, 1500);
});

export { enCarrito };
