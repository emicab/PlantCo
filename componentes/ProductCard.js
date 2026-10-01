import { LitElement, html } from "https://esm.sh/lit";
import { agregarAlCarrito } from "../js/utilidades-productos/carrito.js";

export class ProductCard extends LitElement {
  static properties = {
    producto: { type: Object },
  };

  createRenderRoot() {
    return this;
  }

  agregarAlCarrito = (e) => {
    e.preventDefault();
    if (!this.producto?.id) return;

    agregarAlCarrito(this.producto.id);

    const btn = e.currentTarget;
    const original = btn.textContent;
    btn.textContent = "¡Agregado! ✓";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1200);
  };

  render() {
    if (!this.producto) return html``;

    const tags = this.producto.tags || [];
    const imagenSrc =
      this.producto.pictures && this.producto.pictures.length > 0
        ? this.producto.pictures[0].startsWith("http") ||
          this.producto.pictures[0].startsWith("public/") ||
          this.producto.pictures[0].startsWith("./")
          ? this.producto.pictures[0]
          : `https://ecommerce.fedegonzalez.com/${this.producto.pictures[0]}`
        : "public/hero-img.png";

    return html`
      <article class="product-card relative">
        <span class="absolute top-2 right-2 flex gap-1">
          ${tags.map(
            (tag) => html`
              <span
                class="px-2 py-1 text-sm font-bold rounded-full badge-tag badge-${tag.title
                  .toLowerCase()
                  .replaceAll(" ", "-")}"
              >
                ${tag.title}
              </span>
            `,
          )}
        </span>
        <figure class="product-image-container">
          <img src="${imagenSrc}" alt="${this.producto.title}" />
          <figcaption class="visually-hidden">
            ${this.producto.title} - ${this.producto.category?.title || ""}.
          </figcaption>
        </figure>
        <div class="product-content">
          <h3 class="product-title">${this.producto.title}</h3>
          <p class="product-desc">${this.producto.short_description || this.producto.description || ""}</p>
          <div class="product-footer flex items-center justify-between gap-2 mt-4">
            <span class="product-price font-bold text-lg">$${this.producto.price}</span>
            <div class="flex gap-2">
              <a
                href="ficha.html?producto=${this.producto.id}"
                class="btn-detail"
                aria-label="Ver detalles de ${this.producto.title}"
              >
                Detalle
              </a>
              <button
                @click=${this.agregarAlCarrito}
                type="button"
                class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1 px-3 rounded text-sm"
              >
                + Carrito
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define("product-card", ProductCard);
