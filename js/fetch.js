const URL_API = "http://ecommerce.fedegonzalez.com/products";

const getHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    accept: "application/json",
    ...extraHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const haySesion = () => !!localStorage.getItem("token");

// Aviso estándar cuando la API rechaza por falta de token (401/403)
export const mensajeLogin = (mensaje) => {
  if (mensaje) {
    mensaje.innerHTML =
      'Iniciá sesión para ver los productos. <a href="login.html">Ir al login</a>';
  }
};

const esAuthError = (response) =>
  response.status === 401 || response.status === 403;

export const getData = async (mensaje) => {
  if (!haySesion()) {
    mensajeLogin(mensaje);
    return [];
  }

  if (mensaje) {
    mensaje.textContent = "Cargando productos...";
  }

  try {
    const response = await fetch(`${URL_API}/`, {
      headers: getHeaders(),
      method: "GET",
    });

    if (!response.ok) {
      if (esAuthError(response)) {
        mensajeLogin(mensaje);
        return [];
      }
      throw new Error("No se pudo obtener la información.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return [];
  }
};

export const getProductoId = async (id) => {
  try {
    const response = await fetch(`${URL_API}/${id}`, {
      headers: getHeaders(),
      method: "GET",
    });

    if (!response.ok) {
      const error = new Error("No se pudo obtener la información del producto.");
      if (esAuthError(response)) error.auth = true;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener el producto:", error);
  }
};

export const crearProducto = async (producto) => {
  try {
    const response = await fetch(`${URL_API}/`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      throw new Error("No se pudo crear el producto.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al crear el producto:", error);
  }
};

export const modificarProducto = async (id, datosActualizados) => {
  try {
    const response = await fetch(`${URL_API}/${id}`, {
      method: "PUT",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(datosActualizados),
    });

    if (!response.ok) {
      throw new Error("No se pudo modificar el producto.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al modificar el producto:", error);
  }
};

export const borrarProducto = async (id) => {
  try {
    const response = await fetch(`${URL_API}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("No se pudo borrar el producto.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al borrar el producto:", error);
  }
};

export const subirImagenesProducto = async (id, archivos) => {
  try {
    const formData = new FormData();
    for (const archivo of archivos) {
      formData.append("files", archivo);
    }

    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${URL_API}/${id}/pictures`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error("No se pudieron subir las imágenes del producto.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al subir las imágenes:", error);
  }
};

export const getCategorias = async () => {
  try {
    const response = await fetch(
      "https://ecommerce.fedegonzalez.com/categories/",
      {
        headers: getHeaders(),
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("No se pudieron obtener las categorías.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
};

export const getTags = async () => {
  try {
    const response = await fetch(
      "https://ecommerce.fedegonzalez.com/tags/",
      {
        headers: getHeaders(),
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("No se pudieron obtener las etiquetas.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener etiquetas:", error);
    return [];
  }
};

export const crearCategoria = async ({ title, description }) => {
  try {
    const response = await fetch(
      "https://ecommerce.fedegonzalez.com/categories/",
      {
        method: "POST",
        headers: getHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ title, description }),
      },
    );

    if (!response.ok) {
      throw new Error("No se pudo crear la categoría.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al crear la categoría:", error);
  }
};

export const crearTag = async ({ title }) => {
  try {
    const response = await fetch("https://ecommerce.fedegonzalez.com/tags/", {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error("No se pudo crear la etiqueta.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al crear la etiqueta:", error);
  }
};
