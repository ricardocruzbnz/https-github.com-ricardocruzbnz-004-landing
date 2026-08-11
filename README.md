# 004 — Landing Page

Landing page estática para la agencia de marketing **004**. Sin dependencias,
sin build step: tres archivos y listo.

```
index.html    Estructura y contenido
styles.css    Diseño completo (tokens de color, tipografía, responsive)
script.js     Menú móvil, animaciones, pestañas y validación del formulario
```

## Ver el sitio

Abre `index.html` directamente en el navegador, o levanta un servidor local:

```bash
python3 -m http.server 4173
```

Luego entra a `http://localhost:4173`.

## Conectar el formulario (Google Sheets)

Por defecto el formulario está en **modo demo**: valida, muestra el estado de
éxito y escribe los datos en la consola, pero no envía nada a ningún lado.

Las solicitudes se reciben con Google Apps Script: cada envío se guarda como
fila en una hoja de cálculo y dispara un aviso por correo. Sin coste y sin
instalar nada.

### Despliegue

1. Crea una hoja de cálculo nueva en [sheets.new](https://sheets.new) y ponle
   nombre, por ejemplo *004 · Solicitudes*.
2. En esa hoja: **Extensiones** → **Apps Script**.
3. Borra el contenido del editor y pega entero
   [`google-apps-script/Codigo.gs`](google-apps-script/Codigo.gs).
4. Cambia la constante `AVISAR_A` por el correo donde quieras los avisos.
   Guarda con `Cmd+S`.
5. Botón **Implementar** → **Nueva implementación** → tipo **Aplicación web**.
   - *Ejecutar como*: **Yo**
   - *Quién tiene acceso*: **Cualquier usuario**  ← imprescindible; sin esto
     el sitio no puede escribir.
6. Autoriza los permisos. Google mostrará un aviso de app no verificada:
   **Configuración avanzada** → *Ir a (nombre del proyecto)*. Es normal, el
   script es tuyo.
7. Copia la **URL de la aplicación web** (termina en `/exec`) y ponla en
   `script.js`:

```js
var FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfy.../exec';
```

Para comprobar que quedó bien, abre esa URL en el navegador: debe responder
`{"ok":true,...}`.

### Datos que se envían

| Campo | Descripción |
|---|---|
| `tipo_solicitud` | `reunion` o `cotizacion` |
| `nombre`, `email`, `empresa` | Datos de contacto |
| `servicio` | Servicio de interés |
| `fecha`, `horario` | Solo en "Agendar reunión" |
| `presupuesto` | Solo en "Solicitar cotización" |
| `mensaje` | Opcional |
| `privacidad` | Consentimiento de contacto |
| `website` | Trampa antispam, siempre vacío en envíos reales |
| `enviado_en` | Marca de tiempo ISO |

### Dos detalles que no son evidentes

**Se envía como `text/plain`, no como `application/json`.** Con JSON el
navegador manda antes una petición `OPTIONS` de comprobación que Apps Script
no sabe atender, y la solicitud se pierde. El cuerpo sigue siendo JSON; solo
cambia la etiqueta. No lo cambies a `application/json` "para arreglarlo".

**La URL es pública.** Cualquiera puede enviarle datos. Por eso el formulario
lleva un campo trampa (`website`), oculto por CSS: las personas no lo ven, los
bots lo rellenan, y el script descarta esos envíos. Si algún día llega spam en
volumen, el siguiente paso sería reCAPTCHA.

### Si cambias el código del script

Cada modificación necesita **Implementar** → **Gestionar implementaciones** →
editar → *Versión: Nueva versión*. Si solo guardas, el sitio seguirá usando la
versión anterior.

## Qué queda pendiente

Todo el contenido publicado es real y verificado con la agencia. Lo que
falta por añadir:

- **Aviso de privacidad.** El formulario recaba nombre, correo, empresa y
  mensaje. La LFPDPPP obliga a publicarlo. Lo redacta la agencia; después hay
  que crear la página y devolver el enlace al pie.
- **Sección de equipo.** "Quién está detrás", pendiente de redactar.
- **Imágenes.** La página no tiene ninguna. El manual de marca usa degradados
  granulados que encajarían en el hero y en los bloques oscuros.

## Personalización rápida

Los colores y espaciados viven en `:root`, al inicio de `styles.css`. Son los
cuatro del manual de marca, sin añadidos:

```css
--cream:    #F0EADA;  /* fondo                      */
--grey:     #C5C1B7;  /* líneas y grafismo          */
--brown:    #855C4C;  /* texto secundario y acento  */
--espresso: #533C36;  /* texto principal y bloques oscuros */
```

**Dos reglas que no se pueden romper**, medidas y no estimadas:

- El **gris nunca lleva texto**. Sobre la crema da 1,50:1, muy por debajo del
  4,5:1 que exige WCAG AA. Solo sirve para líneas y separadores.
- El **café no se usa sobre los bloques espresso**: da 1,76:1. Ahí el acento
  es crema (8,46:1) o gris (5,65:1).

Sobre la crema: espresso 8,46:1 · café 4,81:1. Los dos cumplen para texto.

Hay cuatro valores derivados, todos mezclas de esos mismos colores:
`--paper-alt` (crema + 14 % gris, no oscurecer más o el café cae de 4,5:1),
`--line-soft`, `--ink-lift` para el hover de botones, y `--placeholder`.

`--danger` (#8E3B2A) es **el único color fuera del manual**. Un mensaje de
error en café no se lee como error: es color semántico, no decorativo. Está
desplazado hacia la familia cálida de la marca y rinde 6,22:1.

## Tipografías

```css
--font-display: "Poppins";  /* títulos y todo lo que lleve peso */
--font-body:    "Alatsi";   /* texto corrido                    */
--font-accent:  "Lora";     /* cursivas: la voz de la marca     */
```

Se cargan desde Google Fonts con el `<link>` del `<head>`.

**Poppins sustituye a TT Wellingtons**, que es una tipografía comercial de
TypeType y no se puede servir sin licencia. Es la aproximación más cercana
disponible libremente: geométrica, de formas circulares, como los ceros del
logotipo. Si compras la licencia de TT Wellingtons, basta con alojar los
archivos y cambiar `--font-display`.

**Alatsi solo existe en peso 400.** No tiene negrita. Por eso todo lo que
necesita peso —botones, rótulos, etiquetas, números de servicio, `<strong>`—
está declarado con `--font-display`. Si asignas Alatsi a alguno de esos
elementos, el navegador fingirá la negrita y se verá sucio.

La tipografía usa el stack del sistema con `Inter` primero. Si quieres cargar
Inter como webfont, añade el `<link>` en el `<head>` de `index.html`.

## Notas técnicas

- Responsive en tres cortes: 980px, 860px (menú hamburguesa) y 640px.
- Accesibilidad: enlace de salto al contenido, `aria-*` en pestañas y menú,
  foco visible, y respeta `prefers-reduced-motion`.
- SEO básico: `<title>`, meta description y Open Graph. Falta añadir
  `og:image` y `og:url` cuando tengas dominio.
