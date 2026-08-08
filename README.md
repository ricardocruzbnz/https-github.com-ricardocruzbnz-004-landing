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

## Conectar el formulario

Por defecto el formulario está en **modo demo**: valida, muestra el estado de
éxito y escribe los datos en la consola, pero no envía nada a ningún lado.

Para conectarlo, abre `script.js` y cambia la primera constante:

```js
var FORM_ENDPOINT = 'https://tu-endpoint.com/leads';
```

Hará un `POST` en JSON con estos campos:

| Campo | Descripción |
|---|---|
| `tipo_solicitud` | `reunion` o `cotizacion` |
| `nombre`, `email`, `empresa` | Datos de contacto |
| `servicio` | Servicio de interés |
| `fecha`, `horario` | Solo en "Agendar reunión" |
| `presupuesto` | Solo en "Solicitar cotización" |
| `mensaje` | Opcional |
| `privacidad` | Consentimiento de contacto |
| `enviado_en` | Timestamp ISO |

Sirve cualquier servicio que acepte JSON: Formspree, Basin, HubSpot Forms, una
función serverless propia, etc. Si prefieres un calendario embebido (Calendly,
Cal.com), reemplaza el bloque `.form-wrap` de `index.html` por el iframe.

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
--ink:    #0E0E0E;   /* negro principal */
--accent: #1F3BEB;   /* azul de acento */
--paper:  #FFFFFF;
```

La tipografía usa el stack del sistema con `Inter` primero. Si quieres cargar
Inter como webfont, añade el `<link>` en el `<head>` de `index.html`.

## Notas técnicas

- Responsive en tres cortes: 980px, 860px (menú hamburguesa) y 640px.
- Accesibilidad: enlace de salto al contenido, `aria-*` en pestañas y menú,
  foco visible, y respeta `prefers-reduced-motion`.
- SEO básico: `<title>`, meta description y Open Graph. Falta añadir
  `og:image` y `og:url` cuando tengas dominio.
