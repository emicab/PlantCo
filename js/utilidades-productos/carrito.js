const CLAVE = "productosAgregados";

export const leerCarrito = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || [];
  } catch {
    return [];
  }
};

export const guardarCarrito = (items) => {
  localStorage.setItem(CLAVE, JSON.stringify(items));
  notificarCarrito();
};

export const contarUnidades = () =>
  leerCarrito().reduce((acc, p) => acc + (Number(p.cantidad) || 0), 0);

export const agregarAlCarrito = (id) => {
  const idProducto = Number(id);
  if (!idProducto) return contarUnidades();
  const items = leerCarrito();
  const existente = items.find((p) => p.id === idProducto);
  if (existente) {
    existente.cantidad++;
  } else {
    items.push({ id: idProducto, cantidad: 1 });
  }
  guardarCarrito(items);
  return contarUnidades();
};

export const cambiarCantidad = (id, delta) => {
  const items = leerCarrito();
  const item = items.find((p) => p.id === Number(id));
  if (!item) return;
  item.cantidad = Math.max(1, (Number(item.cantidad) || 1) + delta);
  guardarCarrito(items);
};

export const quitarDelCarrito = (id) => {
  guardarCarrito(leerCarrito().filter((p) => p.id !== Number(id)));
};

export const vaciarCarrito = () => guardarCarrito([]);

export const notificarCarrito = () => {
  window.dispatchEvent(
    new CustomEvent("carrito-actualizado", { detail: { total: contarUnidades() } }),
  );
};
