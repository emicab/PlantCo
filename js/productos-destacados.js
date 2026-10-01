import { getData, getTags, haySesion, mensajeLogin } from "./fetch.js";
import { obtenerProductos } from "./utilidades-productos/obtenerProductos.js";

const mensaje = document.querySelector(".mensaje");

if (!haySesion()) {
  mensajeLogin(mensaje);
} else {
  const productos = (await getData(mensaje)) || [];
  const tags = (await getTags()) || [];

// Sin hardcodear: usa "destacado"/"nuevo" solo si existen en la API;
// si no, muestra los productos con más etiquetas (top 6).
  const conocidos = tags.map((t) => t.title.toLowerCase());
  const preferidos = ["destacado", "nuevo"].filter((n) =>
    conocidos.includes(n),
  );

  const destacados =
    preferidos.length > 0
      ? productos.filter((p) =>
          p.tags?.some((tag) =>
            preferidos.includes(tag.title.toLowerCase()),
          ),
        )
      : [...productos]
          .sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0))
          .slice(0, 6);

  obtenerProductos(destacados, mensaje);
}
