import { LitElement, html, css } from "https://esm.sh/lit";

export class Login extends LitElement {
  createRenderRoot() {
    return this;
  }

  handleLogout = () => {
    localStorage.removeItem("token");
    this.requestUpdate();
  };

  render() {
    const token = localStorage.getItem("token");

    return html`
      ${token
        ? html` <button
            @click=${this.handleLogout}
            class="border-3 border-[#4f772d] font-bold px-2 py-1"
          >
            CERRAR SESIÓN
          </button>`
        : html`<a href="login.html">
            <button class="border-3 border-[#4f772d] font-bold px-2 py-1">
              ENTRAR
            </button>
          </a>`}
    `;
  }
}
customElements.define("login-btn", Login);
