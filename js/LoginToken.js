const tokenID = document.getElementById("tokenID");
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const token = tokenID.value.trim();

  if (!token) return;

  localStorage.setItem("token", token);
  window.location.href = "index.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  window.location.href = "index.html";
});
