# AUDITORÍA DEL PRIMER BOSQUEJO

## 1. Resumen ejecutivo

El presente informe contiene la auditoría técnica y no destructiva del primer bosquejo del sitio web **FITZONE**, compuesto por los archivos `index.html` y `css/styles.css` ubicados en el repositorio del proyecto, tomando como marco de referencia las pautas **WCAG 2.2 nivel AA**, principios de **Experiencia de Usuario (UX)**, **Diseño Responsive** y los requerimientos y buenas prácticas establecidos en el documento de levantamiento inicial (`Levantamiento_y_mejores_practicas_Gimnasio.md`).

### Estado general del proyecto
El bosquejo actual presenta una **base arquitectónica y semántica sobresaliente**:
- Estructura HTML5 limpia, con separación clara de hitos semánticos (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<dl>`, `<ol>`, `<ul>`).
- Jerarquía de encabezados impecable (un único `<h1>`, seguido secuencialmente de `<h2>` para cada sección temática y `<h3>` para elementos internos, sin saltos de nivel).
- Paleta visual oscura con excelentes ratios de contraste en textos primarios (>16:1) y secundarios (>6:1), superando ampliamente los requerimientos WCAG AAA.
- Implementación de enlace de salto al contenido (`skip-link`) e indicador de foco visible (`:focus-visible`) con contorno sólido de 3 px.
- Respeto a las preferencias del sistema operativo mediante `prefers-reduced-motion`.
- Diseño responsive fluido en los anchos evaluados (320 px, 390 px, 768 px y escritorio), sin provocar desbordamiento horizontal (`scrollWidth == clientWidth`).

### Principales áreas de oportunidad
Al tratarse de una primera maqueta sin capa funcional de JavaScript:
1. **Navegación móvil bloqueante**: El menú móvil implementado exclusivamente con CSS mediante el truco del checkbox (`checkbox hack`) no se colapsa tras seleccionar un enlace interno, cubriendo más del 40% de la pantalla en dispositivos móviles y desorientando al usuario.
2. **Semántica y operación del menú con teclado/tecnologías de asistencia**: La casilla de verificación no cumple con el patrón WAI-ARIA de botón desplegable (`<button aria-expanded="..." aria-controls="...">`) y no responde a la tecla estándar `Escape`.
3. **Ambigüedad en nombres accesibles de enlaces**: Las tres tarjetas de membresía utilizan el texto genérico "Inscribirme" apuntando a `#contacto`, dificultando la navegación a usuarios de lectores de pantalla que navegan por lista de enlaces.
4. **Validación de formulario basada exclusivamente en color**: La pseudoclase `:user-invalid` solo altera el color de borde a rojizo, sin proporcionar mensajes textuales de error ni ayudas vinculadas al campo.
5. **Contraste de componentes no textuales**: El borde de los campos del formulario (`#262626`) sobre la tarjeta (`#171717`) tiene un ratio de solo 1.18:1 (requerido >= 3.0:1 según WCAG 2.2 SC 1.4.11).

---

## 2. Hallazgos críticos, altos, medios y bajos

| ID | Clasificación | Criterio / Estándar | Resumen del Hallazgo |
| :--- | :--- | :--- | :--- |
| **H-01** | **Crítico** | WCAG 2.2 SC 2.4.11, UX Móvil | Menú móvil no se cierra al pulsar enlaces internos y bloquea la visualización del contenido. |
| **H-02** | **Crítico** | WCAG 2.2 SC 4.1.2, SC 2.1.1 | Menú móvil implementado con `<input type="checkbox">` carece de semántica de botón, estados ARIA y cierre por teclado (Escape). |
| **H-03** | **Alto** | WCAG 2.2 SC 2.4.4, SC 2.4.9 | Enlaces repetidos con texto genérico "Inscribirme" sin diferenciación accesible por plan. |
| **H-04** | **Alto** | WCAG 2.2 SC 1.4.1, SC 3.3.1, RNF04 | Retroalimentación de error en formulario basada únicamente en cambio de color de borde. |
| **H-05** | **Alto** | WCAG 2.2 SC 1.4.11 | Ratio de contraste insuficiente en bordes delimitadores de campos de formulario (1.18:1 vs. 3.0:1). |
| **H-06** | **Medio** | WCAG 2.2 SC 2.5.8, UX Touch | Objetivos táctiles por debajo del mínimo de 24x24 px (pie de página: 20 px) y por debajo de 44 px en botón de menú móvil. |
| **H-07** | **Medio** | WCAG 2.2 SC 3.3.2, RNF04 | Ausencia de indicador visual y textual de obligatoriedad en campos del formulario de contacto. |
| **H-08** | **Medio** | WCAG 2.2 SC 1.4.3 | Contraste del texto de marcador de posición (placeholder: 4.29:1) ligeramente inferior al umbral de 4.5:1. |
| **H-09** | **Medio** | UX Responsive (760px–999px) | Disposición asimétrica de tarjetas de membresía en tablet (tercer plan queda huérfano en fila individual). |
| **H-10** | **Bajo** | Buenas prácticas HTML5 / ARIA | Uso de entidades HTML escapadas en atributo `aria-label` e inconsistencia de codificación UTF-8. |
| **H-11** | **Bajo** | WCAG 2.2 SC 2.4.1 | Falta de atributo `tabindex="-1"` en el elemento `<main id="main">` para garantizar foco programático en skip-link. |
| **H-12** | **Bajo** | Arquitectura del proyecto | Inexistencia física del archivo `script.js` en el repositorio del proyecto. |

---

## 3. Evidencia concreta

### Hallazgo H-01 (Crítico): Menú móvil bloqueante tras navegación
- **Archivo:** `css/styles.css` (líneas 701-718) e `index.html` (líneas 17-29).
- **Evidencia:** 
  Al activar el checkbox `#nav-toggle`, la regla CSS aplica:
  ```css
  .nav-toggle:checked ~ .main-nav {
    display: flex;
  }
  ```
  La navegación se posiciona como `position: absolute; top: 100%; left: 0; right: 0; background: var(--bg);` bajo la cabecera fija (`position: sticky; top: 0`). Durante las pruebas automatizadas en Microsoft Edge a 390 px de ancho, al hacer clic en `<a href="#planes">Planes</a>`, la propiedad `checkbox.checked` se mantiene en `true` y el menú continúa visible con una altura calculada de **352.25 px**, cubriendo más del 40% del alto del viewport (844 px). El usuario es desplazado a la sección pero no puede verla porque el menú permanece abierto encima.

### Hallazgo H-02 (Crítico): Falta de rol y control accesible en el menú móvil
- **Archivo:** `index.html` (líneas 17-19) y `css/styles.css` (líneas 673-699).
- **Evidencia:**
  ```html
  <input type="checkbox" id="nav-toggle" class="nav-toggle">
  <label for="nav-toggle" class="nav-toggle-label">Men&uacute;</label>
  ```
  Un lector de pantalla anuncia: *"Menú, casilla de verificación, no marcada"*. Al cambiar a marcada, no transmite el estado del contenedor de navegación que despliega. No cuenta con `aria-expanded="false/true"` ni `aria-controls="main-nav"`. Además, no existe gestión de eventos de teclado: presionar la tecla `Escape` no cierra el menú, incumpliendo las recomendaciones de patrones de menú WAI-ARIA.

### Hallazgo H-03 (Alto): Nombres accesibles no unívocos en botones de planes
- **Archivo:** `index.html` (líneas 64, 76, 88).
- **Evidencia:**
  En las tres tarjetas de membresía figura:
  - Tarjeta 1 (1 persona): `<a href="#contacto" class="btn btn-cta btn-block">Inscribirme</a>`
  - Tarjeta 2 (2 personas): `<a href="#contacto" class="btn btn-cta btn-block">Inscribirme</a>`
  - Tarjeta 3 (3 personas): `<a href="#contacto" class="btn btn-cta btn-block">Inscribirme</a>`
  Un usuario que navegue usando la lista de enlaces de un lector de pantalla (rotor de VoiceOver o menú de elementos en NVDA/JAWS) encuentra tres enlaces idénticos llamados *"Inscribirme"*, sin contexto para saber qué plan activa cada uno.

### Hallazgo H-04 (Alto): Retroalimentación de error basada únicamente en color
- **Archivo:** `css/styles.css` (líneas 581-584).
- **Evidencia:**
  ```css
  .field input:user-invalid,
  .field textarea:user-invalid {
    border-color: #f87171;
  }
  ```
  Al fallar la validación (por ejemplo, correo electrónico con formato inválido o campo vacío enviado), el formulario únicamente cambia el borde a color rojo (`#f87171`). No se genera ningún texto explicativo de error bajo el campo ni se asocia mediante `aria-describedby` o `aria-invalid="true"`. Las personas con dificultades para distinguir colores o usuarios de lectores de pantalla no reciben información sobre la causa del error.

### Hallazgo H-05 (Alto): Contraste insuficiente en bordes delimitadores de campos
- **Archivo:** `css/styles.css` (líneas 558-567).
- **Evidencia:**
  Los campos de entrada tienen el estilo:
  ```css
  .field input, .field textarea {
    border: 1px solid var(--border); /* #262626 */
    background: var(--bg); /* #0a0a0a */
  }
  ```
  La tarjeta que los contiene tiene fondo `var(--surface)` (`#171717`).
  - Ratio de contraste entre el borde `#262626` y la tarjeta `#171717`: **1.18:1**.
  - Ratio de contraste entre el fondo del input `#0a0a0a` y la tarjeta `#171717`: **1.18:1**.
  El criterio WCAG 2.2 SC 1.4.11 requiere al menos **3.0:1** para los límites visuales que permiten identificar controles interactivos, provocando que los campos se confundan con el fondo oscuro de la tarjeta.

### Hallazgo H-06 (Medio): Objetivos táctiles reducidos en footer y menú móvil
- **Archivo:** `css/styles.css` (líneas 608-613 y líneas 673-681).
- **Evidencia:**
  En la evaluación computada con Edge DevTools Protocol:
  - Enlaces `.footer-nav a` (Planes, Clases, Rutinas, Contacto): altura real de **20 px**. El criterio WCAG 2.2 SC 2.5.8 (Target Size Minimum) exige un tamaño mínimo de **24x24 px** a nivel AA, y las guías de UX táctil recomiendan **44x44 px**.
  - Botón `.nav-toggle-label`: dimensiones reales de **40.3 px de alto por 47.5 px de ancho**, pero con un padding lateral de solo `0.2rem` (3.2 px), quedando por debajo de los 44 px recomendados para evitar pulsaciones erróneas en móviles.

### Hallazgo H-07 (Medio): Falta de indicador visual de campos obligatorios
- **Archivo:** `index.html` (líneas 295-305).
- **Evidencia:**
  ```html
  <label for="nombre">Nombre completo</label>
  <input type="text" id="nombre" name="nombre" autocomplete="name" required>
  ```
  Los campos tienen el atributo HTML `required`, pero las etiquetas no incluyen ninguna indicación visual (como un asterisco con texto accesible o la leyenda "(obligatorio)"), ni existe una instrucción previa que indique que todos los campos son requeridos.

### Hallazgo H-08 (Medio): Contraste del placeholder en 4.29:1
- **Archivo:** `css/styles.css` (líneas 569-573).
- **Evidencia:**
  ```css
  .field input::placeholder,
  .field textarea::placeholder {
    color: #6b7684;
  }
  ```
  El contraste de `#6b7684` sobre el fondo `#0a0a0a` es de **4.29:1**, por debajo del mínimo de **4.5:1** exigido por WCAG 2.2 SC 1.4.3 para texto estándar.

### Hallazgo H-09 (Medio): Desbalance de cuadrícula de planes en tablet (760 px a 999 px)
- **Archivo:** `css/styles.css` (líneas 643-646).
- **Evidencia:**
  ```css
  @media (min-width: 760px) {
    .plan-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  ```
  Al existir 3 planes de membresía, a 768 px de ancho las tarjetas 1 y 2 ocupan la primera fila, mientras que la tarjeta 3 ("3 personas") se coloca en la segunda fila ocupando solo la columna izquierda y dejando la mitad derecha de la pantalla vacía.

### Hallazgo H-10 (Bajo): Entidades HTML escapadas en atributo ARIA
- **Archivo:** `index.html` (línea 317).
- **Evidencia:**
  ```html
  <nav aria-label="Navegaci&oacute;n del pie de p&aacute;gina">
  ```
  En contraste con la línea 20 (`aria-label="Navegación principal"`), la línea 317 mezcla entidades nombradas dentro de un atributo ARIA a pesar de que el documento declara codificación UTF-8.

### Hallazgo H-11 (Bajo): Enlace de salto sin foco programático en el contenedor principal
- **Archivo:** `index.html` (línea 33).
- **Evidencia:**
  ```html
  <main id="main">
  ```
  El enlace de salto apunta a `#main`. Sin `tabindex="-1"` en la etiqueta `<main>`, algunos navegadores desplazan visualmente la página pero no transfieren el foco programático de teclado al contenedor.

### Hallazgo H-12 (Bajo): Ausencia del archivo script.js en el proyecto
- **Archivo:** Directorio raíz / `index.html`.
- **Evidencia:**
  No existe el archivo `script.js` en el espacio de trabajo ni hay ninguna etiqueta `<script>` en `index.html`. Esto confirma que el comportamiento interactivo actual descansa únicamente en CSS y que aún no se ha incorporado la capa de JavaScript prevista para validaciones avanzadas y control de componentes.

---

## 4. Recomendación de corrección

### Para H-01 y H-02 (Menú móvil accesible y autocierre):
1. **Reemplazar el checkbox hack por un botón accesible:**
   ```html
   <button type="button" id="nav-toggle-btn" class="nav-toggle-btn" aria-expanded="false" aria-controls="main-nav" aria-label="Menú de navegación">
     <span class="nav-toggle-text">Menú</span>
   </button>
   ```
2. **Crear `script.js` con la gestión interactiva:**
   - Alternar `aria-expanded="true" / "false"` al pulsar el botón.
   - Cerrar el menú automáticamente cuando el usuario haga clic en cualquier enlace interno (`.nav-list a`).
   - Cerrar el menú al presionar la tecla `Escape` devolviendo el foco al botón de apertura.

### Para H-03 (Diferenciación de enlaces de planes):
Diferenciar los nombres accesibles de cada enlace utilizando `aria-label`:
```html
<!-- Tarjeta 1 -->
<a href="#contacto" class="btn btn-cta btn-block" aria-label="Inscribirme en el plan 1 persona por $35 al mes">Inscribirme</a>

<!-- Tarjeta 2 -->
<a href="#contacto" class="btn btn-cta btn-block" aria-label="Inscribirme en el plan 2 personas por $60 al mes">Inscribirme</a>

<!-- Tarjeta 3 -->
<a href="#contacto" class="btn btn-cta btn-block" aria-label="Inscribirme en el plan 3 personas por $85 al mes">Inscribirme</a>
```
*Recomendación de UX adicional:* Añadir un parámetro en la URL o manejar con JavaScript la preselección de la membresía en un selector del formulario de contacto.

### Para H-04 (Validación de errores accesible):
1. Incluir contenedores de error vinculados semánticamente en HTML:
   ```html
   <div class="field">
     <label for="correo">Correo electrónico <span aria-hidden="true">*</span></label>
     <input type="email" id="correo" name="correo" autocomplete="email" placeholder="tucorreo@ejemplo.com" required aria-describedby="correo-error">
     <span id="correo-error" class="field-error" aria-live="polite"></span>
   </div>
   ```
2. Mostrar mensajes de error visibles y descriptivos mediante texto e íconos, además de actualizar el borde.

### Para H-05 (Contraste de bordes de campos):
Aumentar la luminosidad del borde de los campos a un color con contraste mínimo 3.0:1 respecto al fondo y superficie (ej. `#525252` o `#6b6b6b`):
```css
.field input,
.field textarea {
  border: 1px solid #5a5a5a; /* Ratio > 3.2:1 respecto a #171717 */
  background: #0d0d0d;
}
```

### Para H-06 (Ampliación de objetivos táctiles):
1. En el pie de página:
   ```css
   .footer-nav a {
     display: inline-flex;
     align-items: center;
     min-height: 44px;
     padding: 0.35rem 0;
   }
   ```
2. En el botón de menú móvil:
   ```css
   .nav-toggle-btn {
     min-height: 44px;
     min-width: 44px;
     padding: 0.6rem 0.9rem;
   }
   ```
3. En los enlaces de navegación de escritorio: añadir padding vertical de al menos `0.5rem` para facilitar la interacción táctil en pantallas híbridas.

### Para H-07 (Indicador visual de obligatoriedad):
Añadir una indicación explícita en cada etiqueta y una nota explicativa:
```html
<p class="form-required-note">Los campos marcados con <span aria-hidden="true">*</span> son obligatorios.</p>
<label for="nombre">Nombre completo <span class="required-mark" aria-hidden="true">*</span></label>
```

### Para H-08 (Ajuste de contraste en placeholder):
Ajustar el color del placeholder a `#7c8794` o `#88929e`, logrando un contraste superior a 5.0:1 contra el fondo oscuro:
```css
.field input::placeholder,
.field textarea::placeholder {
  color: #88929e;
}
```

### Para H-09 (Cuadrícula balanceada en tablet):
Hacer que la tercera tarjeta ocupe el ancho completo de las dos columnas en resoluciones intermedias:
```css
@media (min-width: 760px) and (max-width: 999px) {
  .plan-list > :last-child {
    grid-column: 1 / -1;
    max-width: 480px;
    margin-inline: auto;
    width: 100%;
  }
}
```

### Para H-10 (Unificación UTF-8):
Reemplazar `&oacute;` y `&aacute;` por caracteres nativos:
```html
<nav aria-label="Navegación del pie de página">
```

### Para H-11 (Foco programático en main):
Añadir `tabindex="-1"` en la etiqueta `<main>`:
```html
<main id="main" tabindex="-1">
```

### Para H-12 (Creación de script.js):
Crear el archivo `js/script.js` o `script.js`, vincularlo con `<script src="script.js" defer></script>` antes del cierre de `</body>`, e implementar la lógica accesible del menú móvil y formularios.

---

## 5. Criterios que cumplen

Durante la auditoría se identificaron múltiples prácticas y criterios implementados de forma ejemplar:

1. **Estructura semántica HTML5 (RNF02, Semana 1):**
   - Empleo riguroso de elementos estructurales: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
   - Agrupación semántica correcta con listas no ordenadas (`<ul>`), listas de descripción (`<dl>`, `<dt>`, `<dd>` agrupados en `<div>` según la especificación W3C) y lista ordenada (`<ol class="flow">` para el flujo secuencial de 4 pasos).
   - Uso de landmark roles nativos con etiquetado ARIA diferenciado (`aria-label="Navegación principal"` frente a navegación secundaria).

2. **Jerarquía de encabezados (WCAG 2.2 SC 1.3.1 y 2.4.6):**
   - Un único encabezado principal de nivel 1 (`<h1>`) en la sección inicial (hero).
   - Todos los títulos de sección utilizan rigurosamente `<h2>`.
   - Los títulos de tarjetas internas (servicios, planes, clases, niveles, entrenadores) utilizan rigurosamente `<h3>`.
   - Cero saltos injustificados de nivel en el árbol de encabezados.

3. **Manejo accesible de elementos gráficos (WCAG 2.2 SC 1.1.1):**
   - Todos los íconos vectoriales SVG decorativos cuentan con `aria-hidden="true"`, evitando lecturas ruidosas e innecesarias en lectores de pantalla.
   - Las iniciales de avatar en la sección de entrenadores (`E1`, `E2`, `E3`) poseen `aria-hidden="true"`.

4. **Contraste de color en texto (WCAG 2.2 SC 1.4.3 Nivel AA y AAA):**
   - Texto principal (`#f5f5f5` sobre fondo `#0a0a0a`): ratio de **18.16:1** (supera ampliamente el umbral AAA de 7.0:1).
   - Texto atenuado (`#9a9a9a` sobre fondo `#0a0a0a`): ratio de **7.04:1** (cumple AAA).
   - Texto de acento rojo (`#ff3e3e` sobre fondo `#0a0a0a`): ratio de **5.67:1** (cumple AA > 4.5:1).
   - Botón de acción principal (texto `#0d0d0d` sobre fondo `#ff2b2b`): ratio de **5.21:1** (cumple AA > 4.5:1).

5. **Indicadores de foco visible (WCAG 2.2 SC 2.4.7 y SC 2.4.13):**
   - Regla global `:focus-visible` definida con `outline: 3px solid var(--accent); outline-offset: 3px; border-radius: 4px;` que proporciona una señal visual clara e inconfundible al navegar por teclado.
   - Presencia de enlace de salto al contenido principal (`.skip-link`) que se visualiza de forma destacada al recibir el foco.

6. **Compensación de desplazamiento bajo cabecera fija (WCAG 2.2 SC 2.4.11):**
   - Inclusión de `section[id] { scroll-margin-top: 84px; }`, lo que previene que los encabezados de las secciones queden ocultos bajo la barra de navegación pegajosa (sticky header) al activar enlaces de anclaje.

7. **Ausencia total de desbordamiento horizontal (WCAG 2.2 SC 1.4.10 Reflow):**
   - Verificado mediante pruebas automatizadas en Microsoft Edge a 320 px, 390 px, 768 px y 1200 px: el ancho de desplazamiento coincide exactamente con el ancho del cliente (`scrollWidth == clientWidth`), permitiendo un zoom de hasta 400% sin generar barra de desplazamiento horizontal.

8. **Respeto a las preferencias de animación (WCAG 2.2 SC 2.3.3):**
   - Implementación de `@media (prefers-reduced-motion: reduce)` anulando transiciones y desplazamiento suave para usuarios sensibles al movimiento.

9. **Buenas prácticas en etiquetas de formulario (Semana 2):**
   - Todos los controles interactivos del formulario cuentan con una etiqueta explícita (`<label for="...">` vinculada unívocamente al `id` correspondiente).
   - Presencia de atributos `autocomplete="name"` y `autocomplete="email"` conformes con WCAG 2.2 SC 1.3.5.

10. **Alineación con las reglas de negocio del levantamiento inicial:**
    - Se reflejan con exactitud los precios y planes mensuales reales: 1 persona ($35), 2 personas ($60) y 3 personas ($85).
    - Se incluye la oferta de clases grupales con sus especificaciones de horario y piso: Bailoterapia (miércoles en el 2.º piso) y Boxeo (lunes, miércoles, viernes y sábado por la mañana).
    - Se modela la secuencia formativa de evaluación a seguimiento basada en las buenas prácticas identificadas en Olympus Gym.

---

## 6. Criterios que todavía no aplican

Por tratarse del primer bosquejo visual y estructural del sitio, los siguientes criterios y requerimientos no fueron calificados como errores, ya que su desarrollo corresponde a etapas posteriores:

1. **Texto alternativo y optimización de imágenes fotográficas reales (WCAG 2.2 SC 1.1.1, RNF08):**
   - El documento de levantamiento establece el uso de fotografías reales de las instalaciones y entrenadores. En esta maqueta no se han incorporado etiquetas `<img>` ni archivos de imagen fotográfica; los espacios están representados mediante iniciales decorativas y tarjetas tipográficas con la nota explicativa explícita de que fotos y nombres se completarán en la siguiente versión.
2. **Formatos de imagen responsivos y carga diferida (`loading="lazy"`, `<picture>`, WebP/AVIF):**
   - No aplica por no haber activos gráficos de mapas de bits enlazados actualmente.
3. **Catálogo y comercialización de productos (RN09, RF14, RF15):**
   - En el levantamiento se describe la venta de ropa deportiva, agua ($1,00), yogurt proteico ($3,00) y batidos ($2,50). El bosquejo solo menciona productos en el texto institucional de la sección Nosotros; la cuadrícula de productos o tienda no forma parte de este primer entregable.
4. **Módulo administrativo y autenticación (Sección 18 del levantamiento):**
   - Las funcionalidades de gestión de clientes, registro de pagos y control de asistencias corresponden a etapas del backend/sistema y no aplican al bosquejo del frontend público.
5. **Sección de preguntas frecuentes (FAQ):**
   - Aunque se identificó como buena práctica en los sitios de referencia, no ha sido redactada ni maquetada en este primer prototipo.
6. **Procesamiento de formulario y almacenamiento de mensajes (RF01, RF05):**
   - El formulario tiene `action="#"` a nivel de maqueta estática, sin script de backend ni integración con base de datos o servicio de mensajería.

---

## 7. Pruebas que deberían repetirse después de corregir

Una vez implementadas las recomendaciones, se debe ejecutar el siguiente protocolo de re-evaluación técnica:

1. **Validación del menú móvil con lector de pantalla y teclado:**
   - Comprobar que el control sea reconocido como botón con estado de expansión (`aria-expanded="false"` que conmuta a `aria-expanded="true"`).
   - Comprobar que al presionar la tecla `Escape` el menú se cierre inmediatamente y el foco retorne al botón disparador.
   - Simular navegación móvil táctil y verificar que al hacer clic en cualquier enlace interno (ej. "Planes"), el menú se cierre al instante permitiendo visualizar la sección seleccionada.
2. **Revisión de nombres accesibles en el rotor/lista de enlaces:**
   - Extraer la lista de enlaces del documento y verificar que cada enlace de inscripción informe con claridad el plan al que corresponde sin ambigüedades.
3. **Pruebas de contraste instrumental de componentes de interfaz:**
   - Medir con una herramienta como Colour Contrast Analyser (CCA) o Chrome DevTools que el nuevo color de borde de los campos alcance al menos 3.0:1 frente al fondo circundante.
   - Confirmar que el texto de marcador de posición (placeholder) supere el ratio de 4.5:1.
4. **Verificación de validación y mensajes de error en formularios:**
   - Intentar enviar el formulario vacío y con formatos erróneos.
   - Confirmar que se muestren mensajes de error en texto identificando claramente el campo defectuoso y la instrucción de corrección, asociados mediante `aria-describedby`.
5. **Auditoría de tamaños de objetivo táctil (WCAG 2.2 SC 2.5.8):**
   - Verificar mediante DevTools que todos los enlaces del pie de página, botones y controles táctiles alcancen las dimensiones mínimas de 24x24 px (AA) y preferentemente 44x44 px para optimización de UX móvil.
6. **Inspección de layout en resolución tablet (768 px):**
   - Comprobar que la cuadrícula de planes no deje tarjetas huérfanas asimétricas en la segunda fila.
7. **Auditoría automatizada con herramientas estándar:**
   - Ejecutar auditorías completas con **Lighthouse** (categoría Accesibilidad >= 98), **Axe DevTools** (cero violaciones críticas o serias) y **WAVE Web Accessibility Evaluation Tool**.
8. **Prueba de sintaxis de JavaScript (al crear script.js):**
   - Validar que no se emitan errores de sintaxis en consola mediante linters (ESLint) o ejecución en navegadores modernos sin advertencias en tiempo de ejecución.
