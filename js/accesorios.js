import { getData } from "./fetch.js";
import { obtenerProductos } from "./utilidades-productos/obtenerProductos.js";

const mensaje = document.querySelector(".mensaje");
const subtitulo = document.getElementById("subtitle");
const titulo = document.getElementById("titulo-categoria");

const params = new URLSearchParams(window.location.search);
const categoriaParam = (params.get("categoria") || "Accesorios").trim();

const productos = (await getData(mensaje)) || [];

const esId = /^\d+$/.test(categoriaParam);
const filtrados = productos.filter((p) => {
  if (esId) {
    return p.category_id === Number(categoriaParam) || p.category?.id === Number(categoriaParam);
  }
  return (
    p.category?.title?.toLowerCase() === categoriaParam.toLowerCase() ||
    // compatibilidad: si coincide con un tag, mostrar esos también
    p.tags?.some((t) => t.title.toLowerCase() === categoriaParam.toLowerCase())
  );
});

const nombreCategoria =
  filtrados[0]?.category?.title ??
  (esId ? `Categoría ${categoriaParam}` : categoriaParam);

if (titulo) titulo.textContent = `Categoría: ${nombreCategoria}`;
if (subtitulo && filtrados[0]?.category?.description) {
  subtitulo.textContent = filtrados[0].category.description;
}

if (filtrados.length === 0 && mensaje) {
  mensaje.textContent = `No hay productos en "${categoriaParam}". Probá con otra categoría o desde el catálogo.`;
}

obtenerProductos(filtrados, filtrados.length > 0 ? mensaje : null);
