import { BaseService } from './BaseService.js';
import defaultPool from '../database/connection.js';

export const TIPOS_NOTIFICACION = Object.freeze({
  PLATILLO_LISTO: 'Platillo Listo',
  ALERTA_STOCK_MINIMO: 'Alerta Stock Mínimo'
});

export const ESTADOS_NOTIFICACION = Object.freeze({
  NO_LEIDA: 'No Leída',
  LEIDA: 'Leída',
  ENTREGADA: 'Entregada'
});

/**
 * Servicio de infraestructura para la entidad Notificacion
 */
export class NotificacionService extends BaseService {
  constructor(db = defaultPool) {
    super('notificacion', db);
  }

  /**
   * Crea una nueva notificación en el sistema
   * @param {Object} params
   * @param {'Platillo Listo'|'Alerta Stock Mínimo'} params.tipo
   * @param {string} params.mensaje
   * @param {'No Leída'|'Leída'|'Entregada'} [params.estado='No Leída']
   * @param {number} [params.usuario_destino_id=null]
   * @param {Date|string} [params.fecha_creacion=new Date()]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object>}
   */
  async create({
    tipo,
    mensaje,
    estado = ESTADOS_NOTIFICACION.NO_LEIDA,
    usuario_destino_id = null,
    fecha_creacion = new Date()
  }, client = null) {
    const tiposValidos = Object.values(TIPOS_NOTIFICACION);
    if (!tiposValidos.includes(tipo)) {
      throw new Error(`Tipo de notificación inválido: ${tipo}. Válidos: ${tiposValidos.join(', ')}`);
    }
    if (!mensaje || mensaje.trim() === '') {
      throw new Error('El mensaje de la notificación es obligatorio');
    }
    const estadosValidos = Object.values(ESTADOS_NOTIFICACION);
    if (!estadosValidos.includes(estado)) {
      throw new Error(`Estado de notificación inválido: ${estado}. Válidos: ${estadosValidos.join(', ')}`);
    }

    return super.create({
      tipo,
      mensaje: mensaje.trim(),
      estado,
      usuario_destino_id: usuario_destino_id ? Number(usuario_destino_id) : null,
      fecha_creacion
    }, client);
  }

  /**
   * Obtiene notificaciones con filtros y datos del usuario destinatario
   * @param {Object} [filters={}]
   * @param {number} [filters.usuario_destino_id]
   * @param {string} [filters.estado]
   * @param {string} [filters.tipo]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getAll({ usuario_destino_id, estado, tipo } = {}, client = null) {
    const clauses = [];
    const values = [];
    let paramIndex = 1;

    if (usuario_destino_id) {
      clauses.push(`n."usuario_destino_id" = $${paramIndex++}`);
      values.push(usuario_destino_id);
    }
    if (estado) {
      clauses.push(`n."estado" = $${paramIndex++}`);
      values.push(estado);
    }
    if (tipo) {
      clauses.push(`n."tipo" = $${paramIndex++}`);
      values.push(tipo);
    }

    let sql = `
      SELECT 
        n.*,
        u.nombre AS usuario_destino_nombre,
        u.rol AS usuario_destino_rol
      FROM "notificacion" n
      LEFT JOIN "usuario" u ON n.usuario_destino_id = u.id
    `;

    if (clauses.length > 0) {
      sql += ` WHERE ${clauses.join(' AND ')}`;
    }
    sql += ' ORDER BY n.fecha_creacion DESC, n.id DESC';

    const { rows } = await this.query(sql, values, client);
    return rows;
  }

  /**
   * Obtiene una notificación por su ID con datos del usuario
   * @param {number|string} id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async getById(id, client = null) {
    const sql = `
      SELECT 
        n.*,
        u.nombre AS usuario_destino_nombre,
        u.rol AS usuario_destino_rol
      FROM "notificacion" n
      LEFT JOIN "usuario" u ON n.usuario_destino_id = u.id
      WHERE n.id = $1
    `;
    const { rows } = await this.query(sql, [id], client);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Obtiene las notificaciones dirigidas a un usuario específico
   * @param {number|string} usuario_destino_id
   * @param {boolean} [soloNoLeidas=false]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getByUsuarioId(usuario_destino_id, soloNoLeidas = false, client = null) {
    return this.getAll({
      usuario_destino_id,
      estado: soloNoLeidas ? ESTADOS_NOTIFICACION.NO_LEIDA : undefined
    }, client);
  }

  /**
   * Marca una notificación como 'Leída'
   * @param {number|string} id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async marcarComoLeida(id, client = null) {
    return this.update(id, { estado: ESTADOS_NOTIFICACION.LEIDA }, client);
  }

  /**
   * Marca una notificación como 'Entregada' (cuando el mesero retira el plato o atiende la alerta)
   * @param {number|string} id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async marcarComoEntregada(id, client = null) {
    return this.update(id, { estado: ESTADOS_NOTIFICACION.ENTREGADA }, client);
  }

  /**
   * Crea una alerta de stock mínimo
   * @param {string} ingredienteNombre
   * @param {number} stockActual
   * @param {number} puntoReorden
   * @param {number} [usuarioDestinoId=null]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object>}
   */
  async crearAlertaStockMinimo(ingredienteNombre, stockActual, puntoReorden, usuarioDestinoId = null, client = null) {
    const mensaje = `ALERTA STOCK MÍNIMO: El insumo "${ingredienteNombre}" tiene un stock actual de ${stockActual}, por debajo o igual al punto de reorden (${puntoReorden}).`;
    return this.create({
      tipo: TIPOS_NOTIFICACION.ALERTA_STOCK_MINIMO,
      mensaje,
      usuario_destino_id: usuarioDestinoId
    }, client);
  }

  /**
   * Crea una notificación de platillo listo para servir
   * @param {string} platoNombre
   * @param {string} mesaNumero
   * @param {number} [meseroId=null]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object>}
   */
  async crearNotificacionPlatilloListo(platoNombre, mesaNumero, meseroId = null, client = null) {
    const mensaje = `Platillo listo: "${platoNombre}" para la Mesa ${mesaNumero}. Listo para servir.`;
    return this.create({
      tipo: TIPOS_NOTIFICACION.PLATILLO_LISTO,
      mensaje,
      usuario_destino_id: meseroId
    }, client);
  }
}

export default NotificacionService;
