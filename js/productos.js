import {
  getData,
  crearProducto,
  subirImagenesProducto,
  getCategorias,
  getTags,
  crearCategoria,
  crearTag,
  haySesion,
} from "./fetch.js";
import { obtenerProductos } from "./utilidades-productos/obtenerProductos.js";

const mensaje = document.querySelector(".mensaje");
const selector = document.getElementById("select-productos");
const cantidadProductos = document.getElementById("cantidad-productos");

const btnAbrirModal = document.getElementById("btn-abrir-modal-crear");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");
const btnCancelarCrear = document.getElementById("btn-cancelar-crear");
const modalCrear = document.getElementById("modal-crear-producto");
const formCrear = document.getElementById("form-crear-producto");
const inputCategoriaModal = document.getElementById("nueva-categoria");
const inputCategoriaDesc = document.getElementById("nueva-categoria-desc");
const inputTagsModal = document.getElementById("nuevos-tags");
const datalistCategorias = document.getElementById("categorias-list");
const datalistTags = document.getElementById("tags-list");
const mensajeCrear = document.getElementById("mensaje-crear-producto");

let categoriasApi = [];
let tagsApi = [];

let productos = (await getData(mensaje)) || [];
// Filtro combinado: categoría (una) Y tags (todas las tildadas)
let filtro = { catId: null, tags: [] };

// Categorías y tags reales (para filtro + datalists del modal)
categoriasApi = (await getCategorias()) || [];
tagsApi = (await getTags()) || [];

const contenedorTags = document.getElementById("filtro-tags");

function construirFiltro() {
  if (selector) {
    selector.innerHTML = `<option value="">Todas las categorías</option>`;
    categoriasApi.forEach((c) => {
      const opcion = document.createElement("option");
      opcion.textContent = c.title;
      opcion.value = String(c.id);
      selector.appendChild(opcion);
    });
    selector.value = filtro.catId != null ? String(filtro.catId) : "";
  }

  if (contenedorTags) {
    contenedorTags.innerHTML = "";
    tagsApi.forEach((t) => {
      const label = document.createElement("label");
      label.className =
        "inline-flex items-center gap-1 text-sm border rounded-full px-2 py-1 cursor-pointer hover:bg-gray-100";
      const check = document.createElement("input");
      check.type = "checkbox";
      check.value = t.title;
      check.checked = filtro.tags.includes(t.title);
      check.setAttribute("aria-label", `Filtrar por etiqueta ${t.title}`);
      check.addEventListener("change", () => {
        filtro.tags = [...contenedorTags.querySelectorAll("input:checked")].map(
          (c) => c.value,
        );
        filtroAURL();
        actualizarProductos();
      });
      label.append(check, document.createTextNode(t.title));
      contenedorTags.appendChild(label);
    });
  }
}

// ?categoria=<id|titulo> y ?tag=<t1,t2> (compartible / linkeable)
function filtroDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  const catParam = (params.get("categoria") || "").trim();
  const tagParam = (params.get("tag") || "").trim();
  const next = { catId: null, tags: [] };

  if (catParam) {
    const match =
      categoriasApi.find((c) => String(c.id) === catParam) ||
      categoriasApi.find(
        (c) => c.title.toLowerCase() === catParam.toLowerCase(),
      );
    if (match) next.catId = match.id;
  }

  if (tagParam) {
    const pedidos = tagParam
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    next.tags = tagsApi
      .filter((t) => pedidos.includes(t.title.toLowerCase()))
      .map((t) => t.title);
  }

  return next;
}

function filtroAURL() {
  const url = new URL(window.location.href);
  url.searchParams.delete("categoria");
  url.searchParams.delete("tag");
  if (filtro.catId != null) url.searchParams.set("categoria", filtro.catId);
  if (filtro.tags.length > 0) url.searchParams.set("tag", filtro.tags.join(","));
  history.replaceState(null, "", url);
}

function actualizarProductos() {
  if (!haySesion()) return; // getData ya mostró el aviso de login
  const productosFiltrados = productos.filter((p) => {
    const okCat =
      filtro.catId == null ||
      p.category_id === filtro.catId ||
      p.category?.id === filtro.catId;
    const titulos = (p.tags || []).map((t) => t.title);
    const okTags = filtro.tags.every((t) => titulos.includes(t));
    return okCat && okTags;
  });
  cantidadProductos.textContent = productosFiltrados.length;
  const countTags = document.getElementById("filtro-tags-count");
  if (countTags) {
    countTags.textContent = `${filtro.tags.length}${filtro.catId != null ? " + categoría" : ""}`;
  }

  if (productosFiltrados.length === 0) {
    mensaje.textContent = "Ningún producto coincide con el filtro elegido.";
  }
  obtenerProductos(
    productosFiltrados,
    productosFiltrados.length > 0 ? mensaje : null,
  );
}

construirFiltro();
filtro = filtroDesdeURL();
construirFiltro();
actualizarProductos();

selector?.addEventListener("change", () => {
  const cat = categoriasApi.find((c) => String(c.id) === selector.value);
  filtro.catId = cat ? cat.id : null;
  filtroAURL();
  actualizarProductos();
});

document.getElementById("btn-limpiar-filtros")?.addEventListener("click", () => {
  filtro = { catId: null, tags: [] };
  construirFiltro();
  filtroAURL();
  actualizarProductos();
});

const abrirModal = async () => {
  modalCrear?.classList.remove("hidden");
  modalCrear?.classList.add("flex");
  mensajeCrear.textContent = "";

  const [cats, tags] = await Promise.all([getCategorias(), getTags()]);
  categoriasApi = cats || [];
  tagsApi = tags || [];

  if (datalistCategorias) {
    datalistCategorias.innerHTML = categoriasApi
      .map((cat) => `<option value="${cat.title}"></option>`)
      .join("");
  }
  if (datalistTags) {
    datalistTags.innerHTML = tagsApi
      .map((tag) => `<option value="${tag.title}"></option>`)
      .join("");
  }
};

const cerrarModal = () => {
  modalCrear?.classList.add("hidden");
  modalCrear?.classList.remove("flex");
  formCrear?.reset();
};

btnAbrirModal?.addEventListener("click", abrirModal);
btnCerrarModal?.addEventListener("click", cerrarModal);
btnCancelarCrear?.addEventListener("click", cerrarModal);

formCrear?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("nuevo-titulo").value.trim();
  const description = document.getElementById("nueva-descripcion").value.trim();
  const price = parseFloat(document.getElementById("nuevo-precio").value);
  const categoriaNombre = inputCategoriaModal?.value.trim() || "";
  const categoriaDesc = inputCategoriaDesc?.value.trim() || categoriaNombre;
  const tagsRaw = inputTagsModal?.value || "";
  const files = document.getElementById("nuevas-imagenes").files;

  if (!title || !description || isNaN(price) || price < 0 || !categoriaNombre) {
    mensajeCrear.textContent =
      "Completá título, descripción, precio válido y categoría.";
    mensajeCrear.className = "text-sm font-medium text-red-600";
    return;
  }

  mensajeCrear.textContent = "Guardando producto...";
  mensajeCrear.className = "text-sm font-medium text-blue-600";

  // 1. Resolver o crear categoría (comparación insensible a mayúsculas)
  let categoria = categoriasApi.find(
    (c) => c.title.toLowerCase() === categoriaNombre.toLowerCase(),
  );

  if (!categoria) {
    mensajeCrear.textContent = "Creando categoría nueva...";
    categoria = await crearCategoria({
      title: categoriaNombre,
      description: categoriaDesc,
    });

    if (!categoria || !categoria.id) {
      mensajeCrear.textContent =
        "No se pudo crear la categoría. Revisa si iniciaste sesión.";
      mensajeCrear.className = "text-sm font-medium text-red-600";
      return;
    }
    categoriasApi.push(categoria);
  }

  // 2. Resolver o crear tags (separados por coma, sin duplicados)
  const nombresTags = [
    ...new Set(
      tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => t.toLowerCase()),
    ),
  ];
  // conservar capitalización original de la primera aparición
  const nombresOriginales = {};
  tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .forEach((t) => {
      if (!nombresOriginales[t.toLowerCase()]) nombresOriginales[t.toLowerCase()] = t;
    });

  const tag_ids = [];
  for (const nombreLower of nombresTags) {
    let tag = tagsApi.find((t) => t.title.toLowerCase() === nombreLower);

    if (!tag) {
      mensajeCrear.textContent = `Creando etiqueta "${nombresOriginales[nombreLower]}"...`;
      tag = await crearTag({ title: nombresOriginales[nombreLower] });

      if (!tag || !tag.id) {
        mensajeCrear.textContent = `No se pudo crear la etiqueta "${nombresOriginales[nombreLower]}".`;
        mensajeCrear.className = "text-sm font-medium text-red-600";
        return;
      }
      tagsApi.push(tag);
    }
    tag_ids.push(tag.id);
  }

  // 3. Crear producto con category_id + tag_ids
  mensajeCrear.textContent = "Guardando producto...";
  const nuevo = await crearProducto({
    title,
    description,
    price,
    category_id: categoria.id,
    tag_ids,
  });

  if (!nuevo || !nuevo.id) {
    mensajeCrear.textContent = "Error al crear producto. Revisa si iniciaste sesión.";
    mensajeCrear.className = "text-sm font-medium text-red-600";
    return;
  }

  if (files && files.length > 0) {
    mensajeCrear.textContent = "Subiendo imágenes...";
    await subirImagenesProducto(nuevo.id, files);
  }

  productos = (await getData(mensaje)) || [];
  construirFiltro();
  actualizarProductos();

  cerrarModal();
});
