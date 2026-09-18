import { crearProducto } from "./crearProducto.js";

export const agregarProducto = (data, elem) => {
  data.forEach((p) => {
    elem.innerHTML += crearProducto(p);
  });
};
