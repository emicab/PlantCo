import { iconoNotificacion } from "./iconoNotificacion.js";

const formularioNewsletter = document
  .getElementById("homeEmail")
  .closest("form");
const btnSubmit = document.getElementById("btn-submit");
const mensajerError = document.getElementById("inputMensajeError");

formularioNewsletter.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputEmail = document.getElementById("homeEmail");
  const email = inputEmail.value;

  if (
    !inputEmail.value.includes("@") ||
    !inputEmail.value.includes("gmail.com")
  ) {
    inputEmail.classList.add("inputError");
    mensajerError.textContent = "Email ingresado no es correcto.";
    iconoNotificacion(btnSubmit, "x", "text-red-500");

    setTimeout(() => {
      btnSubmit.textContent = "Suscribirse";
    }, 1000);
    return;
  }

  inputEmail.classList.remove("inputError");

  const suscriptores = JSON.parse(localStorage.getItem("newsletter")) || [];
  if (suscriptores.includes(email)) {
    console.log("Email ya registrado.");
    inputEmail.classList.add("inputError");
    mensajerError.textContent = "Email ya registrado.";
    iconoNotificacion(btnSubmit, "x", "text-red-500");

    setTimeout(() => {
      btnSubmit.textContent = "Suscribirse";
    }, 1000);
    return;
  }

  suscriptores.push(email);
  localStorage.setItem("newsletter", JSON.stringify(suscriptores));

  iconoNotificacion(btnSubmit, "check");
  btnSubmit.setAttribute("disabled", true);
  mensajerError.remove();

  setTimeout(() => {
    formularioNewsletter.reset();
    btnSubmit.removeAttribute("disabled");
    btnSubmit.textContent = "Suscribirse";
  }, 2000);
});
