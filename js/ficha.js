import { getProductoId, haySesion, mensajeLogin } from "./fetch.js";
import { agregarAlCarrito } from "./utilidades-productos/carrito.js";

const params = new URLSearchParams(window.location.search);
const idProducto = params.get("producto");

const mensaje = document.getElementById("ficha-mensaje");
const contenedorDetalle = document.getElementById("ficha-detalle");
const imagenEl = document.getElementById("ficha-imagen");
const captionEl = document.getElementById("ficha-caption");
const tituloEl = document.getElementById("ficha-titulo");
const precioEl = document.getElementById("ficha-precio");
const descripcionEl = document.getElementById("ficha-descripcion");
const tagsEl = document.getElementById("ficha-tags");
const btnCarrito = document.getElementById("ficha-btn-carrito");

if (!idProducto) {
  mensaje.textContent = "Producto no especificado.";
} else if (!haySesion()) {
  mensajeLogin(mensaje);
} else {
  cargarProducto(Number(idProducto));
}

async function cargarProducto(id) {
  const producto = await getProductoId(id);

  if (!producto) {
    mensaje.textContent = "No se encontró el producto.";
    return;
  }

  mensaje.classList.add("hidden");
  contenedorDetalle.classList.remove("hidden");

  const imagenSrc =
    producto.pictures && producto.pictures.length > 0
      ? producto.pictures[0].startsWith("http") ||
        producto.pictures[0].startsWith("public/") ||
        producto.pictures[0].startsWith("./")
        ? producto.pictures[0]
        : `https://ecommerce.fedegonzalez.com/${producto.pictures[0]}`
      : "public/hero-img.png";

  imagenEl.src = imagenSrc;
  imagenEl.alt = producto.title;
  captionEl.textContent = `${producto.title} - ${producto.category?.title || ""}`;

  tituloEl.textContent = producto.title;
  precioEl.textContent = `$${producto.price}`;
  descripcionEl.textContent = producto.description || producto.short_description || "";

  if (producto.tags && producto.tags.length > 0) {
    tagsEl.innerHTML = producto.tags
      .map(
        (tag) => `
        <span class="px-2 py-1 text-sm font-bold rounded-full badge-tag badge-${tag.title
          .toLowerCase()
          .replaceAll(" ", "-")}">${tag.title}</span>
      `,
      )
      .join("");
  }

  btnCarrito?.addEventListener("click", () => {
    agregarAlCarrito(id);

    btnCarrito.textContent = "¡Agregado al Carrito! ✓";
    btnCarrito.disabled = true;
    setTimeout(() => {
      btnCarrito.textContent = "Agregar al Carrito";
      btnCarrito.disabled = false;
    }, 1500);
  });
}
