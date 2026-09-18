import { getData } from "./fetch.js";
import { obtenerProductos } from "./utilidades-productos/obtenerProductos.js";

const mensaje = document.querySelector(".mensaje");
const productos = await getData(mensaje);

const destacados = productos.filter((p) =>
  p.tags?.some((tag) => tag.title === "Destacado" || tag.title === "Nuevo"),
);

obtenerProductos(destacados, mensaje);
