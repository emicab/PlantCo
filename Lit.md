Sí. Y te propongo encararlo **como una masterclass práctica para alguien que ya sabe React/JS**, no como una introducción desde cero.

Primero una aclaración: **Lit no es exactamente “un framework de Google”**. Es una librería para construir **Web Components** mantenida por el equipo de Lit/Google y la comunidad. Su filosofía es bastante distinta a React: en lugar de construir una aplicación alrededor de un framework, construís **elementos HTML reutilizables y estándar**.

La idea central de Lit es:

> **HTML + Web Components + JavaScript reactivo, con muy poca abstracción.**

![Image](https://images.openai.com/static-rsc-4/qwU4bLYUC7OWmEFJB6tAA43zPo9WqurYIXZ8P5B5NGFWcznXiIc1kHE1QmXqeshbdxe-L6wNzcKgtiCWD2PAQSwZgDl3XaCjYaNZdBsV3q1RgdorMPpi15zo8sTtBF0cdR8wRL9Ln_vqXab5FxtwTnPtlS-sLzGCZqDKidGOWrRlAkWp_3WRzSQ_MlKbqGsY?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/35Z6P7WzL2KWblca6ORNIR7cCALJQq-bpKgv4cSuDsSZVW1ers9vEKdTQUo9Q7YTMzIq6k53ze4Q9CaLnW-mCpeUlwyve0RYhhJLVAhU6aK4cgBFeojCY5PBn5ShDXpLMyD-R5Q1RX0QUqcQepkS0_KGb6xjaPjtfjLYIqssOH8Q45MVe5wOh259mZbcCzwo?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/5he6B25jVhtX4O4EC7v3ARaCVOQHVK1bHWzaF0KqR03v8-W-V8_2yXeeBrlvLiOnmfW9d7OSmLrXHNRdJQNc7uqj1vtnk_0X2k9Oci5XBbufkbdc5UsctEAI1dSIU6QS6FMmGHmx74da6MNswlsdFvJEwFmXaSQ__o65kMwao0iRxo3qnz7xz2uO0Fl6K5b-?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/xcuul9U0On_pMkNsvB-IDXC1Dno0x0YlGffTBvlpnTjf0y6Ye3uEmDhDp1s_Hlpdg8FWde-PbzbJYVzWclHMxnz_8T6pVKexDnHxcYUQ0ktU6AU1ZEK0N0e8zMkJjXykBJYfXUdsJNMn-5CiyvT7vRJCRt9An7H02mNS29zFue4a2253n4-qOUHDNrbiHUJr?purpose=fullsize)

# Masterclass de Lit

Vamos a recorrer:

1. Qué problema resuelve Lit
2. Lit vs React
3. Web Components y Custom Elements
4. Tu primer componente
5. Templates con `html`
6. Estado y propiedades reactivas
7. Eventos
8. Slots
9. Ciclo de vida
10. Renderizado condicional
11. Listas
12. Comunicación entre componentes
13. Formularios
14. Fetch/API
15. CSS encapsulado
16. Reactividad avanzada
17. Arquitectura de una app Lit
18. Lit + TypeScript
19. Lit + backend
20. Cómo pensar en Lit viniendo de React
21. Cuándo usarlo y cuándo NO
22. Proyecto final

---

# 1. Primero: ¿qué carajo es Lit?

Supongamos que tenemos:

```html
<button>Comprar</button>
```

En React normalmente pensarías:

```jsx
function BuyButton() {
  return <button>Comprar</button>;
}
```

Y React se encarga de transformar ese componente en DOM.

Con Lit podés crear literalmente un nuevo elemento HTML:

```html
<buy-button></buy-button>
```

Y definir qué significa:

```js
class BuyButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <button>Comprar</button>
    `;
  }
}

customElements.define("buy-button", BuyButton);
```

Eso **ya es un Web Component**.

Lit simplemente hace que construir estos componentes sea mucho más cómodo.

---

# 2. ¿Qué problema intenta resolver Lit?

Los Web Components nativos son poderosos, pero escribirlos directamente puede ser bastante incómodo.

Por ejemplo:

```js
class Counter extends HTMLElement {
  constructor() {
    super();

    this.count = 0;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <button id="decrease">-</button>
      <span>${this.count}</span>
      <button id="increase">+</button>
    `;

    this.querySelector("#increase").addEventListener("click", () => {
      this.count++;
      this.render();
    });

    this.querySelector("#decrease").addEventListener("click", () => {
      this.count--;
      this.render();
    });
  }
}
```

Funciona.

Pero empezás a tener problemas:

- recreás DOM constantemente
- tenés que manejar eventos manualmente
- propiedades y atributos requieren trabajo
- lifecycle manual
- templates incómodos
- actualización del DOM manual

Lit te da una capa encima de Web Components.

---

# 3. La idea fundamental de Lit

Un componente Lit normalmente se ve así:

```ts
import { LitElement, html } from "lit";

class Counter extends LitElement {
  count = 0;

  render() {
    return html`
      <button @click=${this.decrement}>-</button>

      <span>${this.count}</span>

      <button @click=${this.increment}>+</button>
    `;
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}

customElements.define("my-counter", Counter);
```

Y después:

```html
<my-counter></my-counter>
```

Eso es lo interesante.

---

# 4. Si venís de React, pensalo así

React:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

Lit:

```ts
class Counter extends LitElement {
  @state()
  private count = 0;

  render() {
    return html` <button @click=${() => this.count++}>${this.count}</button> `;
  }
}
```

La diferencia conceptual importante:

### React

Pensás:

> "Tengo componentes React dentro de una aplicación React."

### Lit

Pensás:

> "Tengo elementos HTML personalizados."

Eso cambia bastante la arquitectura.

---

# 5. Web Components: la base de todo

Lit está construido alrededor de tres tecnologías del navegador:

### Custom Elements

Permiten crear:

```html
<my-button></my-button>
```

### Shadow DOM

Permite encapsular:

```html
<style>
  button {
    color: red;
  }
</style>
```

para que esos estilos no contaminen toda la aplicación.

### HTML Templates

Permiten crear estructuras HTML reutilizables.

Lit agrega:

- templates declarativos
- reactividad
- binding
- lifecycle
- directives
- TypeScript friendly
- actualización eficiente del DOM

---

# 6. Instalación

Proyecto Vite:

```bash
npm create vite@latest lit-demo
```

Elegís:

```text
TypeScript
```

Después:

```bash
cd lit-demo
npm install
npm install lit
npm run dev
```

---

# 7. Tu primer componente Lit

Creemos:

```text
src/
├── components/
│   └── hello-world.ts
└── main.ts
```

`hello-world.ts`:

```ts
import { LitElement, html } from "lit";

export class HelloWorld extends LitElement {
  render() {
    return html` <h1>Hello Lit</h1> `;
  }
}

customElements.define("hello-world", HelloWorld);
```

Y:

```ts
import "./components/hello-world";
```

En HTML:

```html
<hello-world></hello-world>
```

Listo.

Acabás de crear un nuevo elemento HTML.

---

# 8. `html`

Una de las cosas que más vas a usar:

```ts
html` <h1>Hello</h1> `;
```

Esto **no es simplemente un string**.

Lit interpreta este template y puede actualizar solamente las partes necesarias cuando cambian los datos.

Por ejemplo:

```ts
render() {
  return html`
    <h1>${this.name}</h1>
  `;
}
```

---

# 9. Interpolación

Muy parecido a JSX:

```ts
render() {
  return html`
    <h1>Hola ${this.name}</h1>
  `;
}
```

Si:

```ts
name = "Emiliano";
```

obtendrás:

```html
<h1>Hola Emiliano</h1>
```

---

# 10. Estado

Acá aparece una diferencia importante con React.

En Lit podés tener:

```ts
count = 0;
```

Pero eso **no necesariamente hace que el componente se vuelva reactivo**.

Para decirle a Lit:

> "Cuando cambie esta propiedad, quiero volver a renderizar"

usás propiedades reactivas.

Con decorators:

```ts
@property()
name = '';
```

o:

```ts
@state()
private count = 0;
```

---

# 11. `@property`

Las propiedades públicas normalmente utilizan:

```ts
@property()
name = '';
```

Ejemplo:

```ts
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";

class UserCard extends LitElement {
  @property()
  name = "";

  render() {
    return html`
      <article>
        <h2>${this.name}</h2>
      </article>
    `;
  }
}

customElements.define("user-card", UserCard);
```

Ahora:

```html
<user-card name="Emiliano"></user-card>
```

---

# 12. `@state`

Para estado interno:

```ts
@state()
private count = 0;
```

La diferencia conceptual:

```text
@property()
    ↓
API pública del componente

@state()
    ↓
estado interno
```

Por ejemplo:

```ts
@state()
private isOpen = false;
```

El usuario del componente no debería tener que manipularlo directamente.

---

# 13. Reactividad

Este concepto es fundamental.

Si tenemos:

```ts
@state()
count = 0;
```

y hacemos:

```ts
this.count++;
```

Lit detecta el cambio y vuelve a evaluar el template.

```ts
render() {
  return html`
    <p>${this.count}</p>
  `;
}
```

No necesitás:

```js
setState();
```

como en React.

---

# 14. Eventos

Acá Lit se pone interesante.

En React:

```jsx
<button onClick={this.handleClick}>
```

Lit:

```ts
<button @click=${this.handleClick}>
```

Ejemplo:

```ts
handleClick() {
  this.count++;
}

render() {
  return html`
    <button @click=${this.handleClick}>
      ${this.count}
    </button>
  `;
}
```

---

# 15. ¿Qué significa `@click`?

Esto:

```html
@click=${this.handleClick}
```

es syntax de Lit para:

> "Escuchá el evento `click` y ejecutá esta función."

También:

```html
@input=${this.handleInput} @change=${this.handleChange}
@submit=${this.handleSubmit} @keydown=${this.handleKeyDown}
```

---

# 16. Pasar parámetros

Podés hacer:

```ts
@click=${() => this.removeItem(item.id)}
```

Por ejemplo:

```ts
render() {
  return html`
    <button @click=${() => this.removeItem(42)}>
      Eliminar
    </button>
  `;
}
```

---

# 17. Binding de propiedades

Acá aparece una diferencia importante.

Si escribís:

```html
<input value="${this.name}" />
```

estás trabajando con atributos/strings.

Para bindear una **propiedad real del elemento**, Lit utiliza `.`:

```html
<input .value="${this.name}" />
```

Por ejemplo:

```ts
<input
  .value=${this.name}
  @input=${this.handleInput}
/>
```

Esto es MUY importante.

---

# 18. Atributos vs propiedades

HTML:

```html
<input value="hola" />
```

tiene un atributo:

```text
value="hola"
```

Pero el DOM tiene una propiedad:

```js
input.value;
```

Lit permite distinguirlas:

```html
value=${this.name}
```

vs:

```html
.value=${this.name}
```

Regla mental:

```text
value=       → atributo

.value=      → propiedad JS
```

---

# 19. Booleanos

Supongamos:

```ts
@state()
disabled = true;
```

En Lit:

```html
<button ?disabled="${this.disabled}"></button>
```

El `?` significa:

> agregar/quitar atributo booleano.

Entonces:

```html
?disabled=${true}
```

produce:

```html
<button disabled></button>
```

y:

```html
?disabled=${false}
```

lo elimina.

---

# 20. Clases

Podés hacer:

```html
<div class=${this.active ? 'active' : ''}>
```

Pero Lit tiene herramientas más sofisticadas para esto.

Por ejemplo:

```ts
import { classMap } from "lit/directives/class-map.js";
```

Y:

```ts
const classes = {
  active: this.active,
  disabled: this.disabled,
};
```

Después:

```html
<div class="${classMap(classes)}"></div>
```

---

# 21. Renderizado condicional

React:

```jsx
{
  isLoggedIn && <Dashboard />;
}
```

Lit:

```ts
${this.isLoggedIn
  ? html`<dashboard-view></dashboard-view>`
  : html`<login-view></login-view>`
}
```

Muy parecido conceptualmente.

---

# 22. Listas

React:

```jsx
users.map((user) => <UserCard user={user} />);
```

Lit:

```ts
${this.users.map(user => html`
  <user-card .user=${user}></user-card>
`)}
```

Ejemplo:

```ts
@state()
users = [
  { id: 1, name: 'Emiliano' },
  { id: 2, name: 'Juan' }
];
```

Y:

```ts
render() {
  return html`
    ${this.users.map(user => html`
      <article>
        ${user.name}
      </article>
    `)}
  `;
}
```

---

# 23. `repeat`

Para listas grandes existe una directive muy útil:

```ts
import { repeat } from "lit/directives/repeat.js";
```

Después:

```ts
${repeat(
  this.users,
  user => user.id,
  user => html`
    <user-card .user=${user}></user-card>
  `
)}
```

La clave:

```ts
(user) => user.id;
```

es el identificador estable.

Conceptualmente parecido a:

```jsx
{
  users.map((user) => <UserCard key={user.id} />);
}
```

---

# 24. Slots

Acá Lit empieza a separarse mucho de React.

Un Web Component puede tener:

```html
<my-card>
  <h2 slot="title">Producto</h2>

  <p>Descripción del producto</p>
</my-card>
```

Dentro del componente:

```html
<div>
  <header>
    <slot name="title"></slot>
  </header>

  <main>
    <slot></slot>
  </main>
</div>
```

Esto permite crear componentes altamente reutilizables.

---

# 25. Pensá en esto para Bedu

Por ejemplo:

```html
<bedu-product-card product-name="Campera" price="89990"> </bedu-product-card>
```

Pero podrías permitir:

```html
<bedu-product-card>
  <img slot="image" src="campera.jpg" />

  <div slot="actions">
    <button>Comprar</button>
    <button>Agregar</button>
  </div>
</bedu-product-card>
```

El componente controla la estructura.

El consumidor controla partes del contenido.

---

# 26. Shadow DOM

Una de las cosas más interesantes.

Lit usa Shadow DOM por defecto.

Por ejemplo:

```ts
static styles = css`
  button {
    background: black;
    color: white;
  }
`;
```

Ese CSS queda encapsulado.

Si afuera tenés:

```css
button {
  background: red;
}
```

no necesariamente va a destruir tu componente.

Esto es enorme para construir:

- design systems
- componentes embebibles
- widgets
- librerías UI
- componentes para múltiples frameworks

---

# 27. CSS en Lit

Importás:

```ts
import { css } from "lit";
```

Después:

```ts
static styles = css`
  :host {
    display: block;
  }

  button {
    padding: 10px 20px;
  }
`;
```

Y:

```ts
render() {
  return html`
    <button>Comprar</button>
  `;
}
```

---

# 28. `:host`

Esto:

```css
:host {
  display: block;
}
```

se refiere al propio componente:

```html
<my-card></my-card>
```

Es decir:

```text
:host
   ↓
<my-card>
```

---

# 29. Lifecycle

Acá vas a encontrar equivalentes conceptuales a React.

Lit tiene:

```text
constructor()
connectedCallback()
disconnectedCallback()

willUpdate()
update()
updated()

firstUpdated()
render()
```

El más importante para empezar:

```ts
firstUpdated() {}
```

Se ejecuta después de la primera actualización/render.

---

# 30. `connectedCallback`

Pertenece a Web Components:

```ts
connectedCallback() {
  super.connectedCallback();

  console.log('componente agregado al DOM');
}
```

Equivalente conceptual a:

```jsx
useEffect(() => {
   ...
}, []);
```

pero **no es exactamente lo mismo**.

---

# 31. `updated`

Podés detectar cambios:

```ts
updated(changedProperties: Map<string, unknown>) {

  if (changedProperties.has('user')) {
    console.log('user cambió');
  }
}
```

Esto puede recordarte a:

```jsx
useEffect(() => {
   ...
}, [user]);
```

Pero nuevamente:

> no pienses que Lit está copiando React.

Son modelos distintos.

---

# 32. Fetch

Podés hacer:

```ts
async connectedCallback() {
  super.connectedCallback();

  const response = await fetch('/api/products');

  this.products = await response.json();
}
```

Pero normalmente conviene manejarlo mejor con lifecycle/state.

Por ejemplo:

```ts
@state()
products = [];

@state()
loading = true;

async firstUpdated() {

  const response = await fetch('/api/products');

  this.products = await response.json();

  this.loading = false;
}
```

Y:

```ts
render() {

  if (this.loading) {
    return html`
      <p>Cargando...</p>
    `;
  }

  return html`
    ${this.products.map(product => html`
      <p>${product.name}</p>
    `)}
  `;
}
```

---

# 33. Loading / error / data

Una arquitectura típica:

```ts
@state()
status: 'loading' | 'success' | 'error' = 'loading';

@state()
products = [];
```

Render:

```ts
render() {

  if (this.status === 'loading') {
    return html`<loading-spinner></loading-spinner>`;
  }

  if (this.status === 'error') {
    return html`<error-message></error-message>`;
  }

  return html`
    <product-list .products=${this.products}></product-list>
  `;
}
```

Esto te debería resultar muy familiar si venís de React.

---

# 34. Comunicación padre → hijo

Supongamos:

```html
<product-card .product="${product}"></product-card>
```

El hijo:

```ts
@property()
product;
```

Esto es:

```text
Parent
   ↓
property
   ↓
Child
```

Muy parecido a props.

---

# 35. Comunicación hijo → padre

Acá viene algo fundamental:

**Custom Events.**

El hijo puede hacer:

```ts
this.dispatchEvent(
  new CustomEvent("product-selected", {
    detail: this.product,
  }),
);
```

El padre:

```html
<product-card @product-selected="${this.handleProductSelected}"></product-card>
```

Y:

```ts
handleProductSelected(event: CustomEvent) {
  console.log(event.detail);
}
```

---

# 36. Esto reemplaza muchas cosas que harías con callbacks

React:

```jsx
<ProductCard onSelect={handleSelect} />
```

Lit:

```html
<product-card @product-selected="${this.handleSelect}"></product-card>
```

Y el hijo emite:

```ts
this.dispatchEvent(
  new CustomEvent("product-selected", {
    detail: product,
  }),
);
```

Esto es una de las razones por las que Lit es tan interesante para **componentes independientes del framework**.

---

# 37. Un componente realmente reutilizable

Podrías crear:

```html
<bedu-product-card></bedu-product-card>
```

Y ese componente podría funcionar dentro de:

```text
React
Vue
Angular
Svelte
Next.js
HTML puro
WordPress
Shopify
```

Porque el navegador entiende:

```html
<bedu-product-card></bedu-product-card>
```

No necesita entender React.

**Ese es uno de los grandes motivos para aprender Lit.**

---

# 38. Lit + React

Podés usar Web Components dentro de React.

Por ejemplo:

```jsx
<bedu-product-card product={product} />
```

Pero dependiendo de la versión/configuración de React, el manejo de propiedades complejas y eventos custom requiere atención.

Por eso existen wrappers/adapters para ciertos ecosistemas.

La idea importante es:

```text
Lit
 ↓
Web Component estándar
 ↓
React puede consumirlo
Vue puede consumirlo
Angular puede consumirlo
HTML puede consumirlo
```

---

# 39. Lit vs React

| Concepto                      | React                 | Lit                      |
| ----------------------------- | --------------------- | ------------------------ |
| Unidad                        | Component             | Web Component            |
| DOM                           | Abstracción propia    | DOM real                 |
| JSX                           | Sí                    | No                       |
| Templates                     | JSX                   | `html`` `                |
| Estado                        | useState              | Reactive properties      |
| Eventos                       | props/callbacks       | Custom Events            |
| CSS                           | externo/soluciones    | Shadow DOM               |
| Runtime                       | React                 | pequeño runtime          |
| Interoperabilidad             | React ecosystem       | Web platform             |
| Routing                       | React Router/Next/etc | externo                  |
| Estado global                 | Zustand/etc           | externo                  |
| SSR                           | ecosistema React      | posible con herramientas |
| Reutilización cross-framework | limitada              | excelente                |

---

# 40. La pregunta importante: ¿Lit reemplaza React?

No.

Son herramientas con objetivos diferentes.

React es especialmente fuerte para construir:

```text
Aplicaciones completas
↓
routing
estado
ecosistema
SSR
frameworks
Next.js
etc.
```

Lit es especialmente fuerte para:

```text
Componentes
↓
Web Components
↓
Design Systems
↓
Widgets
↓
embeddables
↓
microfrontends
↓
framework agnostic UI
```

---

# 41. El caso de uso que me interesa para vos

Por tu perfil, hay algo particularmente interesante.

Podrías construir una librería:

```text
@bedu/components
```

con:

```html
<bedu-product-card>
  <bedu-live-card>
    <bedu-cart>
      <bedu-checkout>
        <bedu-price>
          <bedu-button>
            <bedu-modal>
              <bedu-live-player></bedu-live-player></bedu-modal></bedu-button></bedu-price></bedu-checkout></bedu-cart></bedu-live-card
></bedu-product-card>
```

Y esos componentes podrían ser utilizados independientemente del frontend.

Por ejemplo:

```html
<script type="module" src="https://cdn.bedu.com/components.js"></script>

<bedu-product-card product-id="123"> </bedu-product-card>
```

Una empresa podría ponerlo en:

```text
WordPress
Shopify
HTML
React
Vue
Next.js
```

sin instalar toda tu aplicación.

Eso es **muy potente comercialmente**.

---

# 42. Arquitectura de un componente real

Por ejemplo:

```text
bedu-product-card
│
├── properties
│   ├── product
│   ├── currency
│   └── loading
│
├── state
│   ├── quantity
│   └── added
│
├── events
│   ├── add-to-cart
│   └── product-click
│
├── styles
│
└── template
```

Código simplificado:

```ts
@customElement("bedu-product-card")
export class BeduProductCard extends LitElement {
  @property({ type: Object })
  product!: Product;

  @state()
  quantity = 1;

  static styles = css`
    :host {
      display: block;
    }

    .card {
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 16px;
    }
  `;

  render() {
    return html`
      <article class="card">
        <img src=${this.product.image} alt=${this.product.name} />

        <h2>${this.product.name}</h2>

        <strong> $${this.product.price} </strong>

        <button @click=${this.addToCart}>Agregar</button>
      </article>
    `;
  }

  addToCart() {
    this.dispatchEvent(
      new CustomEvent("add-to-cart", {
        detail: {
          product: this.product,
          quantity: this.quantity,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
```

Esto ya empieza a parecer un componente de producción.

---

# 43. `bubbles` y `composed`

Este detalle es muy importante cuando trabajás con Shadow DOM.

```ts
new CustomEvent("add-to-cart", {
  bubbles: true,
  composed: true,
});
```

### `bubbles`

Permite que el evento suba por el DOM.

### `composed`

Permite que atraviese el Shadow DOM.

Entonces:

```text
bedu-product-card
      ↓
Shadow DOM
      ↓
Custom Event
      ↓
parent
```

Puede propagarse correctamente.

---

# 44. Directives

Lit tiene un concepto muy interesante:

```text
Directives
```

Son funciones especiales que modifican cómo se renderiza una expresión.

Algunas conocidas:

```text
repeat
classMap
styleMap
ifDefined
when
until
cache
unsafeHTML
```

Por ejemplo:

```ts
import { when } from "lit/directives/when.js";
```

Y:

```ts
${when(
  this.loggedIn,
  () => html`<dashboard-view></dashboard-view>`,
  () => html`<login-view></login-view>`
)}
```

---

# 45. `until`

Muy interesante para async.

Podés hacer algo conceptualmente como:

```ts
until(promise, html`<loading-spinner></loading-spinner>`);
```

Mientras la promesa no termina:

```text
Loading...
```

Después:

```text
resultado
```

---

# 46. Seguridad

Ojo con esto:

```ts
unsafeHTML(...)
```

Es equivalente a decir:

> "Confío en este HTML."

Si hacés:

```ts
unsafeHTML(userInput);
```

podés abrir una puerta a XSS.

Regla:

```text
HTML generado por usuario
        ↓
NO unsafeHTML
```

Lit escapa contenido interpolado normalmente:

```ts
html` <p>${userInput}</p> `;
```

Eso es mucho más seguro.

---

# 47. TypeScript

Lit + TypeScript es una combinación excelente.

Podés definir:

```ts
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}
```

Después:

```ts
@property({ type: Object })
product!: Product;
```

Y:

```ts
@state()
products: Product[] = [];
```

Esto te da una arquitectura mucho más sólida.

---

# 48. Decorators

Probablemente vas a ver:

```ts
@customElement("my-component")
export class MyComponent extends LitElement {}
```

en lugar de:

```ts
customElements.define("my-component", MyComponent);
```

Y:

```ts
@property()
name = '';
```

en lugar de registrar manualmente propiedades.

Es una de las razones por las que Lit + TypeScript queda bastante limpio.

---

# 49. `@customElement`

Esto:

```ts
@customElement("my-button")
export class MyButton extends LitElement {}
```

automáticamente registra:

```html
<my-button></my-button>
```

---

# 50. Una arquitectura Lit profesional

Para una aplicación mediana:

```text
src/
│
├── components/
│   ├── ui/
│   │   ├── button.ts
│   │   ├── modal.ts
│   │   └── input.ts
│   │
│   ├── products/
│   │   ├── product-card.ts
│   │   └── product-list.ts
│   │
│   └── cart/
│       ├── cart.ts
│       └── cart-item.ts
│
├── pages/
│
├── services/
│   ├── api.ts
│   └── auth.ts
│
├── state/
│
├── types/
│
└── main.ts
```

No necesitás convertir todo en un gigantesco componente.

---

# 51. Estado global

Acá Lit no intenta resolver absolutamente todo.

Podés usar:

```text
Context API
Signals
stores
Redux
Zustand
MobX
etc.
```

Dependiendo del proyecto.

Para aplicaciones complejas, separar:

```text
UI state
        ↓
application state
        ↓
server state
```

sigue siendo importante.

---

# 52. Router

Lit no tiene la misma filosofía de "framework completo" que Next.js.

Podés utilizar soluciones de routing del ecosistema Lit/Web Components.

Pero esto te muestra otra diferencia:

```text
React/Next
    ↓
framework ecosystem

Lit
    ↓
web platform
```

---

# 53. SSR

Lit también puede utilizarse con rendering del lado servidor.

Esto es importante si querés:

```text
SEO
performance
HTML inicial
```

Pero nuevamente:

> Lit no pretende ser Next.js.

Hay que sumar las herramientas necesarias según el proyecto.

---

# 54. ¿Entonces para qué aprender Lit si ya sabés React?

Porque te enseña algo que React abstrae bastante:

# La plataforma web.

Vas a entender mucho mejor:

```text
Custom Elements
Shadow DOM
DOM
events
attributes
properties
slots
custom events
HTML
CSS encapsulation
```

Y eso te vuelve mejor frontend developer incluso si después seguís usando React.

---

# 55. Una analogía

Pensalo así:

### React

Es como construir una casa utilizando un sistema completo de construcción.

Tenés:

```text
React
React Router
Next
libraries
ecosystem
```

### Lit

Es más parecido a fabricar piezas estándar para construcción.

Creás:

```html
<my-button>
  <my-modal>
    <my-calendar> <my-product-card></my-product-card></my-calendar></my-modal
></my-button>
```

y esas piezas pueden utilizarse prácticamente en cualquier casa.

---

# 56. Proyecto final de la masterclass

Te propongo que aprendamos Lit construyendo algo que realmente te sirva:

## `Bedu Components`

Una mini librería de Web Components.

Primero:

```html
<bedu-button></bedu-button>
```

Después:

```html
<bedu-product-card></bedu-product-card>
```

Después:

```html
<bedu-cart></bedu-cart>
```

Después:

```html
<bedu-live-card></bedu-live-card>
```

Finalmente:

```html
<bedu-checkout></bedu-checkout>
```

Y terminamos consumiéndola desde:

```text
HTML puro
      ↓
React
      ↓
Next.js
```

Ahí vas a entender **por qué existe Lit**, no solamente su sintaxis.

---

# 57. El mapa mental que quiero que te quede

Si mañana te preguntan:

> "¿Qué es Lit?"

La respuesta debería ser algo así:

> **Lit es una librería para construir Web Components de forma declarativa y reactiva. Se apoya en APIs estándar del navegador como Custom Elements y Shadow DOM, y permite crear componentes reutilizables que pueden consumirse independientemente de un framework como React o Vue.**

Y mentalmente:

```text
                    LIT
                     │
          ┌──────────┴──────────┐
          │                     │
     Web Platform          Reactivity
          │                     │
   ┌──────┼──────┐              │
   │      │      │              │
Custom  Shadow  Slots       Properties
Elements DOM                  │
   │                           │
   └──────────┬────────────────┘
              │
          html`...`
              │
          Components
              │
       ┌──────┼───────┐
       │      │       │
      UI    Events   State
       │      │       │
       └──────┼───────┘
              │
       Framework agnostic
```

## Y acá está lo verdaderamente importante para vos

**No estudiaría Lit como "otro framework para hacer aplicaciones".**

Eso te haría competir mentalmente:

```text
React vs Lit
```

y probablemente no sea la forma más útil de verlo.

Lo estudiaría como:

```text
React
  ↓
sé construir aplicaciones

Lit
  ↓
aprendo a construir componentes web estándar
```

Y especialmente teniendo experiencia con React, **Lit te puede resultar bastante fácil de aprender**. Lo difícil no va a ser la sintaxis; lo interesante va a ser cambiar el modelo mental de _"componente React"_ a _"elemento HTML autónomo"_.

La documentación oficial de Lit es la referencia principal para profundizar en estos conceptos. La búsqueda web no me devolvió correctamente sus páginas oficiales en esta consulta, así que no te voy a inventar enlaces ni atribuirles contenido que no pude verificar.
