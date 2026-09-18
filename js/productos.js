import { getData } from "./fetch.js";
import { obtenerProductos } from "./utilidades-productos/obtenerProductos.js";

const mensaje = document.querySelector(".mensaje");
const selector = document.getElementById("select-productos");
const cantidadProductos = document.getElementById("cantidad-productos");

const productos = await getData(mensaje);

let categoriaFiltrada = "Todos";

const categorias = [
  { Title: "Todos", attb: "selected" },
  { Title: "Destacado" },
  { Title: "Nuevo" },
  { Title: "Fácil Cuidado" },
  { Title: "Tendencia" },
];

categorias.map((ctg) => {
  const opcion = document.createElement("option");
  opcion.textContent = ctg.Title;
  opcion.value = ctg.Title;

  if (ctg.attb === "selected") {
    opcion.selected = true;
  }

  selector?.appendChild(opcion);
});

function actualizarProductos() {
  const productosFiltrados = productos?.filter((p) => {
    if (categoriaFiltrada === "Todos") return true;

    return p.tags.some((tag) => {
      console.log(`Comparando: "${tag.title}" con "${categoriaFiltrada}"`);
      return tag.title === categoriaFiltrada;
    });
  });
  cantidadProductos.textContent = productosFiltrados?.length;

  obtenerProductos(productosFiltrados, mensaje);
}

actualizarProductos();

selector.addEventListener("change", () => {
  console.log(selector.value);
  categoriaFiltrada = selector.value;

  actualizarProductos();
});
