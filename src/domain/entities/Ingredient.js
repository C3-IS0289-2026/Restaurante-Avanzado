<<<<<<< HEAD
export class Ingrediente {

    constructor(id, nombre, unidadBase, costoUnitario) {

        if (!id || !nombre) {
            throw new Error("El ingrediente debe tener ID y nombre.");
        }

        const unidadesValidas = [
            "gramos",
            "mililitros",
            "unidades"
        ];

        if (!unidadesValidas.includes(unidadBase)) {
            throw new Error("La unidad base no es válida.");
        }

        if (!Number.isFinite(costoUnitario) || costoUnitario < 0) {
            throw new Error("El costo unitario no es válido.");
        }

        this.id = id;
        this.nombre = nombre;
        this.unidadBase = unidadBase;
        this.costoUnitario = costoUnitario;

    }

}

=======
import { Entity } from './Entity.js';
import { ValidationError } from '../exceptions/DomainErrors.js';

export const UNIDADES_MEDIDA = Object.freeze({
  GRAMOS: 'gr',
  KILOGRAMOS: 'kg',
  MILILITROS: 'ml',
  LITROS: 'lt',
  UNIDAD: 'unidad'
});

/**
 * Entidad de Dominio: Ingredient (Ingrediente / Insumo base)
 */
export class Ingredient extends Entity {
  /**
   * @param {Object} params
   * @param {number|string} [params.id=null]
   * @param {string} params.name
   * @param {string} params.unitOfMeasure
   */
  constructor({ id = null, name, unitOfMeasure } = {}) {
    super(id);

    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new ValidationError('El nombre del ingrediente es obligatorio');
    }
    if (!unitOfMeasure || typeof unitOfMeasure !== 'string' || unitOfMeasure.trim() === '') {
      throw new ValidationError('La unidad de medida del ingrediente es obligatoria');
    }

    this._name = name.trim();
    this._unitOfMeasure = unitOfMeasure.trim(); // Ej: 'gr', 'ml', 'unidad'
  }

  get name() {
    return this._name;
  }

  set name(val) {
    if (!val || typeof val !== 'string' || val.trim() === '') {
      throw new ValidationError('El nombre del ingrediente es obligatorio');
    }
    this._name = val.trim();
  }

  get unitOfMeasure() {
    return this._unitOfMeasure;
  }

  set unitOfMeasure(val) {
    if (!val || typeof val !== 'string' || val.trim() === '') {
      throw new ValidationError('La unidad de medida del ingrediente es obligatoria');
    }
    this._unitOfMeasure = val.trim();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      unitOfMeasure: this.unitOfMeasure
    };
  }
}

export default Ingredient;
>>>>>>> origin/main
