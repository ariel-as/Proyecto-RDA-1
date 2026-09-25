/* PLANETA FITNESS — Comportamiento del sitio y ecommerce */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  initMenu();
  initFormularios();
  initTienda();
  initCarrito();
});

/* ---------- Almacenamiento ---------- */

const CART_KEY = "fitzone_carrito";
let carrito = []; /* [{ id, cantidad }] */
let productos = [];
let categoriaActiva = "Todos";

function guardarCarrito() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(carrito));
  } catch (error) {
    /* almacenamiento no disponible: el carrito vive en memoria */
  }
}

function cargarCarrito() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY));
    carrito = Array.isArray(data) ? data : [];
  } catch (error) {
    carrito = [];
  }
}

/* ---------- Utilidades ---------- */

function formatearPrecio(valor) {
  return "$" + valor.toFixed(2).replace(".", ",");
}

function productoPorId(id) {
  return productos.find((p) => p.id === id);
}

function totalArticulos() {
  return carrito.reduce((suma, item) => suma + item.cantidad, 0);
}

function totalPedido() {
  return carrito.reduce((suma, item) => {
    const p = productoPorId(item.id);
    return suma + (p ? p.precio * item.cantidad : 0);
  }, 0);
}

function mensajeCarrito(n) {
  const label = "Carrito de compras, " + n + " producto";
  return n === 1 ? label : label + "s";
}

/* ---------- Menú móvil accesible ---------- */

function initMenu() {
  const btn = document.getElementById("menu-btn");
  const nav = document.getElementById("main-nav");
  if (!btn || !nav) {
    return;
  }

  const estaAbierto = () => btn.getAttribute("aria-expanded") === "true";

  const abrir = () => {
    nav.classList.add("nav-open");
    btn.setAttribute("aria-expanded", "true");
  };

  const cerrar = (devolverFoco) => {
    nav.classList.remove("nav-open");
    btn.setAttribute("aria-expanded", "false");
    if (devolverFoco) {
      btn.focus();
    }
  };

  btn.addEventListener("click", () => {
    if (estaAbierto()) {
      cerrar(true);
    } else {
      abrir();
    }
  });

  nav.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", () => {
      cerrar(false);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && estaAbierto()) {
      cerrar(true);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024 && estaAbierto()) {
      cerrar(false);
    }
  });
}

/* ---------- Foco y diálogos ---------- */

function crearTrampaFoco(contenedor) {
  const claves = ["button", "[href]", "input", "select", "textarea", '[tabindex]:not([tabindex="-1"])'].join(",");

  const obtenibles = () =>
    Array.prototype.filter.call(contenedor.querySelectorAll(claves), (el) =>
      !el.hasAttribute("disabled") && el.closest("[aria-hidden='true']") === null
    );

  return (e) => {
    if (e.key !== "Tab") {
      return;
    }
    const lista = obtenibles();
    if (lista.length === 0) {
      return;
    }
    const primero = lista[0];
    const ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  };
}

function bloqueaScroll(activo) {
  document.body.style.overflow = activo ? "hidden" : "";
}

/* ---------- Carrito ---------- */

let carritoItemsEl;
let carritoFooterEl;
let carritoVacioEl;
let carritoDrawerEl;
let carritoOverlayEl;
let cartTriggerEl;
let cartCountEl;
let btnFinalizarEl;
let trampaCarrito;
let trampaCheckout;

function initCarrito() {
  carritoItemsEl = document.getElementById("carrito-items");
  carritoFooterEl = document.getElementById("carrito-footer");
  carritoVacioEl = document.getElementById("carrito-vacio");
  carritoDrawerEl = document.getElementById("carrito");
  carritoOverlayEl = document.getElementById("carrito-overlay");
  cartTriggerEl = document.getElementById("cart-trigger");
  cartCountEl = document.getElementById("cart-count");
  btnFinalizarEl = document.getElementById("btn-finalizar");

  cargarCarrito();

  carritoItemsEl.addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-accion]");
    if (!boton) {
      return;
    }
    const articulo = boton.closest("article");
    const id = articulo ? articulo.dataset.id : null;
    const accion = boton.dataset.accion;
    if (!id) {
      return;
    }
    if (accion === "sumar") {
      cambiarCantidad(id, 1);
    } else if (accion === "restar") {
      cambiarCantidad(id, -1);
    } else if (accion === "eliminar") {
      eliminarProducto(id);
    }
  });

  document.getElementById("btn-vaciar").addEventListener("click", vaciarCarrito);
  document.getElementById("btn-continuar").addEventListener("click", () => {
    cerrarCarrito(false);
  });
  document.getElementById("seguir-comprando-vacio").addEventListener("click", () => {
    cerrarCarrito(false);
  });
  document.getElementById("cerrar-carrito").addEventListener("click", () => {
    cerrarCarrito(true);
  });
  cartTriggerEl.addEventListener("click", abrirCarrito);
  carritoOverlayEl.addEventListener("click", () => {
    cerrarCarrito(true);
  });
  btnFinalizarEl.addEventListener("click", () => {
    if (carrito.length === 0) {
      return;
    }
    abrirCheckout();
  });

  renderCarrito();
}

function agregarAlCarrito(id) {
  const item = carrito.find((i) => i.id === id);
  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({ id: id, cantidad: 1 });
  }
  guardarCarrito();
  renderCarrito();
  mostrarToast("Agregado al carrito: " + productoPorId(id).nombre);
}

function cambiarCantidad(id, delta) {
  const item = carrito.find((i) => i.id === id);
  if (!item) {
    return;
  }
  item.cantidad += delta;
  if (item.cantidad < 1) {
    item.cantidad = 1;
  }
  guardarCarrito();
  renderCarrito();
}

function eliminarProducto(id) {
  carrito = carrito.filter((item) => item.id !== id);
  guardarCarrito();
  renderCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  renderCarrito();
  mostrarToast("El carrito se ha vaciado");
}

function renderCarrito() {
  const hayArticulos = carrito.length > 0;
  carritoVacioEl.classList.toggle("hidden", hayArticulos);
  carritoItemsEl.classList.toggle("hidden", !hayArticulos);
  carritoFooterEl.classList.toggle("hidden", !hayArticulos);

  if (hayArticulos) {
    carritoItemsEl.innerHTML = carrito.map(lineaCarrito).join("");
  } else {
    carritoItemsEl.innerHTML = "";
  }

  const total = totalPedido();
  document.getElementById("carrito-subtotal").textContent = formatearPrecio(total);
  document.getElementById("carrito-total").textContent = formatearPrecio(total);
  document.getElementById("checkout-total").textContent = formatearPrecio(total);

  const n = totalArticulos();
  cartCountEl.textContent = String(n);
  cartTriggerEl.setAttribute("aria-label", mensajeCarrito(n));
}

function lineaCarrito(item) {
  const p = productoPorId(item.id);
  if (!p) {
    return "";
  }
  const subtotal = p.precio * item.cantidad;
  const menos = "−";
  const mas = "+";
  const equis = "✕";
  return (
    '<article class="flex gap-4" data-id="' + p.id + '">' +
      '<img class="h-20 w-20 flex-none rounded-xl object-cover" src="' + imagenProducto(p) + '" alt="' + p.descripcion + '">' +
      '<div class="flex-1">' +
        '<h3 class="text-sm font-bold text-white">' + p.nombre + '</h3>' +
        '<p class="text-sm text-muted">' + formatearPrecio(p.precio) + ' c/u</p>' +
        '<div class="mt-2 inline-flex items-center gap-1 rounded-full border border-edge px-1 py-1">' +
          '<button type="button" data-accion="restar" class="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:text-accent" aria-label="Reducir cantidad de ' + p.nombre + '">' + menos + '</button>' +
          '<span class="w-8 text-center font-bold text-white" aria-live="polite">' + item.cantidad + '</span>' +
          '<button type="button" data-accion="sumar" class="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:text-accent" aria-label="Aumentar cantidad de ' + p.nombre + '">' + mas + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="flex flex-col items-end justify-between py-1">' +
        '<button type="button" data-accion="eliminar" class="icon-btn h-10 w-10" aria-label="Eliminar ' + p.nombre + ' del carrito">' + equis + '</button>' +
        '<p class="font-extrabold text-accent">' + formatearPrecio(subtotal) + '</p>' +
      '</div>' +
    '</article>'
  );
}

function abrirCarrito() {
  carritoDrawerEl.classList.remove("translate-x-full");
  carritoDrawerEl.removeAttribute("inert");
  carritoDrawerEl.setAttribute("aria-hidden", "false");
  carritoOverlayEl.classList.remove("opacity-0", "pointer-events-none");
  carritoOverlayEl.setAttribute("aria-hidden", "false");
  cartTriggerEl.setAttribute("aria-expanded", "true");
  bloqueaScroll(true);
  document.getElementById("cerrar-carrito").focus();
  trampaCarrito = crearTrampaFoco(carritoDrawerEl);
  document.addEventListener("keydown", escCarrito);
  document.addEventListener("keydown", trampaCarrito);
}

function cerrarCarrito(devolverFoco) {
  carritoDrawerEl.classList.add("translate-x-full");
  carritoDrawerEl.setAttribute("inert", "");
  carritoDrawerEl.setAttribute("aria-hidden", "true");
  carritoOverlayEl.classList.add("opacity-0", "pointer-events-none");
  carritoOverlayEl.setAttribute("aria-hidden", "true");
  cartTriggerEl.setAttribute("aria-expanded", "false");
  bloqueaScroll(false);
  document.removeEventListener("keydown", escCarrito);
  document.removeEventListener("keydown", trampaCarrito);
  if (devolverFoco) {
    cartTriggerEl.focus();
  }
}

function escCarrito(e) {
  if (e.key === "Escape") {
    cerrarCarrito(true);
  }
}

/* ---------- Checkout ---------- */

let checkoutOverlayEl;
let checkoutFormEl;

function initCheckout() {
  checkoutOverlayEl = document.getElementById("checkout-overlay");
  checkoutFormEl = document.getElementById("checkout-form");
  trampaCheckout = crearTrampaFoco(checkoutOverlayEl);

  document.getElementById("cerrar-checkout").addEventListener("click", cerrarCheckout);
  document.getElementById("checkout-cancelar").addEventListener("click", cerrarCheckout);
  checkoutOverlayEl.addEventListener("click", (e) => {
    if (e.target === checkoutOverlayEl) {
      cerrarCheckout();
    }
  });
  inicializarFormulario("checkout-form", reglasCheckout, finalizarPedido);
}

function abrirCheckout() {
  cerrarCarrito(false);
  checkoutOverlayEl.classList.remove("hidden");
  checkoutOverlayEl.classList.add("flex");
  bloqueaScroll(true);
  document.getElementById("cliente-nombre").focus();
  document.addEventListener("keydown", escCheckout);
  document.addEventListener("keydown", trampaCheckout);
}

function cerrarCheckout() {
  checkoutOverlayEl.classList.add("hidden");
  checkoutOverlayEl.classList.remove("flex");
  bloqueaScroll(false);
  document.removeEventListener("keydown", escCheckout);
  document.removeEventListener("keydown", trampaCheckout);
  cartTriggerEl.focus();
}

function escCheckout(e) {
  if (e.key === "Escape") {
    cerrarCheckout();
  }
}

function finalizarPedido(form) {
  const total = totalPedido();
  form.reset();
  limpiarErrores(form);
  carrito = [];
  guardarCarrito();
  renderCarrito();
  cerrarCheckout();
  mostrarToast("Pedido confirmado por " + formatearPrecio(total) + ". Te contactaremos para coordinar la entrega.");
}

/* ---------- Tienda ---------- */

function initTienda() {
  productos = window.FITZONE_PRODUCTOS || [];
  renderFiltros();
  renderProductos();
}

function categoriasDisponibles() {
  const lista = [];
  productos.forEach((p) => {
    if (lista.indexOf(p.categoria) === -1) {
      lista.push(p.categoria);
    }
  });
  return lista;
}

function renderFiltros() {
  const cont = document.getElementById("filtros");
  const categorias = ["Todos"].concat(categoriasDisponibles());
  categorias.forEach((cat) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = cat;
    b.dataset.categoria = cat;
    b.setAttribute("aria-pressed", cat === categoriaActiva ? "true" : "false");
    actualizaClaseFiltro(b, cat === categoriaActiva);
    b.addEventListener("click", () => {
      seleccionarCategoria(cat);
    });
    cont.appendChild(b);
  });
}

function actualizaClaseFiltro(boton, activo) {
  if (activo) {
    boton.className = "rounded-full border border-accent bg-accent px-5 py-2.5 text-sm font-bold text-ink transition";
  } else {
    boton.className = "rounded-full border border-edge bg-surface px-5 py-2.5 text-sm font-bold text-white transition hover:border-accent hover:text-accent";
  }
}

function seleccionarCategoria(cat) {
  categoriaActiva = cat;
  document.querySelectorAll("#filtros button").forEach((b) => {
    const activo = b.dataset.categoria === cat;
    actualizaClaseFiltro(b, activo);
    b.setAttribute("aria-pressed", activo ? "true" : "false");
  });
  renderProductos();
}

function renderProductos() {
  const grid = document.getElementById("productos-grid");
  const sinResultados = document.getElementById("sin-resultados");

  const lista = categoriaActiva === "Todos"
    ? productos
    : productos.filter((p) => p.categoria === categoriaActiva);

  grid.innerHTML = "";
  sinResultados.classList.toggle("hidden", lista.length > 0);
  grid.classList.toggle("hidden", lista.length === 0);

  if (lista.length === 0) {
    return;
  }
  lista.forEach((p) => {
    grid.appendChild(tarjetaProducto(p));
  });
}

function tarjetaProducto(p) {
  const articulo = document.createElement("article");
  articulo.className = "fz-card flex flex-col overflow-hidden transition duration-200 hover:-translate-y-1";
  articulo.dataset.id = p.id;

  const etiqueta = p.etiqueta
    ? '<span class="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-extrabold uppercase text-ink">' + p.etiqueta + '</span>'
    : "";

  const precioAnterior = p.precioAnterior
    ? '<p class="text-sm text-muted line-through">' + formatearPrecio(p.precioAnterior) + '</p>'
    : "";

  articulo.innerHTML =
    '<div class="relative">' +
      '<img class="aspect-[4/3] w-full object-cover" alt="' + p.descripcion + '" src="' + imagenProducto(p) + '">' +
      etiqueta +
    '</div>' +
    '<div class="flex flex-1 flex-col p-5">' +
      '<p class="text-xs font-semibold uppercase tracking-wider text-muted">' + p.categoria + '</p>' +
      '<h3 class="mt-1 font-bold text-white">' + p.nombre + '</h3>' +
      '<div class="mt-auto flex items-baseline gap-2 pt-3">' +
        '<p class="text-lg font-extrabold text-accent">' + formatearPrecio(p.precio) + '</p>' +
        precioAnterior +
      '</div>' +
      '<button type="button" class="fz-btn fz-btn-primary mt-4 w-full" aria-label="Agregar ' + p.nombre + ' al carrito">Agregar al carrito</button>' +
    '</div>';

  articulo.querySelector("button").addEventListener("click", () => {
    agregarAlCarrito(p.id);
  });

  return articulo;
}

const coloresDeCategoria = {
  Bebidas: ["#3b82f6", "#06b6d4"],
  Suplementos: ["#facc15", "#f97316"],
  Ropa: ["#8b5cf6", "#ec4899"],
  Accesorios: ["#22d3ee", "#3b82f6"]
};

function imagenProducto(p) {
  if (p.imagen) {
    return p.imagen;
  }
  const par = coloresDeCategoria[p.categoria] || ["#facc15", "#f97316"];
  const letra = p.nombre.charAt(0).toUpperCase();
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="' + par[0] + '"/><stop offset="1" stop-color="' + par[1] + '"/>' +
      '</linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#g)"/>' +
      '<circle cx="200" cy="140" r="70" fill="rgba(255,255,255,0.12)"/>' +
      '<text x="200" y="188" font-family="Segoe UI, Arial, sans-serif" font-size="110" font-weight="900" fill="rgba(255,255,255,0.9)" text-anchor="middle">' + letra + '</text>' +
    '</svg>';
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ---------- Formularios ---------- */

function initFormularios() {
  inicializarFormulario("contacto-form", reglasContacto, (form) => {
    form.reset();
    limpiarErrores(form);
    mostrarToast("Mensaje enviado correctamente. Te contactaremos pronto.");
  });
  initCheckout();
}

function inicializarFormulario(idForm, reglas, alExito) {
  const form = document.getElementById(idForm);
  if (!form) {
    return;
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valido = true;
    reglas.forEach((r) => {
      const campo = form.querySelector("#" + r.id);
      const valor = campo.value.trim();
      const error = r.validar(valor);
      if (error) {
        valido = false;
        mostrarError(campo, error);
      } else {
        limpiarError(campo);
      }
    });
    if (valido) {
      alExito(form);
    }
  });
  form.addEventListener("input", (e) => {
    if (e.target.classList.contains("input")) {
      limpiarError(e.target);
    }
  });
}

function mostrarError(campo, mensaje) {
  const errorId = campo.getAttribute("aria-describedby");
  const errorEl = errorId ? document.getElementById(errorId) : null;
  campo.setAttribute("aria-invalid", "true");
  campo.classList.add("input-error");
  if (errorEl) {
    errorEl.textContent = mensaje;
  }
}

function limpiarError(campo) {
  const errorId = campo.getAttribute("aria-describedby");
  const errorEl = errorId ? document.getElementById(errorId) : null;
  campo.removeAttribute("aria-invalid");
  campo.classList.remove("input-error");
  if (errorEl) {
    errorEl.textContent = "";
  }
}

function limpiarErrores(form) {
  form.querySelectorAll(".input").forEach(limpiarError);
}

/* ---------- Reglas de validación ---------- */

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requerido(valor, mensaje) {
  return valor === "" ? mensaje : "";
}

function emailValido(valor) {
  return RE_EMAIL.test(valor) ? "" : "Ingresa un correo electrónico válido.";
}

const reglasContacto = [
  { id: "nombre", validar: (v) => requerido(v, "Ingresa tu nombre completo.") },
  { id: "correo", validar: (v) => requerido(v, "Ingresa tu correo electrónico.") || emailValido(v) },
  { id: "mensaje", validar: (v) => requerido(v, "Escribe tu mensaje.") }
];

const reglasCheckout = [
  { id: "cliente-nombre", validar: (v) => requerido(v, "Ingresa tu nombre completo.") },
  { id: "cliente-correo", validar: (v) => requerido(v, "Ingresa tu correo electrónico.") || emailValido(v) },
  { id: "cliente-direccion", validar: (v) => requerido(v, "Ingresa tu dirección de entrega.") }
];

/* ---------- Toast ---------- */

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  const texto = document.getElementById("toast-text");
  if (!toast || !texto) {
    return;
  }
  texto.textContent = mensaje;
  toast.classList.remove("opacity-0", "translate-y-24");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-24");
  }, 2800);
}