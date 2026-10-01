import { LitElement, html, css } from "https://esm.sh/lit";
import { contarUnidades } from "../js/utilidades-productos/carrito.js";

export class NavBar extends LitElement {
  static properties = {
    links: {},
    session: {},
    cantidad: { type: Number },
  };

  constructor() {
    super();
    this.links = [
      { name: "Inicio", url: "index.html" },
      { name: "Productos", url: "productos.html" },
      { name: "Accesorios", url: "categoria.html?categoria=Accesorios" },
      { name: "Newsletter", url: "newsletter.html" },
      { name: "Comparativa", url: "comparativa.html" },
    ];

    this.session = false;
    this.cantidad = contarUnidades();
  }

  connectedCallback() {
    super.connectedCallback();
    this._actualizar = () => {
      this.cantidad = contarUnidades();
    };
    window.addEventListener("carrito-actualizado", this._actualizar);
    window.addEventListener("storage", this._actualizar);
  }

  disconnectedCallback() {
    window.removeEventListener("carrito-actualizado", this._actualizar);
    window.removeEventListener("storage", this._actualizar);
    super.disconnectedCallback();
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    return html`
      <nav
        class="navbar navbar-expand-lg bg-light"
        aria-label="Navegación principal"
      >
        <div class="container-fluid">
          <a class="navbar-brand brand" href="index.html">PlantCo.</a>

          <div
            class="collapse navbar-collapse justify-content-sm-center"
            id="navbarNavAltMarkup"
          >
            <div class="navbar-nav">
              ${this.links.map((link) => {
                const urlBase = link.url.split("?")[0];
                const isCurrentPage = currentPage === urlBase;
                return html`<a
                  class="nav-link ${isCurrentPage ? "active" : ""}"
                  href="${link.url}"
                >
                  ${link.name}
                </a>`;
              })}
            </div>
          </div>
          <div class="flex">
            <div class="flex items-center">
              <a
                href="checkout.html"
                aria-label="Ver carrito de compras y pagar"
                style="position: relative; display: inline-block;"
              >
                <img
                  src="assets/cart.svg"
                  alt="Icono de Carrito"
                  class="icon"
                />
                ${this.cantidad > 0
                  ? html`<span
                      data-cart-count
                      style="position: absolute; top: 0; right: 0; background: #dc3545; color: #fff; border-radius: 9999px; font-size: 0.7rem; font-weight: bold; min-width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; padding: 0 5px;"
                    >
                      ${this.cantidad}
                    </span>`
                  : ""}
              </a>
              <login-btn></login-btn>
            </div>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Abrir menú de navegación"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </nav>
    `;
  }
}
customElements.define("nav-bar", NavBar);
