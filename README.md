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

## Qué debes reemplazar antes de publicar

Está marcado con comentarios `<!-- Reemplazar ... -->` en `index.html`:

- **Métricas del hero** (40+ clientes, 180%, 92%) — están como marcador de posición.
- **Nombres de clientes** en la franja "Trabajamos con equipos de".
- **Casos de resultados** (−38%, 3,4×, +210%) y el **testimonio**, que hoy tiene
  atribución genérica.
- **Datos de contacto**: `hola@004.agency` y el teléfono aparecen en la sección de
  contacto y en el footer.
- **Enlaces de redes** en el footer (hoy apuntan a `#`).
- **Aviso de privacidad**: falta la página real.

## Personalización rápida

Los colores y espaciados viven en `:root`, al inicio de `styles.css`:

```css
--ink:      #0E0E0E;  /* negro    hsl(0 0% 5%)       */
--brown:    #9F512D;  /* café     hsl(19 56% 40%)    */
--blue:     #1F8FFF;  /* azul     hsl(210 100% 56%)  */
--blue-ink: #0066CC;  /* mismo azul, legible sobre beige */
--paper:    #FFEFD6;  /* beige    hsl(37 100% 92%)   */
```

**Cuidado al tocar los tonos.** El azul `--blue` da 2,89:1 sobre el beige, por
debajo del mínimo de 4,5:1 que exige WCAG AA para texto. Por eso solo aparece
como grafismo (viñetas, reglas, subrayados) o sobre los bloques negros, donde
rinde 5,91:1. Todo texto pequeño en azul usa `--blue-ink`, el mismo tono al
40 % de luminosidad, que da 4,92:1.

Lo mismo con `--paper-alt`: si lo oscureces, el café baja de 4,5:1 y el texto
secundario de las secciones alternas deja de cumplir.

La tipografía usa el stack del sistema con `Inter` primero. Si quieres cargar
Inter como webfont, añade el `<link>` en el `<head>` de `index.html`.

## Notas técnicas

- Responsive en tres cortes: 980px, 860px (menú hamburguesa) y 640px.
- Accesibilidad: enlace de salto al contenido, `aria-*` en pestañas y menú,
  foco visible, y respeta `prefers-reduced-motion`.
- SEO básico: `<title>`, meta description y Open Graph. Falta añadir
  `og:image` y `og:url` cuando tengas dominio.
