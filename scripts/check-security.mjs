import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

const errores = [];

function valores(atributo) {
  const re = new RegExp(`\\b${atributo}\\s*=\\s*"([^"]+)"`, "gi");
  return [...html.matchAll(re)].map((m) => m[1]);
}

const visitados = new Set();
function reportar(origen, url) {
  const clave = origen + url;
  if (visitados.has(clave)) return;
  visitados.add(clave);
  console.log(`   ${origen}: ${url}`);
}

const hrefs = valores("href");
const srcs = valores("src");

for (const url of hrefs) {
  if (/^javascript:/i.test(url)) {
    errores.push(`Enlace inseguro 'javascript:' encontrado en href="${url}"`);
    reportar("href", url);
    continue;
  }
  if (/^http:\/\//i.test(url)) {
    errores.push(`Enlace externo sin HTTPS en href="${url}"`);
    reportar("href", url);
    continue;
  }
  if (/^data:/i.test(url) && /<a\b[^>]*href="data:/i.test(html)) {
    errores.push(`Enlace data: en href="${url}"`);
    reportar("href", url);
  }
}

for (const url of srcs) {
  if (/^http:\/\//i.test(url)) {
    errores.push(`Recurso sin HTTPS en src="${url}"`);
    reportar("src", url);
  }
}

const youtube = [];
const patronYoutube = /(?:^|\.)(youtu\.be|youtube\.com|youtube-nocookie\.com|music\.youtube\.com)$/i;
for (const url of hrefs.concat(srcs)) {
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    continue;
  }
  if (patronYoutube.test(host)) youtube.push(url);
}

console.log("SEGURIDAD DE ENLACES");
if (youtube.length === 0) {
  console.log("   No se detectaron enlaces de YouTube en el sitio.");
} else {
  console.log("   Enlaces de YouTube detectados (" + youtube.length + "):");
  youtube.forEach((u) => {
    console.log("   - " + u);
    if (!/^https:\/\//i.test(u)) errores.push(`Enlace de YouTube sin HTTPS: ${u}`);
    if (/youtube\.com\/embed\//i.test(u) && !/youtube-nocookie\.com/i.test(u)) {
      errores.push(`Embed de YouTube NO usa youtube-nocookie (privacidad): ${u}`);
    }
  });
}

const linksExternosTab = [];
const anclas = [...html.matchAll(/<a\b[^>]*>/gi)].map((m) => m[0]);
for (const a of anclas) {
  const href = /href\s*=\s*"([^"]+)"/i.exec(a)?.[1] || "";
  if (!/^https?:\/\//i.test(href)) continue;
  const rel = /rel\s*=\s*"([^"]+)"/i.exec(a)?.[1] || "";
  const target = /target\s*=\s*"([^"]+)"/i.exec(a)?.[1] || "";
  if (/^_blank$/i.test(target) && !/\bnoopener\b/i.test(rel) && !/\bnoreferrer\b/i.test(rel)) {
    errores.push(`target="_blank" sin rel noopener/noreferrer en href="${href}"`);
  }
  linksExternosTab.push(href);
}
if (linksExternosTab.length > 0) {
  console.log("   Enlaces externos (" + linksExternosTab.length + "):");
  linksExternosTab.forEach((u) => console.log("   - " + u));
}

console.log("\nADAPTABILIDAD");
const metaViewport = /<meta\b[^>]*\bname\s*=\s*"viewport"[^>]*\bcontent\s*=\s*"([^"]+)"/i.exec(html)?.[1] || "";
const viewport = metaViewport;
if (!viewport) {
  errores.push("Falta la meta viewport (adaptabilidad móvil).");
} else {
  if (!/\bwidth=device-width\b/.test(viewport)) {
    errores.push("viewport no usa width=device-width: " + viewport);
  }
  if (viewport.includes("initial-scale") && !/\binitial-scale=1\b/.test(viewport)) {
    errores.push("viewport con initial-scale distinto de 1: " + viewport);
  }
  console.log("   meta viewport: " + viewport);
}

const lang = /<html\b[^>]*\blang\s*=\s*"([^"]+)"/i.exec(html)?.[1] || "";
if (!lang) {
  errores.push("Falta el atributo lang en <html>.");
} else {
  console.log("   <html lang=\"" + lang + "\">");
}

const fijas = /width\s*[:=]\s*\d{3,}px/gi;
if (fijas.test(html)) errores.push("Posible ancho fijo (px) que rompe la adaptabilidad.");

if (errores.length > 0) {
  console.error("\nSEGURIDAD/ADAPTABILIDAD: " + errores.length + " problema(s) encontrado(s):");
  errores.forEach((e) => console.error("   [ERROR] " + e));
  process.exit(1);
}

console.log("\nSEGURIDAD/ADAPTABILIDAD OK - enlaces seguros y metadatos responsive correctos.");