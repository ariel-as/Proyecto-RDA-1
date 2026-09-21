# INFORME DE AUDITORÍA TÉCNICA NO DESTRUCTIVA: FITZONE (AUDITORÍA 2)

**Proyecto:** FITZONE — Sitio web de gimnasio y tienda deportiva  
**Estándar de referencia:** WCAG 2.2 Nivel AA, Principios de UX, HTML5 Semántico y Responsive Design  
**Modalidad:** Auditoría de solo lectura (no destructiva, sin alteración de archivos de código ni estilos)  
**Entorno de ejecución de pruebas:** Microsoft Edge (Chromium 153 Headless) vía DevTools Protocol, Node.js v24  
**Fecha de evaluación:** Septiembre 2026  

---

## RESUMEN EJECUTIVO

El presente informe documenta la auditoría técnica y de accesibilidad web del sitio **FITZONE** en su estado actual, tras la adopción de Tailwind CSS v4 y la reestructuración semántica de componentes.

### Archivos Auditados Principalmente
- `index.html` (490 líneas, estructura completa de la interfaz y marcado HTML5).
- `css/tailwind.css` (175 líneas, configuración de tema `@theme`, directivas base `@layer base` y utilidades de componentes `@layer components`).
- `css/app.css` (hoja de estilos compilada vinculada en el documento).

> [!NOTE]
> **Estado de la capa de comportamiento (JavaScript):**  
> En el pie de `index.html` (líneas 487–488) se encuentran referenciados los archivos `js/productos.js` y `js/script.js`. Siguiendo estrictamente las directrices metodológicas, **no se audita la lógica interna de JavaScript**. Los componentes que requieren interacción dinámica (menú móvil desplegable, carrito lateral, inyección de catálogo de productos y validaciones dinámicas) se clasifican como **pendientes de implementación funcional** y se analizan exclusivamente desde su configuración estática en HTML y CSS.

### Diagnóstico General

El proyecto evidencia una evolución notable frente a bosquejos anteriores:
- **Aspectos Sobresalientes:** Estructura de encabezados (`h1`–`h3`) perfectamente secuencial; contraste de color en textos principales y secundarios con ratios que superan holgadamente el estándar AAA (> 18:1 y > 7:1); clara separación de roles entre enlaces (`<a>`) y botones (`<button>`); integración de enlace de salto al contenido (`.skip-link`); soporte nativo a preferencias de reducción de movimiento (`prefers-reduced-motion`); y definición global de `:focus-visible` con 3 px de contorno visible.
- **Puntos Críticos Detectados:**
  1. **Desbordamiento horizontal severo en tablet (768 px – 1023 px):** La cabecera conmuta prematuramente al menú horizontal de escritorio en el breakpoint `md` (768 px), forzando un ancho mínimo de 939 px en una pantalla de 768 px (+171 px de desbordamiento horizontal).
  2. **Desbordamiento horizontal en móviles estrechos (< 370 px):** A 320 px de ancho, los botones de acción de la cabecera junto al logotipo exceden el ancho disponible (+49 px de desbordamiento horizontal).
  3. **Inclusión de controles interactivos en contenedor con `aria-hidden="true"`:** El cajón del carrito (`<aside id="carrito">`) está desplazado visualmente fuera de la pantalla con `translate-x-full` y marcado con `aria-hidden="true"`, pero **no** tiene `display: none`, `visibility: hidden` ni `inert`. Sus 5 botones son alcanzables por teclado en navegación con `Tab`, provocando pérdida de foco e incumplimiento directo de accesibilidad.
  4. **Enlace sin subrayar con contraste insuficiente frente al texto circundante:** El correo en Contacto utiliza color de acento amarillo sobre fondo oscuro junto a texto blanco sin subrayado estático (ratio entre el enlace y el texto adyacente: 1.53:1 vs. 3.0:1 requerido por WCAG 2.2 SC 1.4.1).

---

## TABLA RESUMEN DE CONFORMIDAD Y HALLAZGOS

| ID | Área Evaluada | Criterio / Estándar | Severidad | Estado | Resumen del Hallazgo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **H-01** | Responsive / Layout | WCAG 2.2 SC 1.4.10 (Reflow) | **Crítico** | ❌ Falla | Desbordamiento horizontal de +171 px a 768 px (tablets) por activación prematura del menú de escritorio en `md`. |
| **H-02** | Responsive / Layout | WCAG 2.2 SC 1.4.10 (Reflow) | **Alto** | ❌ Falla | Desbordamiento horizontal de +49 px a 320 px (móviles < 370 px) por acumulación de elementos en la cabecera. |
| **H-03** | Teclado / ARIA | WCAG 2.2 SC 4.1.2, WAI-ARIA | **Crítico** | ❌ Falla | Botones del carrito cerrado (`#carrito`) reciben foco por Tab a pesar de tener `aria-hidden="true"`, por falta de `inert` o `display:none`. |
| **H-04** | Contraste / Color | WCAG 2.2 SC 1.4.1 (Use of Color) | **Medio** | ❌ Falla | Enlace `contacto@fitzone.ec` sin subrayado por defecto tiene ratio de 1.53:1 frente al texto blanco adyacente (mínimo 3:1). |
| **H-05** | ARIA / Lectores de pantalla | WCAG 2.2 SC 1.3.1 (Info & Relationships) | **Bajo** | ⚠️ Advertencia | Nota de obligatoriedad oculta el asterisco (`aria-hidden="true"`), provocando que se verbalice: *"Los campos marcados con son obligatorios."*. |
| **H-06** | Formularios nativos | Buenas prácticas HTML5 | **Informativo** | ℹ️ Pendiente | Atributo `novalidate` anula las alertas nativas del navegador antes de que el script JS de validación esté activo. |
| **C-01** | Semántica HTML5 | HTML5 Living Standard | — | ✅ Cumple | Marcado semántico riguroso con `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<dl>`, `<ol>` y `<ul>`. |
| **C-02** | Jerarquía de Encabezados | WCAG 2.2 SC 1.3.1, 2.4.6 | — | ✅ Cumple | Jerarquía lineal perfecta: un único `<h1>`, 10 `<h2>` de sección y `<h3>` para subsecciones sin saltos de nivel. |
| **C-03** | Nombres Accesibles | WCAG 2.2 SC 2.4.4, 4.1.2 | — | ✅ Cumple | Enlaces y botones unívocamente identificados; enlaces de planes contextualizados con `aria-label`. |
| **C-04** | Contraste de Textos | WCAG 2.2 SC 1.4.3 (Contraste) | — | ✅ Cumple | Textos principales (18.1:1 a 20.0:1) y secundarios (7.0:1 a 7.7:1) superan holgadamente el nivel AAA (7:1). |
| **C-05** | Contraste de Bordes e Inputs | WCAG 2.2 SC 1.4.11 | — | ✅ Cumple | Borde de input (`#6b6b6b`) contra tarjeta (`#161616`) presenta 3.40:1 (supera el mínimo de 3.0:1). |
| **C-06** | Objetivos Táctiles | WCAG 2.2 SC 2.5.8 (Target Size) | — | ✅ Cumple | Botones principales y controles con altura mínima de 44 px (`min-h-11`), superando el mínimo legal de 24 px. |
| **C-07** | Indicador de Foco | WCAG 2.2 SC 2.4.7, SC 2.4.13 | — | ✅ Cumple | `:focus-visible` global de 3 px sólido color acento (#facc15) con ratio > 11:1 contra fondo oscuro. |
| **C-08** | Movimiento Reducido | WCAG 2.2 SC 2.3.3 | — | ✅ Cumple | Implementación completa de `@media (prefers-reduced-motion: reduce)`. |

---

## 1. ESTRUCTURA HTML Y SEMÁNTICA

### Elementos que cumplen correctamente
- **Declaración DOCTYPE e idioma:** `index.html` (líneas 1–2) inicia con `<!DOCTYPE html>` y `<html lang="es">`, definiendo el idioma base en español conforme al público objetivo.
- **Metadatos esenciales:**
  - `<meta charset="UTF-8">` en línea 4.
  - `<meta name="viewport" content="width=device-width, initial-scale=1">` en línea 5 (no bloquea el zoom del usuario con `user-scalable=no`, cumpliendo con WCAG 1.4.4).
  - `<meta name="description">` en línea 6 con descripción comercial completa y representativa.
- **Estructura jerárquica de hitos (Landmarks):**
  - `<header>` sticky en línea 13.
  - `<nav>` principal en línea 17 con `aria-label="Navegación principal"`.
  - `<main id="main" tabindex="-1">` en línea 52. La inclusión de `tabindex="-1"` permite recibir el foco programático del skip-link de manera consistente en todos los motores de renderizado.
  - `<nav>` secundario en línea 400 con `aria-label="Navegación del pie de página"`.
  - `<footer>` en línea 396.
- **Secciones temáticas:** Existen 10 elementos `<section>` bien delimitados (`#inicio`, `#planes`, `#servicios`, `#clases`, `#rutinas`, `#nutricion`, `#entrenadores`, `#nosotros`, `#tienda`, `#contacto`), todos vinculados a su encabezado titular mediante `aria-labelledby`.
- **Estructuras de datos enriquecidas:**
  - Lista de definiciones `<dl>`, `<dt>`, `<dd>` en Clases (líneas 176–185) y en el desglose de totales del carrito (líneas 431–434).
  - Lista ordenada `<ol class="flow ...">` en Rutinas (líneas 218–223) para reflejar una secuencia cronológica de 4 pasos (Evaluación, Nivel, Rutina, Seguimiento).
- **Enlaces internos:** Todos los enlaces del menú (`#inicio`, `#planes`, `#tienda`, `#clases`, `#rutinas`, `#nutricion`, `#contacto`) y del botón skip-link (`#main`) corresponden a IDs existentes y válidos dentro del DOM.

### Observaciones y aspectos a mejorar
- **Uso de `<article>`:** Actualmente no se emplea ninguna etiqueta `<article>` en el documento. Si bien las tarjetas de membresía, servicios y entrenadores están correctamente estructuradas como listas semánticas (`<ul>` con `<li>`), en la sección de Tienda (`#productos-grid`), cuando se implemente la renderización de productos, cada producto debería encapsularse en una etiqueta `<article>` por constituir contenido independiente y autocontenido.
- **Semántica de `<aside id="carrito">`:** En la línea 416, el elemento `<aside>` lleva asignado `role="dialog"`. En la especificación ARIA, asignar un rol explícito anula el rol de landmark nativo (`complementary`), transformándolo en una ventana modal. Es técnicamente válido, pero semánticamente un `<div role="dialog">` o un `<dialog id="carrito">` nativo de HTML5 reflejaría con mayor precisión su propósito funcional.

---

## 2. JERARQUÍA DE ENCABEZADOS

La jerarquía es estrictamente secuencial, lógica y estructurada, sin saltos de nivel injustificados:

```
[h1] Entrena. Supera. Evoluciona. (L56)
├── [h2] Nuestros planes (L70)
│   ├── [h3] 1 persona (L76)
│   ├── [h3] 2 personas (L88)
│   └── [h3] 3 personas (L100)
├── [h2] Servicios (L120)
│   ├── [h3] Pesas (L132)
│   ├── [h3] Cardio (L139)
│   ├── [h3] Boxeo (L149)
│   └── [h3] Bailoterapia (L158)
├── [h2] Clases (L169)
│   ├── [h3] Boxeo (L175)
│   └── [h3] Bailoterapia (L188)
├── [h2] Rutinas (L214)
│   ├── [h3] Principiante (L227)
│   ├── [h3] Intermedio (L231)
│   └── [h3] Avanzado (L235)
├── [h2] Nutrición (L246)
│   ├── [h3] Evaluación corporal (L257)
│   ├── [h3] Análisis personalizado (L267)
│   ├── [h3] Asesoría nutricional (L276)
│   └── [h3] ¿Quieres agendar una cita? (L282)
├── [h2] Entrenadores (L294)
│   ├── [h3] Entrenador 1 (L301)
│   ├── [h3] Entrenador 2 (L306)
│   └── [h3] Entrenador 3 (L311)
├── [h2] Nosotros (L325)
├── [h2] Productos (L343)
└── [h2] Contacto (L360)
    └── [h3] Envíanos un mensaje (L371)

Diálogos Modales:
├── [h2] Carrito (L419)
└── [h2] Finalizar compra (L448)
```

- **Unicidad del encabezado principal:** Existe exactamente un solo `<h1>` en el cuerpo del documento.
- **Relación lógica:** Todas las secciones principales emplean `<h2>`. Todas las subsecciones y tarjetas internas emplean `<h3>`. No se identifican etiquetas de encabezado utilizadas exclusivamente con fines estéticos o saltos indebidos (por ejemplo, pasar de `h2` a `h4`).
- **Títulos de diálogos:** Los diálogos flotantes (`#carrito` y `#checkout-overlay`) utilizan `<h2>`, referenciados adecuadamente por sus atributos `aria-labelledby`.

---

## 3. NOMBRES ACCESIBLES

### Cumplimiento verificado
- **Enlaces de membresías contextualizados:** En versiones preliminares se reportaba ambigüedad en los botones repetidos "Inscribirme". En el código actual (`index.html`, líneas 84, 96, 108), cada enlace contiene un `aria-label` descriptivo que resuelve el problema:
  - `aria-label="Inscribirme en el plan 1 persona por $35 al mes"`
  - `aria-label="Inscribirme en el plan 2 personas por $60 al mes"`
  - `aria-label="Inscribirme en el plan 3 personas por $85 al mes"`
- **Botones con sólo icono:** Los botones que cierran los diálogos modales disponen de etiquetas accesibles completas:
  - `<button id="cerrar-carrito" aria-label="Cerrar carrito">✕</button>` (línea 420).
  - `<button id="cerrar-checkout" aria-label="Cerrar ventana de finalizar compra">✕</button>` (línea 449).
- **Disparador del carrito:** `<button id="cart-trigger" aria-label="Carrito de compras, 0 productos">` (línea 31) proporciona un nombre compuesto accesible que informa al lector de pantalla sobre el estado y conteo inicial.
- **Botón de menú móvil:** `<button id="menu-btn" aria-label="Menú de navegación">` (línea 40) contiene tanto el texto visual "Menú" como el nombre accesible formal.

### Oportunidades de mejora
- **Enlace telefónico de Nutrición (`index.html:L284`):**  
  `<a href="tel:+593959651239" class="fz-btn fz-btn-primary mt-6">Agendar cita</a>`  
  Para un usuario de lector de pantalla que navegue mediante la lista de enlaces fuera de contexto, "Agendar cita" sugiere un formulario o calendario web. Sería más descriptivo: `aria-label="Llamar para agendar cita al 095 965 1239"`.

---

## 4. IMÁGENES Y TEXTO ALTERNATIVO

### Análisis del marcado
- **Etiquetas `<img>`:** Actualmente **no existe ninguna etiqueta `<img>`** en el archivo `index.html`.
- **Iconografía SVG:** Se utilizan 9 iconos vectoriales SVG en línea:
  - Icono del carrito (`cart-trigger`, L32).
  - Icono de menú hamburguesa (`menu-btn`, L41).
  - 4 iconos de servicios: Pesas (L125), Cardio (L136), Boxeo (L143) y Bailoterapia (L153).
  - 3 iconos de nutrición: Evaluación corporal (L252), Análisis personalizado (L261) y Asesoría nutricional (L271).  
  **Evaluación:** Todos los elementos `<svg>` cuentan correctamente con `aria-hidden="true"`. Al tratarse de iconos estrictamente decorativos acompañados siempre por su correspondiente encabezado textual (`<h3>`) o etiqueta de botón, cumplen al 100% con WCAG 2.2 SC 1.1.1 (Contenido no textual).
- **Avatares de entrenadores (`index.html:L300, L305, L310`):**  
  Se implementan mediante círculos estilizados con iniciales:  
  `<span class="..." aria-hidden="true">E1</span>`  
  El uso de `aria-hidden="true"` es acertado en este estado de maqueta, ya que evita que un lector de pantalla verbalice las siglas abreviadas ("E uno"), mientras que el nombre accesible completo es provisto de inmediato por el encabezado `<h3>Entrenador 1</h3>`.
- **Sección de Tienda (`#productos-grid`):** Al ser un contenedor dinámico vacío, se recuerda que una vez se inyecte el catálogo con JavaScript, cada imagen de producto deberá incluir obligatoriamente un atributo `alt` descriptivo (ej. `alt="Proteína Whey Gold Standard 2lb vainilla"`), o `alt=""` si el producto está contenido en un enlace que ya vocaliza su nombre completo.

---

## 5. CONTRASTE Y COLORES

A partir de las variables definidas en `css/tailwind.css` (líneas 3–20, `@theme`), se calcularon matemáticamente las luminancias relativas y ratios de contraste bajo la fórmula oficial de WCAG 2.2:

$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

### Tabla de Medición Empírica de Contraste

| Elemento / Combinación de Color | Código Hex Foreground | Código Hex Background | Ratio Real | Requisito WCAG 2.2 AA | Dictamen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Texto blanco sobre fondo base** | `#ffffff` | `#0a0a0a` (`--color-bg`) | **19.80:1** | $\ge 4.5:1$ (Texto normal) | ✅ **Supera AAA** |
| **Texto blanco sobre tarjeta** | `#ffffff` | `#161616` (`--color-surface`) | **18.10:1** | $\ge 4.5:1$ (Texto normal) | ✅ **Supera AAA** |
| **Texto blanco sobre fondo alterno** | `#ffffff` | `#0f0f0f` (`--color-bg-alt`) | **19.17:1** | $\ge 4.5:1$ (Texto normal) | ✅ **Supera AAA** |
| **Texto blanco sobre pie de página** | `#ffffff` | `#080808` | **20.03:1** | $\ge 4.5:1$ (Texto normal) | ✅ **Supera AAA** |
| **Texto muted (`--color-muted`) en fondo** | `#a1a1a1` | `#0a0a0a` | **7.66:1** | $\ge 4.5:1$ (Texto normal) | ✅ **Supera AAA** |
| **Texto muted en tarjeta** | `#a1a1a1` | `#161616` | **7.00:1** | $\ge 4.5:1$ (Texto normal) | ✅ **Supera AAA** |
| **Texto de acento (`--color-accent`) en fondo** | `#facc15` | `#0a0a0a` | **12.93:1** | $\ge 4.5:1$ (Texto normal) | ✅ **Supera AAA** |
| **Texto de acento en tarjeta** | `#facc15` | `#161616` | **11.82:1** | $\ge 4.5:1$ (Texto normal) | ✅ **Supera AAA** |
| **Texto oscuro botón primario (`--color-ink`)** | `#0a0a0a` | `#facc15` (`--color-accent`) | **12.93:1** | $\ge 4.5:1$ (Texto normal) | ✅ **Supera AAA** |
| **Texto oscuro botón hover (`--color-ink`)** | `#0a0a0a` | `#eab308` (`--color-accent-strong`) | **10.32:1** | $\ge 4.5:1$ (Texto normal) | ✅ **Supera AAA** |
| **Placeholder (`--color-placeholder`) en input** | `#88929e` | `#0a0a0a` | **6.27:1** | $\ge 4.5:1$ (Texto normal) | ✅ **Supera AAA** |
| **Borde de input (`--color-input-edge`) vs. tarjeta** | `#6b6b6b` | `#161616` | **3.40:1** | $\ge 3.0:1$ (SC 1.4.11 No textual) | ✅ **Cumple AA** |
| **Borde botón outline (`neutral-400`) vs. fondo** | `#a3a3a3` | `#0a0a0a` | **7.85:1** | $\ge 3.0:1$ (SC 1.4.11 No textual) | ✅ **Supera AAA** |
| **Texto de error (`--color-danger`) en tarjeta** | `#f87171` | `#161616` | **6.54:1** | $\ge 4.5:1$ (Texto normal) | ✅ **Supera AAA** |
| **Anillo de foco (`--color-accent`) vs. fondo** | `#facc15` | `#0a0a0a` / `#161616` | **> 11.8:1** | $\ge 3.0:1$ (SC 2.4.13 Foco visible) | ✅ **Supera AAA** |
| **Enlace correo vs. texto blanco adyacente** | `#facc15` | `#ffffff` | **1.53:1** | $\ge 3.0:1$ (SC 1.4.1 Sin subrayado) | ❌ **FALLA WCAG** |

### Evidencia del Fallo en SC 1.4.1 (Uso del Color)
En la sección Contacto (`index.html`, línea 364):
```html
<li><strong>Correo:</strong> <a class="font-semibold text-accent underline-offset-4 hover:underline" href="mailto:contacto@fitzone.ec">contacto@fitzone.ec</a></li>
```
- El enlace se muestra en color amarillo `#facc15` incrustado junto a la etiqueta en texto blanco `<strong>Correo:</strong>`.
- La clase `hover:underline` indica que en su estado estático normal **no tiene subrayado**.
- Según la técnica G183 de WCAG 2.2 para SC 1.4.1, si un enlace dentro de un bloque de texto no tiene subrayado por defecto, debe poseer un ratio de contraste de al menos **3.0:1** respecto al texto no interactivo adyacente. El contraste entre `#facc15` y `#ffffff` es de solo **1.53:1**, haciendo que personas con deficiencias de visión cromática no puedan distinguir si se trata de un enlace o de texto normal sin pasar el cursor encima.

---

## 6. NAVEGACIÓN MEDIANTE TECLADO

### Aspectos que cumplen
1. **Enlace de salto (`skip-link`):**
   - Implementado en `index.html` (línea 11) y `css/tailwind.css` (líneas 157–160).
   - Es el primer elemento interactivo en el DOM.
   - Oculto fuera de pantalla por defecto (`-translate-y-24`), pero al presionar Tab adquiere `:focus` y se traslada a la vista visible (`transform: none;` en `top-3 left-4`) con fondo amarillo y texto negro de alto contraste.
   - Apunta a `<main id="main" tabindex="-1">`, garantizando el traslado directo del foco.
2. **Estilo global de foco visible:**
   - En `css/tailwind.css` (líneas 33–37):
     ```css
     :focus-visible {
       outline: 3px solid var(--color-accent);
       outline-offset: 3px;
       border-radius: 4px;
     }
     ```
   - Cumple de manera ejemplar con WCAG 2.2 SC 2.4.7 (Foco visible) y SC 2.4.13 (Apariencia del foco).
3. **Valores de `tabindex`:** No existen valores positivos de `tabindex` en ningún archivo, preservando el orden de foco natural del DOM.

### Hallazgo Crítico de Teclado (H-03)
- **Ubicación:** `index.html` (líneas 416–442).
- **Problema:**  
  El panel del carrito está estructurado como:
  ```html
  <aside id="carrito" role="dialog" aria-modal="true" aria-labelledby="carrito-titulo" aria-hidden="true"
         class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md translate-x-full flex-col ...">
  ```
  La clase `translate-x-full` desplaza el panel un 100% hacia la derecha fuera del área visible de la pantalla, pero **no aplica `display: none` ni `visibility: hidden` ni el atributo `inert`**.
- **Consecuencia en la navegación:**
  Cuando un usuario navega exclusivamente con la tecla `Tab` a lo largo de la página, al superar el pie de página, el foco del teclado ingresa a los 5 botones contenidos en el carrito cerrado:
  1. `<button id="cerrar-carrito">`
  2. `<button id="seguir-comprando-vacio">`
  3. `<button id="btn-vaciar">`
  4. `<button id="btn-continuar">`
  5. `<button id="btn-finalizar">`
- **Violación de Accesibilidad:**  
  El foco se pierde en un área invisible fuera de la pantalla. Además, el contenedor tiene explícitamente `aria-hidden="true"`. La especificación WAI-ARIA y la regla de auditoría `aria-hidden-focus` dictaminan que un contenedor con `aria-hidden="true"` jamás debe albergar elementos que puedan recibir foco por teclado.
  *(Nota de contraste: la ventana de checkout en la línea 445 sí aplica la clase `hidden` (`display: none`), por lo que está correctamente aislada del tab-order cuando no está activa).*

---

## 7. BOTONES Y ENLACES

La separación funcional entre `<button>` y `<a>` es semánticamente correcta en todo el código:

1. **Uso de `<button>` para acciones:**
   - Disparador del carrito: `<button id="cart-trigger" type="button">` (línea 31).
   - Disparador de menú móvil: `<button id="menu-btn" type="button">` (línea 40).
   - Envío de formulario: `<button type="submit">` (líneas 389 y 477).
   - Cierres y acciones modales: `<button id="cerrar-carrito" type="button">`, `<button id="btn-vaciar" type="button">`, `<button id="checkout-cancelar" type="button">`.
   - **Buenas prácticas:** Todos los botones poseen explícitamente su atributo `type="button"` o `type="submit"`, evitando envíos accidentales de formulario.
2. **Uso de `<a>` para navegación:**
   - Enlaces de cabecera y pie conducen a fragmentos de anclaje interno (`href="#inicio"`, `href="#planes"`, etc.).
   - Los botones de llamada a la acción visuales en el Hero ("Ver planes", "Tienda FITZONE", "Contáctanos") son enlaces `<a>` con estilo de botón `.fz-btn`, lo cual es adecuado ya que su propósito es transportar al usuario a otra sección del documento.
   - Enlace telefónico en Nutrición (`href="tel:+593959651239"`) y correo en Contacto (`href="mailto:contacto@fitzone.ec"`).
3. **Ausencia de pseudo-botones:** No se detectó ningún `<div>` o `<span>` utilizado como elemento interactivo con eventos click simulados.

---

## 8. ARIA

### Atributos implementados correctamente
- **`aria-label` en navegación:**
  - `<nav id="main-nav" aria-label="Navegación principal">` (línea 17).
  - `<nav aria-label="Navegación del pie de página">` (línea 400).  
  Permite a los usuarios de lectores de pantalla distinguir inmediatamente entre ambas zonas de navegación.
- **`aria-labelledby` en secciones:** Cada una de las 10 secciones enlaza su `id` de encabezado correspondiente (`hero-title`, `planes-title`, `servicios-title`, etc.), facilitando la orientación por puntos de referencia (landmarks).
- **Controles de despliegue:**
  - `#menu-btn` cuenta con `aria-expanded="false"` y `aria-controls="main-nav"`.
  - `#cart-trigger` cuenta con `aria-haspopup="dialog"`, `aria-controls="carrito"` y `aria-expanded="false"`.
- **Región viva de estado:**
  - `<p id="sin-resultados" ... role="status">` (línea 351) está preparado para anunciar de forma no intrusiva a lectores de pantalla cuando un filtro de productos no arroje resultados.

### Hallazgo de ARIA en Formularios (H-05)
En la cabecera del formulario de contacto (`index.html`, línea 372) y en las etiquetas de los campos (líneas 375, 380, 385):
```html
<p class="fz-note mb-6">Los campos marcados con <span class="font-bold text-accent" aria-hidden="true">*</span> son obligatorios.</p>
...
<label class="label" for="nombre">Nombre completo <span class="font-bold text-accent" aria-hidden="true">*</span></label>
```
- **Problema:** El carácter del asterisco está envuelto en `<span ... aria-hidden="true">*</span>`.
- **Efecto:** Un lector de pantalla omite por completo el contenido del `<span>`. Por tanto, al leer la frase de ayuda, el sintetizador de voz pronuncia textualmente:  
  *"Los campos marcados con son obligatorios."*
  Se produce una incoherencia comunicativa al ocultar el mismo símbolo que la oración intenta explicar.

---

## 9. FORMULARIOS

Se analizaron los dos formularios presentes en `index.html`:
1. Formulario de contacto (`#contacto-form`, líneas 370–391).
2. Formulario de checkout modal (`#checkout-form`, líneas 452–480).

### Verificación de requisitos
- **Estructura semántica:** Ambos utilizan `<form>` con campos organizados en bloques `.field`.
- **Vinculación `<label for>` con `<input id>`:**  
  100% de los campos cuentan con una etiqueta `<label>` asociada de forma inequívoca mediante identificadores unívocos (`nombre`, `correo`, `mensaje`, `cliente-nombre`, `cliente-correo`, `cliente-telefono`, `cliente-direccion`).
- **Tipos de entrada correctos:** Se utiliza `type="text"`, `type="email"`, `type="tel"` y `<textarea>` en correspondencia exacta con los datos solicitados.
- **Atributos de autocompletado (`autocomplete`):**  
  Excelente implementación acorde a WCAG 2.2 SC 1.3.5 (Identificación del propósito de la entrada):
  - `autocomplete="name"` en nombres.
  - `autocomplete="email"` en correos electrónicos.
  - `autocomplete="tel"` en teléfono.
  - `autocomplete="street-address"` en dirección.
- **Atributos `required`:** Correctamente presentes en todos los campos obligatorios.
- **Contenedores de error:** Cada campo obligatorio dispone de un atributo `aria-describedby` que apunta a un contenedor de error (`#nombre-error`, `#correo-error`, etc.) con `role="alert"`. En `css/tailwind.css` (línea 119) se define `.fz-field-error:empty { display: none; }`, lo que previene espacios en blanco vacíos mientras no existan fallos.

### Observación sobre el estado actual (Pendiente JS)
Ambos formularios contienen el atributo `novalidate` (`index.html`, líneas 370 y 452). Al estar la capa de JavaScript pendiente de implementación, presionar el botón "Enviar mensaje" o "Confirmar pedido" intenta ejecutar el envío HTTP nativo (`method="post" action="#"`) sin desplegar los globos de advertencia nativos del navegador (`HTML5 Constraint Validation`), ya que `novalidate` los suprime intencionalmente para ceder el control a JavaScript.

---

## 10. DISEÑO RESPONSIVE Y 11. OVERFLOW HORIZONTAL

Se llevaron a cabo pruebas instrumentadas de renderizado en Microsoft Edge headless simulando los viewports clave requeridos. Se evaluaron las propiedades `scrollWidth` del documento frente a `innerWidth` de la ventana, así como las coordenadas de cada elemento (`getBoundingClientRect`).

### Resultados de las Pruebas de Renderizado

```
================================================================================
Evaluación de Viewports y Desbordamiento Horizontal
================================================================================
Viewport             innerWidth    scrollWidth   Estado              Exceso
--------------------------------------------------------------------------------
320px (Móvil mini)   320 px        369 px        ❌ OVERFLOW         +49 px
340px (Móvil bajo)   340 px        369 px        ❌ OVERFLOW         +29 px
360px (Android std)  360 px        369 px        ❌ OVERFLOW         +9 px
370px                370 px        370 px        ✅ Sin overflow     0 px
390px (iPhone std)   390 px        390 px        ✅ Sin overflow     0 px
767px (Móvil max)    767 px        752 px        ✅ Sin overflow     0 px
768px (Tablet port)  768 px        939 px        ❌ OVERFLOW SEVERO  +171 px
800px (Tablet std)   800 px        948 px        ❌ OVERFLOW SEVERO  +148 px
900px                900 px        998 px        ❌ OVERFLOW         +98 px
1000px               1000 px       1048 px       ❌ OVERFLOW         +48 px
1024px (Desktop min) 1024 px       1009 px       ✅ Sin overflow     0 px
1280px (Desktop std) 1280 px       1265 px       ✅ Sin overflow     0 px
================================================================================
```

### Análisis Causa-Raíz del Desbordamiento

Se ejecutó una prueba aislando temporalmente el `<header>` (evaluando únicamente `<main>` y `<footer>`), arrojando **0 px de desbordamiento horizontal en todo el cuerpo y pie de página**. El desbordamiento horizontal en el sitio es atribuible **exclusivamente a la cabecera** en dos intervalos de pantalla específicos:

#### 1. Falla Crítica en Tablet (768 px a 1023 px)
- **Causa:** En `index.html` (líneas 17 y 40), el breakpoint utilizado para conmutar la navegación de móvil a escritorio es `md` (768 px):
  - El botón `#menu-btn` se oculta mediante `md:hidden`.
  - El contenedor `#main-nav` pasa de `hidden` a `md:flex md:flex-row md:items-center md:gap-7`.
- **Medición exacta a 768 px:**
  - Logotipo: 94 px.
  - Menú de 7 enlaces con separación `gap-7` (28 px) + botón "Inscríbete" (120 px): **658 px**.
  - Botón de carrito: **125 px**.
  - Rellenos laterales del contenedor (`px-6`): 48 px.
  - **Ancho total requerido por los elementos en una fila:** $94 + 16 + 658 + 16 + 125 + 48 \approx \mathbf{957\text{ px}}$.
- **Impacto:** En una pantalla de 768 px, la cabecera fuerza un `scrollWidth` de **939 px**, generando una barra de desplazamiento horizontal de 171 px que rompe la experiencia en tablets verticales (iPad Mini, iPad Air).

#### 2. Falla en Móviles Pequeños (menores a 370 px, ej. 320 px)
- **Causa:** En `index.html` (líneas 14 y 30), el contenedor de la cabecera tiene `flex items-center justify-between gap-4 py-3 px-4`.
- **Medición exacta a 320 px:**
  - Logotipo: 94 px de ancho (`left: 16px`, `right: 110px`).
  - Grupo de botones de la derecha (`<div class="flex items-center gap-3">`):
    - Botón Carrito (`#cart-trigger`): 125 px.
    - Separación `gap-3`: 12 px.
    - Botón Menú (`#menu-btn`): 105 px.
    - Ancho del grupo de botones: **243 px** (`left: 126px`, `right: 369px`).
- **Impacto:** El borde derecho de `#menu-btn` se sitúa en la coordenada `X = 369 px`. Al superar el límite de la pantalla (320 px), provoca que el documento crezca a **369 px**, ocasionando 49 px de scroll horizontal en dispositivos como iPhone SE (1ra gen) o pantallas plegables compactas.

---

## 12. OBJETIVOS TÁCTILES (TARGET SIZE)

Bajo **WCAG 2.2 SC 2.5.8 (Target Size - Minimum)**, todo objetivo interactivo debe tener dimensiones de al menos **24 × 24 px**, salvo excepciones (ej. enlaces en línea dentro de un bloque de texto). Adicionalmente, las guías de UX móvil (Apple HIG y Google Material) recomiendan **44 × 44 px** o **48 × 48 px**.

### Mediciones empíricas de controles interactivos

1. **Botones primarios y secundarios (`.fz-btn`):**
   - Regla en CSS: `css/tailwind.css` (línea 58): `@apply inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 ...`
   - **Dimensiones:** Altura real de **44 px** (`min-h-11`), anchos variables entre 120 px y 300 px.
   - **Evaluación:** ✅ Supera ampliamente WCAG 2.2 AA (24 px) y cumple la recomendación UX de 44 px.
2. **Botones de icono (`.icon-btn`):**
   - Regla en CSS: `css/tailwind.css` (línea 83): `@apply inline-flex h-11 w-11 ...`
   - **Dimensiones:** Exactamente **44 × 44 px**.
   - **Evaluación:** ✅ Cumple tanto WCAG 2.2 AA como guías ergonómicas de Apple/Android.
3. **Botón de menú móvil (`#menu-btn`):**
   - Dimensiones: **105 px de ancho × 44 px de alto** (`min-h-11 px-4`).
   - **Evaluación:** ✅ Cumple el estándar de 44 px.
4. **Enlaces de navegación del pie de página (`index.html`, líneas 402–405):**
   - Marcado: `<a class="inline-flex min-h-11 items-center ...">`
   - **Dimensiones:** Altura de **44 px**.
   - **Evaluación:** ✅ Cumple con 44 px.
5. **Campos del formulario (`input`, `textarea`):**
   - Relleno `px-4 py-3`: altura calculada de **48 px**.
   - **Evaluación:** ✅ Ergonómico y accesible.
6. **Enlace `contacto@fitzone.ec` (`index.html:L364`):**
   - **Dimensiones:** **148.8 px de ancho × 21.0 px de alto**.
   - **Evaluación:** Al estar contenido en una línea de texto de lista (`<li><strong>Correo:</strong> <a ...>`), aplica a la excepción técnica de enlace en línea de WCAG 2.2 SC 2.5.8. No obstante, a nivel de usabilidad táctil móvil (UX), una altura de 21 px puede dificultar el toque accidental; se recomienda aumentar el espaciado táctil o convertirlo en bloque táctil en móviles.

---

## 13. TIPOGRAFÍA Y LEGIBILIDAD

- **Pila tipográfica:**  
  Definida en `css/tailwind.css` (línea 19):
  ```css
  --font-sans: "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif;
  ```
  Prioriza tipografías nativas del sistema operativo, garantizando nitidez inmediata, alta legibilidad y ausencia de parpadeos de carga (FOIT/FOUT).
- **Escalabilidad y zoom del texto:**
  - El cuerpo del documento define `line-height: 1.6` (`css/tailwind.css`, líneas 30–31), cumpliendo la pauta de WCAG de mantener al menos 1.5 en párrafos.
  - Los tamaños de texto se definen en unidades relativas `rem` generadas por Tailwind (`text-xs`: 0.75rem, `text-sm`: 0.875rem, `text-lg`: 1.125rem, `text-3xl`: 1.875rem, `text-4xl`: 2.25rem, etc.). Al no estar fijos en píxeles absolutos, el diseño escala proporcionalmente cuando el usuario ajusta el tamaño de fuente base en su navegador.
  - La directiva `-webkit-text-size-adjust: 100%` en la línea 25 evita escalados anómalos no deseados en navegadores móviles WebKit.
- **Control de longitud de línea (Measure):**
  - Título principal Hero: `max-w-[14ch]` (aproximadamente 14 caracteres por línea).
  - Subtítulo Hero: `max-w-[52ch]` (52 caracteres por línea).
  - Encabezados de sección: `max-w-[640px]`.  
  Se mantiene dentro del rango ideal de lectura ergonómica (45 a 75 caracteres por línea), evitando el cansancio visual.
- **Uso de mayúsculas:** Se limitan a textos cortos identificativos (`uppercase tracking-[0.14em]`), acompañados de espacio entre caracteres (`letter-spacing`), evitando textos largos en mayúsculas sostenidas que dificulten la lectura.

---

## 14. FOCUS Y ESTADOS INTERACTIVOS

- **Regla global de foco:**
  ```css
  :focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 3px;
    border-radius: 4px;
  }
  ```
  - Produce un anillo amarillo `#facc15` de 3 px con separación de 3 px respecto al elemento enfocado.
  - La visibilidad es total sobre los fondos oscuros del sitio (ratio superior a 11:1).
  - Cumple de forma excelente con el criterio WCAG 2.2 SC 2.4.13 (Focus Appearance, nivel AAA).
- **Inspección de `outline: none;`:**
  - La única aparición de `outline: none;` en todo el CSS se ubica en `css/tailwind.css` (líneas 104–108):
    ```css
    .input:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.25);
    }
    ```
  - **Evaluación:** La supresión del contorno en los campos de formulario está justificada porque se sustituye de forma inmediata por un cambio de color del borde al amarillo brillante de acento y un halo resplandeciente (`box-shadow`) de 4 px, garantizando que el estado enfocado sea claramente perceptible.
- **Estados `:hover` y `:active`:**
  - Botones primarios cambian de `#facc15` a `#eab308` (`--color-accent-strong`) en `:hover` y reducen su escala a `0.98` en `:active`.
  - Botones outline cambian borde y texto a amarillo de acento en `:hover`.
  - Botones de icono adquieren fondo `--color-surface-2` (`#1e1e1e`) y texto amarillo en `:hover`.
  - Enlaces de navegación transicionan de `--color-muted` a `text-white` en `:hover`.
- **Adaptación a `prefers-reduced-motion`:**
  - `css/tailwind.css` (líneas 165–175) apaga el desplazamiento suave (`scroll-behavior: auto`) y reduce drásticamente las duraciones de animación y transición a `0.01ms` si el usuario ha configurado reducción de movimiento en su sistema operativo, cumpliendo con WCAG 2.2 SC 2.3.3.

---

## RECOMENDACIONES TÉCNICAS PRIORIZADAS PARA LA IMPLEMENTACIÓN

*(Estas recomendaciones se presentan exclusivamente con fines informativos para la etapa de desarrollo posterior)*:

1. **Ajustar el breakpoint de navegación de la cabecera (Prioridad Alta):**
   - Cambiar los modificadores `md:` en `index.html` (líneas 17 y 40) por `lg:` (1024 px), o reducir el espaciado horizontal (`gap-3` en lugar de `gap-7` en resoluciones intermedias), para mantener el menú móvil activo en tablets verticales (768 px a 1023 px) y evitar los 171 px de desbordamiento horizontal.
2. **Optimizar la cabecera para móviles estrechos a 320 px (Prioridad Alta):**
   - En pantallas pequeñas (`< 375px`), compactar el botón del carrito (`#cart-trigger`) mostrando solo el icono SVG y el contador, o reducir el relleno (`px-3`) de los botones para que el conjunto quepa dentro de los 320 px sin provocar scroll lateral.
3. **Aislar el foco en el panel del carrito cerrado (Prioridad Crítica de Accesibilidad):**
   - Añadir la clase `hidden` (o el atributo nativo `inert`) a `<aside id="carrito">` mientras esté cerrado, y retirarlo dinámicamente con JavaScript únicamente al desplegarse. Esto evitará que los usuarios de teclado naveguen a ciegas por botones ocultos en un contenedor con `aria-hidden="true"`.
4. **Subrayar por defecto el enlace de correo o aumentar su contraste (Prioridad Media):**
   - En `index.html` (línea 364), reemplazar `hover:underline` por `underline` permanente para el enlace `contacto@fitzone.ec`, satisfaciendo la regla de enlaces en texto sin depender exclusivamente del color.
5. **Corregir el texto de obligatoriedad en el formulario (Prioridad Baja):**
   - En `index.html` (línea 372), retirar `aria-hidden="true"` del asterisco explicativo o formular la frase como: `Los campos marcados con asterisco (*) son obligatorios`, de modo que los sintetizadores de voz transmitan la indicación completa.
