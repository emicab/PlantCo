export const crearProducto = (producto) => {
  const tagsHTML = producto.tags
    .map(
      (tag) => `
  <span class="px-2 py-1 text-sm font-bold rounded-full badge-tag badge-${tag.title.toLowerCase().replaceAll(" ", "-")}">${tag.title}</span>
`,
    )
    .join("");

  const imagenSrc = producto.pictures && producto.pictures.length > 0 
    ? (producto.pictures[0].startsWith("http") || producto.pictures[0].startsWith("public/") || producto.pictures[0].startsWith("./")
        ? producto.pictures[0]
        : `https://ecommerce.fedegonzalez.com/${producto.pictures[0]}`)
    : "public/hero-img.png";

  let articulo = `
    <article class="product-card relative">
            <span class="absolute top-2 right-2 flex gap-1">${tagsHTML}</span>
            <figure class="product-image-container">
              <img
                src="${imagenSrc}"
                alt="${producto.title}"
              />
              <figcaption class="visually-hidden">
                ${producto?.title} - ${producto.category?.title || ""}.
              </figcaption>
            </figure>
            <div class="product-content">
              <h3 class="product-title">${producto.title}</h3>
              <p class="product-desc">
                ${producto.short_description}
              </p>
              <div class="product-footer">
                <span class="product-price"><strong>$${producto.price}</strong></span>
                <a
                  href="detalles/${producto.title.replaceAll(" ", "-").toLowerCase()}.html"
                  class="btn-detail"
                  aria-label="Ver detalles de ${producto.title}"
                  >Detalle</a
                >
              </div>
            </div>
          </article>
    `;
  return articulo;
};
