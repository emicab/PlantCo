import { borrarProducto } from "../js/fetch.js";

export const deleteProducts = async (data) => {
  if (!data || data.length === 0) {
    return;
  }

  for (const producto of data) {
    if (producto.id) {
      await borrarProducto(producto.id);
    }
  }
};
