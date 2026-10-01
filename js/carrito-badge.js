import { contarUnidades } from "./utilidades-productos/carrito.js";

// Actualiza todos los badges estáticos <span data-cart-count> (ej. checkout.html
// que no usa el componente <nav-bar>).
const actualizar = () => {
  const total = contarUnidades();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = total;
    el.style.display = total > 0 ? "inline-flex" : "none";
  });
};

window.addEventListener("carrito-actualizado", actualizar);
window.addEventListener("storage", actualizar);
actualizar();
