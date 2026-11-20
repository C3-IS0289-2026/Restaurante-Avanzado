
import { UnidadMedida } from "./UnidadMedida.js";

export class RecetaIngrediente {

    constructor(ingrediente, cantidad, unidad) {

        if (!ingrediente) {
            throw new Error("El ingrediente no existe.");
        }

        const cantidadConvertida = UnidadMedida.convertir(
            cantidad,
            unidad
        );

        if (cantidadConvertida.unidadBase !== ingrediente.unidadBase) {
            throw new Error("La unidad no corresponde al ingrediente.");
        }

        this.ingrediente = ingrediente;
        this.cantidad = cantidadConvertida.cantidadBase;
        this.unidad = cantidadConvertida.unidadBase;

    }

    calcularCosto() {

        const costo = this.cantidad * this.ingrediente.costoUnitario;

        return Math.round((costo + Number.EPSILON) * 100) / 100;

    }

}
