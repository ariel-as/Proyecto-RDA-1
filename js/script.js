/* FITZONE — Comportamiento del sitio y ecommerce */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  initMenu();
  initFormularios();
  initTienda();
  initCarrito();
});

/* ---------- Almacenamiento ---------- */

var CART_KEY = "fitzone_carrito";
var carrito = []; /* [{ id, cantidad }] */
var productos = [];
var categoriaActiva = "Todos";

function guardarCarrito() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(carrito));
  } catch (error) {
    /* almacenamiento no disponible: el carrito vive en memoria */
  }
}

function cargarCarrito() {
  try {
    var data = JSON.parse(localStorage.getItem(CART_KEY));
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
  return productos.find(function (p) {
    return p.id === id;
  });
}

function totalArticulos() {
  return carrito.reduce(function (suma, item) {
    return suma + item.cantidad;
  }, 0);
}

function totalPedido() {
  return carrito.reduce(function (suma, item) {
    var p = productoPorId(item.id);
    return suma + (p ? p.precio * item.cantidad : 0);
  }, 0);
}

function mensajeCarrito(n) {
  var label = "Carrito de compras, " + n + " producto";
  return n === 1 ? label : label + "s";
}

/* ---------- Menú móvil accesible ---------- */

function initMenu() {
  var btn = document.getElementById("menu-btn");
  var nav = document.getElementById("main-nav");
  if (!btn || !nav) {
    return;
  }

  function estaAbierto() {
    return btn.getAttribute("aria-expanded") === "true";
  }

  function abrir() {
    nav.classList.add("nav-open");
    btn.setAttribute("aria-expanded", "true");
  }

  function cerrar(devolverFoco) {
    nav.classList.remove("nav-open");
    btn.setAttribute("aria-expanded", "false");
    if (devolverFoco) {
      btn.focus();
    }
  }

  btn.addEventListener("click", function () {
    if (estaAbierto()) {
      cerrar(true);
    } else {
      abrir();
    }
  });

  nav.querySelectorAll("a, button").forEach(function (el) {
    el.addEventListener("click", function () {
      cerrar(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && estaAbierto()) {
      cerrar(true);
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024 && estaAbierto()) {
      cerrar(false);
    }
  });
}

/* ---------- Foco y diálogos ---------- */

function crearTrampaFoco(contenedor) {
  var claves = ["button", "[href]", "input", "select", "textarea", '[tabindex]:not([tabindex="-1"])'].join(",");

  function obtenibles() {
    return Array.prototype.filter.call(contenedor.querySelectorAll(claves), function (el) {
      return !el.hasAttribute("disabled") && el.closest("[aria-hidden='true']") === null;
    });
  }

  return function (e) {
    if (e.key !== "Tab") {
      return;
    }
    var lista = obtenibles();
    if (lista.length === 0) {
      return;
    }
    var primero = lista[0];
    var ultimo = lista[lista.length - 1];
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

var carritoItemsEl;
var carritoFooterEl;
var carritoVacioEl;
var carritoDrawerEl;
var carritoOverlayEl;
var cartTriggerEl;
var cartCountEl;
var btnFinalizarEl;
var trampaCarrito;
var trampaCheckout;

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

  carritoItemsEl.addEventListener("click", function (e) {
    var boton = e.target.closest("button[data-accion]");
    if (!boton) {
      return;
    }
    var articulo = boton.closest("article");
    var id = articulo ? articulo.dataset.id : null;
    var accion = boton.dataset.accion;
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
  document.getElementById("btn-continuar").addEventListener("click", function () {
    cerrarCarrito(false);
  });
  document.getElementById("seguir-comprando-vacio").addEventListener("click", function () {
    cerrarCarrito(false);
  });
  document.getElementById("cerrar-carrito").addEventListener("click", function () {
    cerrarCarrito(true);
  });
  cartTriggerEl.addEventListener("click", function () {
    abrirCarrito();
  });
  carritoOverlayEl.addEventListener("click", function () {
    cerrarCarrito(true);
  });
  btnFinalizarEl.addEventListener("click", function () {
    if (carrito.length === 0) {
      return;
    }
    abrirCheckout();
  });

  renderCarrito();
}

function agregarAlCarrito(id) {
  var item = carrito.find(function (i) {
    return i.id === id;
  });
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
  var item = carrito.find(function (i) {
    return i.id === id;
  });
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
  carrito = carrito.filter(function (item) {
    return item.id !== id;
  });
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
  var hayArticulos = carrito.length > 0;
  carritoVacioEl.classList.toggle("hidden", hayArticulos);
  carritoItemsEl.classList.toggle("hidden", !hayArticulos);
  carritoFooterEl.classList.toggle("hidden", !hayArticulos);

  if (hayArticulos) {
    carritoItemsEl.innerHTML = carrito.map(lineaCarrito).join("");
  } else {
    carritoItemsEl.innerHTML = "";
  }

  var total = totalPedido();
  document.getElementById("carrito-subtotal").textContent = formatearPrecio(total);
  document.getElementById("carrito-total").textContent = formatearPrecio(total);
  document.getElementById("checkout-total").textContent = formatearPrecio(total);

  var n = totalArticulos();
  cartCountEl.textContent = String(n);
  cartTriggerEl.setAttribute("aria-label", mensajeCarrito(n));
}

function lineaCarrito(item) {
  var p = productoPorId(item.id);
  if (!p) {
    return "";
  }
  var subtotal = p.precio * item.cantidad;
  var menos = "−";
  var mas = "+";
  var equis = "✕";
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

var checkoutOverlayEl;
var checkoutFormEl;

function initCheckout() {
  checkoutOverlayEl = document.getElementById("checkout-overlay");
  checkoutFormEl = document.getElementById("checkout-form");
  trampaCheckout = crearTrampaFoco(checkoutOverlayEl);

  document.getElementById("cerrar-checkout").addEventListener("click", cerrarCheckout);
  document.getElementById("checkout-cancelar").addEventListener("click", cerrarCheckout);
  checkoutOverlayEl.addEventListener("click", function (e) {
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
  var total = totalPedido();
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
  var lista = [];
  productos.forEach(function (p) {
    if (lista.indexOf(p.categoria) === -1) {
      lista.push(p.categoria);
    }
  });
  return lista;
}

function renderFiltros() {
  var cont = document.getElementById("filtros");
  var categorias = ["Todos"].concat(categoriasDisponibles());
  categorias.forEach(function (cat) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = cat;
    b.dataset.categoria = cat;
    b.setAttribute("aria-pressed", cat === categoriaActiva ? "true" : "false");
    actualizaClaseFiltro(b, cat === categoriaActiva);
    b.addEventListener("click", function () {
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
  document.querySelectorAll("#filtros button").forEach(function (b) {
    var activo = b.dataset.categoria === cat;
    actualizaClaseFiltro(b, activo);
    b.setAttribute("aria-pressed", activo ? "true" : "false");
  });
  renderProductos();
}

function renderProductos() {
  var grid = document.getElementById("productos-grid");
  var sinResultados = document.getElementById("sin-resultados");

  var lista = categoriaActiva === "Todos"
    ? productos
    : productos.filter(function (p) {
        return p.categoria === categoriaActiva;
      });

  grid.innerHTML = "";
  sinResultados.classList.toggle("hidden", lista.length > 0);
  grid.classList.toggle("hidden", lista.length === 0);

  if (lista.length === 0) {
    return;
  }
  lista.forEach(function (p) {
    grid.appendChild(tarjetaProducto(p));
  });
}

function tarjetaProducto(p) {
  var articulo = document.createElement("article");
  articulo.className = "fz-card flex flex-col overflow-hidden transition duration-200 hover:-translate-y-1";
  articulo.dataset.id = p.id;

  var etiqueta = "";
  if (p.etiqueta) {
    etiqueta = '<span class="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-extrabold uppercase text-ink">' + p.etiqueta + '</span>';
  }

  var precioAnterior = "";
  if (p.precioAnterior) {
    precioAnterior = '<p class="text-sm text-muted line-through">' + formatearPrecio(p.precioAnterior) + '</p>';
  }

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

  articulo.querySelector("button").addEventListener("click", function () {
    agregarAlCarrito(p.id);
  });

  return articulo;
}

var coloresDeCategoria = {
  Bebidas: ["#3b82f6", "#06b6d4"],
  Suplementos: ["#facc15", "#f97316"],
  Ropa: ["#8b5cf6", "#ec4899"],
  Accesorios: ["#22d3ee", "#3b82f6"]
};

function imagenProducto(p) {
  var par = coloresDeCategoria[p.categoria] || ["#facc15", "#f97316"];
  var letra = p.nombre.charAt(0).toUpperCase();
  var svg =
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
  inicializarFormulario("contacto-form", reglasContacto, function (form) {
    form.reset();
    limpiarErrores(form);
    mostrarToast("Mensaje enviado correctamente. Te contactaremos pronto.");
  });
  initCheckout();
}

function inicializarFormulario(idForm, reglas, alExito) {
  var form = document.getElementById(idForm);
  if (!form) {
    return;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valido = true;
    reglas.forEach(function (r) {
      var campo = form.querySelector("#" + r.id);
      var valor = campo.value.trim();
      var error = r.validar(valor);
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
  form.addEventListener("input", function (e) {
    if (e.target.classList.contains("input")) {
      limpiarError(e.target);
    }
  });
}

function mostrarError(campo, mensaje) {
  var errorId = campo.getAttribute("aria-describedby");
  var errorEl = errorId ? document.getElementById(errorId) : null;
  campo.setAttribute("aria-invalid", "true");
  campo.classList.add("input-error");
  if (errorEl) {
    errorEl.textContent = mensaje;
  }
}

function limpiarError(campo) {
  var errorId = campo.getAttribute("aria-describedby");
  var errorEl = errorId ? document.getElementById(errorId) : null;
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

var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requerido(valor, mensaje) {
  return valor === "" ? mensaje : "";
}

function emaiValido(valor) {
  return RE_EMAIL.test(valor) ? "" : "Ingresa un correo electrónico válido.";
}

var reglasContacto = [
  { id: "nombre", validar: function (v) { return requerido(v, "Ingresa tu nombre completo."); } },
  { id: "correo", validar: function (v) { return requerido(v, "Ingresa tu correo electrónico.") || emaiValido(v); } },
  { id: "mensaje", validar: function (v) { return requerido(v, "Escribe tu mensaje."); } }
];

var reglasCheckout = [
  { id: "cliente-nombre", validar: function (v) { return requerido(v, "Ingresa tu nombre completo."); } },
  { id: "cliente-correo", validar: function (v) { return requerido(v, "Ingresa tu correo electrónico.") || emaiValido(v); } },
  { id: "cliente-direccion", validar: function (v) { return requerido(v, "Ingresa tu dirección de entrega."); } }
];

/* ---------- Toast ---------- */

function mostrarToast(mensaje) {
  var toast = document.getElementById("toast");
  var texto = document.getElementById("toast-text");
  if (!toast || !texto) {
    return;
  }
  texto.textContent = mensaje;
  toast.classList.remove("opacity-0", "translate-y-24");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    toast.classList.add("opacity-0", "translate-y-24");
  }, 2800);
}