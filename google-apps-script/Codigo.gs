/**
 * 004 — Recepción de solicitudes de la landing page
 * ─────────────────────────────────────────────────
 * Guarda cada solicitud como fila en la hoja de cálculo y envía un aviso
 * por correo. Se despliega como aplicación web y su URL es la que consume
 * el formulario del sitio.
 *
 * Instrucciones de despliegue en el README del repositorio.
 */

/** Destino de los avisos de nuevas solicitudes. */
var AVISAR_A = 'marketingby004@gmail.com';

/** Nombre de la pestaña donde se guardan las solicitudes. */
var NOMBRE_HOJA = 'Solicitudes';

/** Columnas, en orden. La primera fila se crea sola. */
var COLUMNAS = [
  'Recibido',
  'Tipo',
  'Nombre',
  'Email',
  'Empresa',
  'Servicio',
  'Fecha preferida',
  'Franja horaria',
  'Presupuesto',
  'Mensaje',
  'Consentimiento'
];


/** Punto de entrada del formulario. */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responder({ ok: false, error: 'Petición sin cuerpo' });
    }

    var datos = JSON.parse(e.postData.contents);

    // Trampa antispam: los bots rellenan todos los campos, incluido el
    // que está oculto. Si viene con contenido, respondemos ok y no
    // guardamos nada, para que el bot no sepa que fue detectado.
    if (datos.website) {
      return responder({ ok: true });
    }

    guardarFila(datos);
    avisarPorCorreo(datos);

    return responder({ ok: true });

  } catch (error) {
    // Queda registrado en Extensiones → Apps Script → Ejecuciones
    Logger.log('Error procesando la solicitud: ' + error);
    return responder({ ok: false, error: String(error) });
  }
}


/** Comprobación rápida: abre la URL en el navegador y debe responder ok. */
function doGet() {
  return responder({ ok: true, servicio: '004 — recepción de solicitudes' });
}


/** Devuelve la pestaña de solicitudes, creándola con cabeceras si no existe. */
function obtenerHoja() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(NOMBRE_HOJA);

  if (!hoja) {
    hoja = libro.insertSheet(NOMBRE_HOJA);
  }

  if (hoja.getLastRow() === 0) {
    hoja.appendRow(COLUMNAS);
    var cabecera = hoja.getRange(1, 1, 1, COLUMNAS.length);
    cabecera.setFontWeight('bold').setBackground('#F0EADA');
    hoja.setFrozenRows(1);
  }

  return hoja;
}


function guardarFila(datos) {
  var hoja = obtenerHoja();

  hoja.appendRow([
    new Date(),
    datos.tipo_solicitud === 'cotizacion' ? 'Cotización' : 'Reunión',
    datos.nombre || '',
    datos.email || '',
    datos.empresa || '',
    datos.servicio || '',
    datos.fecha || '',
    datos.horario || '',
    datos.presupuesto || '',
    datos.mensaje || '',
    datos.privacidad ? 'Sí' : 'No'
  ]);

  hoja.autoResizeColumns(1, COLUMNAS.length);
}


function avisarPorCorreo(datos) {
  if (!AVISAR_A || AVISAR_A.indexOf('CAMBIAR@') === 0) {
    return; // Aún sin configurar: se guarda la fila igualmente
  }

  var esCotizacion = datos.tipo_solicitud === 'cotizacion';
  var asunto = (esCotizacion ? 'Cotización' : 'Reunión') +
                 ' · ' + (datos.empresa || 'sin empresa') +
                 ' · ' + (datos.nombre || '');

  var lineas = [
    'Tipo:        ' + (esCotizacion ? 'Solicitud de cotización' : 'Solicitud de reunión'),
    'Nombre:      ' + (datos.nombre || '—'),
    'Email:       ' + (datos.email || '—'),
    'Empresa:     ' + (datos.empresa || '—'),
    'Servicio:    ' + (datos.servicio || '—')
  ];

  if (esCotizacion) {
    lineas.push('Presupuesto: ' + (datos.presupuesto || '—'));
  } else {
    lineas.push('Fecha:       ' + (datos.fecha || 'sin preferencia'));
    lineas.push('Horario:     ' + (datos.horario || '—'));
  }

  if (datos.mensaje) {
    lineas.push('', 'Mensaje:', datos.mensaje);
  }

  lineas.push('', 'Responder a: ' + (datos.email || ''));
  lineas.push(SpreadsheetApp.getActiveSpreadsheet().getUrl());

  MailApp.sendEmail({
    to: AVISAR_A,
    subject: asunto,
    body: lineas.join('\n'),
    replyTo: datos.email || undefined,
    name: '004 · Landing'
  });
}


/**
 * Apps Script no permite fijar cabeceras a mano. Se apoya en que las
 * respuestas de ContentService ya viajan con Access-Control-Allow-Origin,
 * y en que el formulario envía como texto plano para no disparar la
 * petición previa de CORS, que aquí no se puede atender.
 */
function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
