import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { JSDOM } from "jsdom";

const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve("axe-core/axe.min.js"), "utf8");

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const dom = new JSDOM(html, { runScripts: "outside-only", url: "https://planetafitness.example/" });
const { window } = dom;
window.eval(axeSource);

const reglas = [
  "area-alt",
  "aria-allowed-attr",
  "aria-hidden-body",
  "aria-hidden-focus",
  "aria-required-attr",
  "aria-required-children",
  "aria-required-parent",
  "aria-roles",
  "aria-valid-attr-value",
  "aria-valid-attr",
  "button-name",
  "document-title",
  "duplicate-id",
  "duplicate-id-active",
  "form-field-multiple-labels",
  "frame-title",
  "heading-order",
  "html-has-lang",
  "html-lang-valid",
  "image-alt",
  "input-button-name",
  "label",
  "landmark-banner-is-top-level",
  "landmark-complementary-is-top-level",
  "landmark-contentinfo-is-top-level",
  "landmark-main-is-top-level",
  "landmark-no-duplicate-banner",
  "landmark-no-duplicate-contentinfo",
  "landmark-no-duplicate-main",
  "landmark-one-main",
  "landmark-unique",
  "link-name",
  "meta-viewport",
  "nested-interactive",
  "page-has-heading-one",
  "select-name",
  "svg-img-alt",
  "tabindex",
  "valid-lang"
];

const resultados = await window.axe.run(window.document, {
  runOnly: { type: "rule", values: reglas }
});

const violaciones = resultados.violations;

if (violaciones.length === 0) {
  console.log("ACCESIBILIDAD OK - " + reglas.length + " reglas axe-core sin violaciones (WCAG AA/ARIA).");
  process.exit(0);
}

console.error("ACCESIBILIDAD: se encontraron " + violaciones.length + " violaciones:\n");
for (const v of violaciones) {
  console.error(" - [" + (v.impact || "n/d") + "] " + v.id + ": " + v.help);
  v.nodes.forEach((n) => {
    console.error("     selector: " + n.target.join(" "));
    if (n.failureSummary) {
      n.failureSummary.split("\n").forEach((linea) => console.error("       " + linea));
    }
  });
}
process.exit(1);