import { getData } from "./fetch.js";
import { obtenerProductos } from "./utilidades-productos/obtenerProductos.js";

const productos = await getData();
const mensaje = document.querySelector(".mensaje");
const subtitulo = document.getElementById("subtitle");

const accesorios = productos.filter((p) => p.category.title === "Accesorios");

obtenerProductos(accesorios, mensaje);
