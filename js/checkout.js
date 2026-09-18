import { getProductoId } from "./fetch.js";

const listaCheckout = document.querySelector("#checkout-productos");
const productosAgregados =
  JSON.parse(localStorage.getItem("productosAgregados")) || [];

console.log("Productos en LocalStorage:", productosAgregados);

const formatearPrecio = (precio) => {
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
};

productosAgregados.forEach(async (item) => {
  const infoProducto = await getProductoId(item.id);

  if (!infoProducto) {
    console.error(
      `No se pudo obtener la información para el producto con ID: ${item.id}`,
    );
    return;
  }

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>
      <div class="d-flex align-items-center gap-3">
        <img
          src="${infoProducto.pictures[0]}"
          alt="${infoProducto.title}"
          style="width: 50px; height: 50px; object-fit: contain"
        />
        <div>
          <strong class="d-block">${infoProducto.title}</strong>
        </div>
      </div>
    </td>
    <td>${formatearPrecio(infoProducto.price)}</td>
    <td class="text-center">${item.cantidad}</td>
    <td class="text-end">${formatearPrecio(infoProducto.price * item.cantidad)}</td>
  `;
  listaCheckout.appendChild(tr);
});
