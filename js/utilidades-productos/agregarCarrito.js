const agregarBtn = document.getElementById("agregar-carrito");

export const productosAgregados =
  JSON.parse(localStorage.getItem("productosAgregados")) || [];

const enCarrito = (id) => {
  return productosAgregados.some((p) => p.id === id);
};

agregarBtn?.addEventListener("click", () => {
  const idProducto = Number(agregarBtn.dataset.id);

  if (enCarrito(idProducto)) {
    const productoExistente = productosAgregados.find(
      (p) => p.id === idProducto,
    );

    productoExistente.cantidad++;
    localStorage.setItem(
      "productosAgregados",
      JSON.stringify(productosAgregados),
    );
    return;
  } else {
    productosAgregados.push({ id: idProducto, cantidad: 1 });
  }

  localStorage.setItem(
    "productosAgregados",
    JSON.stringify(productosAgregados),
  );
});
