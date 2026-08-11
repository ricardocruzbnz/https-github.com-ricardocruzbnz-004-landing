# 004 — Landing Page

Sitio estático de una sola página para **004**, agencia creativa de marketing.
Sin dependencias, sin build step: `index.html`, `styles.css`, `script.js`.

- **Producción:** https://004-landing.vercel.app
- **Repo:** github.com/ricardocruzbnz/https-github.com-ricardocruzbnz-004-landing
  (el nombre largo salió de pegar la URL en el campo del nombre; el proyecto de
  Vercel sí se llama `004-landing`)
- **Objetivo de la página:** agendar una reunión o solicitar una cotización.

## Cómo se despliega

`git push origin main` → Vercel publica solo en unos 30 s. La credencial de
GitHub está en el llavero de macOS, así que el push no pide contraseña.

Para comprobar que un cambio llegó a producción, esperar al despliegue en vez
de dormir un tiempo fijo:

```bash
until curl -s "https://004-landing.vercel.app/?cb=$RANDOM" | grep -q "TEXTO_NUEVO"; do sleep 5; done
```

## Entorno: qué NO hay en esta máquina

No están instalados **Node, npm, npx, Homebrew, gh, ni herramientas de PDF**
(poppler, PyPDF2…). Sí hay `git`, `python3` y `curl`.

Para generar imágenes se usa `sips`, que viene con macOS y convierte SVG a PNG:

```bash
sips -s format png og.svg --out og.png
```

Su renderizador de SVG tiene dos rarezas ya sorteadas en `og.svg`: **ignora los
estilos dentro de `tspan`** (por eso los fragmentos de texto van en elementos
separados con la `x` calculada a mano) y **no resuelve la variante oblicua** de
las fuentes (por eso la cursiva se consigue con `skewX(-10)`).

## Marca

**Eslogan:** Marcas memorables. Negocios que trascienden.

Agencia creativa **B2C únicamente**, base en **Guadalajara** con cobertura
nacional. Cliente objetivo: emprendedores y fundadores de PyMEs.

**Los cuatro servicios** (de ahí el nombre; la numeración 001–004 no es
decorativa) y sus plazos máximos:

| # | Servicio | Entrega |
|---|---|---|
| 001 | Arquitectura e identidad corporativa | 21 días naturales |
| 002 | Estrategias y posicionamiento B2C | 21 días naturales |
| 003 | Dirección creativa y narrativa visual | 14 días naturales |
| 004 | Consultoría de escalamiento comercial | 21 días (diagnóstico) · 3–6 meses (con acompañamiento) |

Precios de referencia: **$8,000 a $16,000 MXN**, todo cotizado a medida.

**Contacto:** marketingby004@gmail.com · WhatsApp 33 1423 9621 ·
Instagram @004marketing. No hay LinkedIn ni Behance.

Misión, visión, principios y valores están redactados en la página (hero,
sección `#agencia` y bloque oscuro). Salen del manual de marca en Canva.

## Reglas de diseño que no se pueden romper

Están medidas, no estimadas. Los detalles y los números viven en los
comentarios de `:root` en `styles.css` y en el README.

- **Solo los cuatro colores del manual**: crema `#F0EADA`, gris `#C5C1B7`,
  café `#855C4C`, espresso `#533C36`. Nada de azules ni negros.
- **El gris nunca lleva texto** (1,50:1 sobre la crema).
- **El café no se usa sobre los bloques espresso** (1,76:1). Ahí el acento es
  crema o gris.
- **Alatsi no tiene negrita.** Todo lo que necesite peso va en `--font-display`
  (Poppins). Hay una regla global para `strong`.
- **Poppins es un sustituto temporal de TT Wellingtons**, que es comercial y la
  agencia aún no tiene licencia.

## Formulario

Va a Google Sheets vía Apps Script. El README tiene el despliegue completo.
Dos cosas que cuestan tiempo si no se saben:

1. **Se envía como `text/plain`, no como `application/json`.** Con JSON el
   navegador manda un `OPTIONS` previo que Apps Script no atiende y la solicitud
   se pierde. No "arreglarlo".
2. **Guardar el script no basta: hay que volver a implementar.** Apps Script
   publica una instantánea congelada. Implementar → Gestionar implementaciones →
   lápiz → Versión: *Nueva versión*.

`google-apps-script/Codigo.gs` es **una copia de referencia**. La que se ejecuta
es la del editor de Apps Script de la agencia; cambiar el archivo del repo no
altera el comportamiento del formulario.

El script está escrito en ES5 a propósito (`var`, sin plantillas literales): si
el proyecto no usa el motor V8, un solo `const` impide leer el archivo entero y
Apps Script se queda sin ninguna función.

## Cómo trabajar en este proyecto

**No inventar datos.** Ha sido el hilo conductor de todo el proyecto: precios,
plazos, métricas, clientes, testimonios y condiciones de contrato. Si un dato no
está confirmado por la agencia, se deja el hueco y se pregunta. Es preferible
una sección más corta que una cifra inventada publicada como real.

**Verificar en el navegador, no suponer.** Antes de dar algo por bueno: recargar
en el preview, medir contrastes sobre el DOM, revisar consola y comprobar móvil.
El servidor local sirve CSS y HTML cacheados con frecuencia — forzar recarga
sustituyendo el `href` de la hoja de estilos por `styles.css?v=` + timestamp.
