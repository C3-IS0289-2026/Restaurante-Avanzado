/**
 * Contratos / Interfaces de Repositorios y Puertos de Dominio (DDD + SOLID ISP & DIP)
 * En JavaScript (POO sin TypeScript), las clases base abstractas definen los contratos
 * esperados por la capa de Aplicación sin acoplarla a detalles de Infraestructura (PostgreSQL).
 */

export class IRepository {
  constructor() {
    if (new.target === IRepository) {
      throw new TypeError('IRepository es un contrato abstracto y no puede instanciarse directamente.');
    }
  }

  async getById(_id) {
    throw new Error('Método getById() debe ser implementado por la subclase concreta.');
  }

  async getAll(_filters) {
    throw new Error('Método getAll() debe ser implementado por la subclase concreta.');
  }

  async create(_data) {
    throw new Error('Método create() debe ser implementado por la subclase concreta.');
  }

  async update(_id, _data) {
    throw new Error('Método update() debe ser implementado por la subclase concreta.');
  }

  async delete(_id) {
    throw new Error('Método delete() debe ser implementado por la subclase concreta.');
  }
}

/**
 * Contrato segregado para persistencia y consulta KDS de Solicitudes (ISP)
 */
export class ISolicitudRepository extends IRepository {
  async getKdsItems(_estados) {
    throw new Error('Método getKdsItems() debe ser implementado.');
  }
}

/**
 * Contrato segregado para gestión de Cuentas de Mesa (ISP)
 */
export class ICuentaRepository extends IRepository {
  async getByMesaId(_mesaId, _soloAbiertas = true) {
    throw new Error('Método getByMesaId() debe ser implementado.');
  }

  async recalcularTotales(_cuentaId, _porcentajeImpuesto) {
    throw new Error('Método recalcularTotales() debe ser implementado.');
  }
}

/**
 * Contrato segregado para consulta de Platillos (ISP)
 */
export class IPlatoRepository extends IRepository {}

/**
 * Contrato segregado para consulta de Inventario (ISP)
 */
export class IInventoryRepository {
  constructor() {
    if (new.target === IInventoryRepository) {
      throw new TypeError('IInventoryRepository es un contrato abstracto.');
    }
  }

  async getAllItems() {
    throw new Error('Método getAllItems() debe ser implementado.');
  }
}

/**
 * Contrato segregado para el puerto de Notificaciones (ISP)
 */
export class INotificacionPort {
  constructor() {
    if (new.target === INotificacionPort) {
      throw new TypeError('INotificacionPort es un contrato abstracto.');
    }
  }

  async crearNotificacionPlatilloListo(_platoNombre, _mesaNumero, _meseroId) {
    throw new Error('Método crearNotificacionPlatilloListo() debe ser implementado.');
  }

  notifyLowStock(_lowStockItems) {
    throw new Error('Método notifyLowStock() debe ser implementado.');
  }
}

export default {
  IRepository,
  ISolicitudRepository,
  ICuentaRepository,
  IPlatoRepository,
  IInventoryRepository,
  INotificacionPort
};
