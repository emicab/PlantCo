const endpoint = `./data/api.json`;

export const getData = async (mensaje) => {
  if (mensaje) {
    mensaje.textContent = "Cargando productos...";
  }

  try {
    const response = await fetch(endpoint, {
      headers: { accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error("No se pudo obtener la información.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
};

export const getProductoId = async (id) => {
  try {
    const response = await fetch(endpoint, {
      headers: { accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error("No se pudo obtener la información.");
    }
    const data = await response.json();
    const productoId = data.find((producto) => producto.id === id);
    console.log("PRODUCTO ID:: ", productoId);
    return productoId;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
};
