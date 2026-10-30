/**
 * Entidad de Dominio: Cuenta (Lenguaje Ubicuo: cuenta)
 * Representa el registro financiero y operativo del servicio abierto para una mesa.
 * Reemplaza el término ambiguo "comanda" para la cabecera de facturación y consumo de mesa.
 */

import { Entity } from './Entity.js';
import { ValidationError } from '../exceptions/DomainErrors.js';
import { EstadoCuenta, ESTADOS_CUENTA } from '../value-objects/EstadoCuenta.js';
import { Cantidad } from '../value-objects/Cantidad.js';
import { Money } from '../value-objects/Money.js';

export { ESTADOS_CUENTA };

export class Cuenta extends Entity {
  /**
   * @param {Object} params
   * @param {number} [params.id=null]
   * @param {number} params.mesa_id
   * @param {number} [params.mesero_id=null]
   * @param {number} params.numero_comensales
   * @param {string|EstadoCuenta} [params.estado='Abierta']
   * @param {number} [params.subtotal=0]
   * @param {number} [params.impuestos=0]
   * @param {number} [params.total=0]
   * @param {Date|string} [params.fecha_apertura=new Date()]
   * @param {Date|string} [params.fecha_cierre=null]
   */
  constructor({
    id = null,
    mesa_id,
    mesero_id = null,
    numero_comensales,
    estado = ESTADOS_CUENTA.ABIERTA,
    subtotal = 0,
    impuestos = 0,
    total = 0,
    fecha_apertura = new Date(),
    fecha_cierre = null
  }) {
    super(id);

    if (!mesa_id) {
      throw new ValidationError('mesa_id es obligatorio para crear una Cuenta');
    }

    this._comensalesVO = new Cantidad(numero_comensales, {
      allowZero: false,
      onlyInteger: true,
      fieldName: 'numero_comensales'
    });
    this._estadoVO = new EstadoCuenta(estado);
    this._subtotalVO = new Money(Number(subtotal) || 0);
    this._impuestosVO = new Money(Number(impuestos) || 0);
    this._totalVO = new Money(Number(total) || 0);

    this.mesa_id = Number(mesa_id);
    this.mesero_id = mesero_id ? Number(mesero_id) : null;
    this.fecha_apertura =
      fecha_apertura instanceof Date ? fecha_apertura : new Date(fecha_apertura);
    this.fecha_cierre = fecha_cierre
      ? fecha_cierre instanceof Date
        ? fecha_cierre
        : new Date(fecha_cierre)
      : null;
  }

  get numero_comensales() {
    return this._comensalesVO.value;
  }

  get estado() {
    return this._estadoVO.value;
  }

  set estado(nuevoEstado) {
    this._estadoVO = new EstadoCuenta(nuevoEstado);
  }

  get subtotal() {
    return this._subtotalVO.amount;
  }

  get impuestos() {
    return this._impuestosVO.amount;
  }

  get total() {
    return this._totalVO.amount;
  }

  /**
   * Marca la cuenta como Pagada
   */
  marcarPagada() {
    this._estadoVO = this._estadoVO.transicionarA(ESTADOS_CUENTA.PAGADA);
    return this.estado;
  }

  /**
   * Cierra formalmente la cuenta registrando fecha_cierre
   * @param {Date} [fechaCierre=new Date()]
   */
  cerrar(fechaCierre = new Date()) {
    this._estadoVO = this._estadoVO.transicionarA(ESTADOS_CUENTA.CERRADA);
    this.fecha_cierre = fechaCierre instanceof Date ? fechaCierre : new Date(fechaCierre);
    return this.estado;
  }

  toJSON() {
    return {
      id: this.id,
      mesa_id: this.mesa_id,
      mesero_id: this.mesero_id,
      numero_comensales: this.numero_comensales,
      estado: this.estado,
      subtotal: this.subtotal,
      impuestos: this.impuestos,
      total: this.total,
      fecha_apertura: this.fecha_apertura.toISOString(),
      fecha_cierre: this.fecha_cierre ? this.fecha_cierre.toISOString() : null
    };
  }
}

export default Cuenta;
