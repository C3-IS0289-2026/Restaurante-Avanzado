
import { RecetaIngrediente } from "./RecetaIngrediente.js";

export class Receta {

    constructor(platoId) {

        if (!platoId) {
            throw new Error("Debe seleccionar un platillo.");
        }

        this.platoId = platoId;
        this.ingredientes = [];

    }

    agregarIngrediente(ingrediente, cantidad, unidad) {

        const existe = this.ingredientes.some(
            item => item.ingrediente.id === ingrediente.id
        );

        if (existe) {
            throw new Error("El ingrediente ya está registrado.");
        }

        const relacion = new RecetaIngrediente(
            ingrediente,
            cantidad,
            unidad
        );

        this.ingredientes.push(relacion);

    }

    calcularCostoTotal() {

        return this.ingredientes.reduce(
            (total, item) => total + item.calcularCosto(),
            0
        );

    }

}
