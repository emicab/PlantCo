import { getProductoId, haySesion } from "./fetch.js";
import {
  leerCarrito,
  guardarCarrito,
  cambiarCantidad,
  quitarDelCarrito,
  vaciarCarrito,
} from "./utilidades-productos/carrito.js";

const listaCheckout = document.querySelector("#checkout-productos");
const botonFinalizar = document.querySelector('button[type="submit"]');
const mensajeVacio = document.getElementById("checkout-vacio");
const btnVaciar = document.getElementById("btn-vaciar-carrito");

const formatearPrecio = (precio) =>
  Number(precio || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

const imagenSrc = (info) =>
  info.pictures && info.pictures.length > 0
    ? info.pictures[0].startsWith("http") ||
      info.pictures[0].startsWith("public/") ||
      info.pictures[0].startsWith("./")
      ? info.pictures[0]
      : `https://ecommerce.fedegonzalez.com/${info.pictures[0]}`
    : "public/hero-img.png";

async function render() {
  const items = leerCarrito();
  listaCheckout.innerHTML = "";

  if (!haySesion()) {
    mensajeVacio?.classList.remove("hidden");
    if (mensajeVacio) {
      mensajeVacio.innerHTML =
        'Iniciá sesión para ver los productos. <a href="login.html">Ir al login</a>';
    }
    btnVaciar?.classList.add("hidden");
    if (botonFinalizar) {
      botonFinalizar.textContent = "Finalizar Compra";
      botonFinalizar.disabled = true;
    }
    return;
  }

  if (items.length === 0) {
    mensajeVacio?.classList.remove("hidden");
    btnVaciar?.classList.add("hidden");
    if (botonFinalizar) {
      botonFinalizar.textContent = "Finalizar Compra";
      botonFinalizar.disabled = true;
    }
    return;
  }

  mensajeVacio?.classList.add("hidden");
  btnVaciar?.classList.remove("hidden");
  if (botonFinalizar) botonFinalizar.disabled = false;

  const infos = await Promise.all(items.map((item) => getProductoId(item.id)));
  const pares = items
    .map((item, i) => ({ item, info: infos[i] }))
    .filter((p) => p.info);
  // Limpiar del carrito los productos que ya no existen en la API
  if (pares.length !== items.length) {
    guardarCarrito(pares.map((p) => p.item));
  }

  let totalCompra = 0;

  pares.forEach(({ item, info }) => {
    const subtotal = info.price * item.cantidad;
    totalCompra += subtotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="d-flex align-items-center gap-3">
          <img src="${imagenSrc(info)}" alt="${info.title}"
            style="width: 50px; height: 50px; object-fit: contain" />
          <strong class="d-block">${info.title}</strong>
        </div>
      </td>
      <td>${formatearPrecio(info.price)}</td>
      <td class="text-center">
        <div class="btn-group btn-group-sm" role="group" aria-label="Cambiar cantidad">
          <button type="button" class="btn btn-outline-secondary" data-accion="restar" data-id="${item.id}">−</button>
          <span class="btn btn-light disabled">${item.cantidad}</span>
          <button type="button" class="btn btn-outline-secondary" data-accion="sumar" data-id="${item.id}">+</button>
        </div>
      </td>
      <td class="text-end">${formatearPrecio(subtotal)}</td>
      <td class="text-end">
        <button type="button" class="btn btn-sm btn-outline-danger" data-accion="quitar" data-id="${item.id}">Quitar</button>
      </td>
    `;
    listaCheckout.appendChild(tr);
  });

  if (botonFinalizar) {
    botonFinalizar.textContent = `Finalizar Compra (${formatearPrecio(totalCompra)})`;
  }
}

listaCheckout?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-accion]");
  if (!btn) return;
  const { accion, id } = btn.dataset;

  if (accion === "sumar") cambiarCantidad(id, 1);
  else if (accion === "restar") cambiarCantidad(id, -1);
  else if (accion === "quitar") quitarDelCarrito(id);

  render();
});

btnVaciar?.addEventListener("click", () => {
  vaciarCarrito();
  render();
});

window.addEventListener("storage", render);

render();
