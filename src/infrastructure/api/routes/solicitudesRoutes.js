import {
  ESTADOS_SOLICITUD,
  TRANSICIONES_PERMITIDAS,
  SECUENCIA_PASO
} from '../../../domain/entities/Solicitud.js';
import { defaultContainer } from '../../container.js';

/**
 * Enrutador de Solicitudes y KDS
 * Recibe las dependencias desde el contenedor de inyección (Composition Root)
 */
export async function handleSolicitudesRoutes(
  req,
  res,
  { path, method, query, params, body },
  container = defaultContainer
) {
  const {
    pasoSolicitudUseCase,
    crearSolicitudUseCase,
    consultarKdsUseCase,
    detalleCuentaService,
    notificacionService
  } = container;

  // 1. GET /api/solicitudes/estados -> Metadatos de la máquina de estados
  if (method === 'GET' && path === '/api/solicitudes/estados') {
    return sendJson(res, 200, {
      success: true,
      estados: Object.values(ESTADOS_SOLICITUD),
      transicionesPermitidas: TRANSICIONES_PERMITIDAS,
      secuenciaPaso: SECUENCIA_PASO
    });
  }

  // 2. GET /api/solicitudes/kds -> Consulta optimizada para pantalla de cocina
  if (method === 'GET' && path === '/api/solicitudes/kds') {
    const agrupar = query.agrupado === 'true' || query.agrupado === '1';
    const umbral = query.umbral ? Number(query.umbral) : 15;
    const resultado = await consultarKdsUseCase.execute({
      agruparPorColumnas: agrupar,
      umbralDemoraMinutos: umbral
    });
    return sendJson(res, 200, { success: true, data: resultado });
  }

  // 3. GET /api/solicitudes/notificaciones -> Notificaciones de platillos listos para meseros
  if (method === 'GET' && path === '/api/solicitudes/notificaciones') {
    const meseroId = query.mesero_id ? Number(query.mesero_id) : null;
    const soloNoLeidas = query.solo_no_leidas === 'true';
    let notifs;
    if (meseroId) {
      notifs = await notificacionService.getByUsuarioId(meseroId, soloNoLeidas);
    } else {
      notifs = await notificacionService.getAll({
        tipo: 'Platillo Listo',
        estado: soloNoLeidas ? 'No Leída' : undefined
      });
    }
    return sendJson(res, 200, { success: true, count: notifs.length, data: notifs });
  }

  // 4. POST /api/solicitudes -> Crear y pasar nueva orden a cocina (HU-003.4)
  if (method === 'POST' && path === '/api/solicitudes') {
    if (!body || typeof body !== 'object') {
      return sendJson(res, 400, { success: false, error: 'Cuerpo de solicitud JSON inválido o ausente.' });
    }
    const { cuenta_id, mesa_id, items } = body;
    const resultado = await crearSolicitudUseCase.execute({
      cuenta_id: cuenta_id ? Number(cuenta_id) : null,
      mesa_id: mesa_id ? Number(mesa_id) : null,
      items
    });
    return sendJson(res, 201, {
      success: true,
      message: 'Solicitud enviada a cocina exitosamente.',
      data: resultado
    });
  }

  // 5. PATCH /api/solicitudes/:id/avanzar -> Paso al siguiente estado secuencial (HU-006.2)
  const matchAvanzar = path.match(/^\/api\/solicitudes\/(\d+)\/avanzar$/);
  if (method === 'PATCH' && matchAvanzar) {
    const solicitudId = Number(matchAvanzar[1]);
    const resultado = await pasoSolicitudUseCase.execute({ solicitudId });
    return sendJson(res, 200, {
      success: true,
      message: `Solicitud #${solicitudId} avanzó de "${resultado.estadoAnterior}" a "${resultado.nuevoEstado}".`,
      data: resultado
    });
  }

  // 6. PATCH /api/solicitudes/:id/estado -> Cambio a un estado específico con validación
  const matchEstado = path.match(/^\/api\/solicitudes\/(\d+)\/estado$/);
  if (method === 'PATCH' && matchEstado) {
    const solicitudId = Number(matchEstado[1]);
    const { nuevoEstado, motivo } = body || {};
    if (!nuevoEstado) {
      return sendJson(res, 400, { success: false, error: 'Debe proporcionar el campo "nuevoEstado".' });
    }
    const resultado = await pasoSolicitudUseCase.execute({
      solicitudId,
      nuevoEstado,
      motivoCancelacion: motivo
    });
    return sendJson(res, 200, {
      success: true,
      message: `Solicitud #${solicitudId} cambió de "${resultado.estadoAnterior}" a "${resultado.nuevoEstado}".`,
      data: resultado
    });
  }

  // 7. POST /api/solicitudes/:id/cancelar -> Cancelar una solicitud
  const matchCancelar = path.match(/^\/api\/solicitudes\/(\d+)\/cancelar$/);
  if (method === 'POST' && matchCancelar) {
    const solicitudId = Number(matchCancelar[1]);
    const { motivo } = body || {};
    const resultado = await pasoSolicitudUseCase.execute({
      solicitudId,
      nuevoEstado: ESTADOS_SOLICITUD.CANCELADO,
      motivoCancelacion: motivo
    });
    return sendJson(res, 200, {
      success: true,
      message: `Solicitud #${solicitudId} cancelada.`,
      data: resultado
    });
  }

  // 8. GET /api/solicitudes/:id -> Obtener una solicitud individual por ID
  const matchGetOne = path.match(/^\/api\/solicitudes\/(\d+)$/);
  if (method === 'GET' && matchGetOne) {
    const solicitudId = Number(matchGetOne[1]);
    const item = await detalleCuentaService.getById(solicitudId);
    if (!item) {
      return sendJson(res, 404, { success: false, error: `Solicitud con ID ${solicitudId} no encontrada.` });
    }
    return sendJson(res, 200, { success: true, data: item });
  }

  // 9. GET /api/solicitudes -> Listar todas las solicitudes con filtros
  if (method === 'GET' && path === '/api/solicitudes') {
    const filters = {};
    if (query.cuenta_id) filters.cuenta_id = Number(query.cuenta_id);
    if (query.plato_id) filters.plato_id = Number(query.plato_id);
    if (query.estado) filters.estado = query.estado;

    const items = await detalleCuentaService.getAll(filters);
    return sendJson(res, 200, { success: true, count: items.length, data: items });
  }

  // Ruta no encontrada en este handler
  return null;
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
  return true;
}

export default handleSolicitudesRoutes;
