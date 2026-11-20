
import { Receta } from "../domain/Receta.js";

export class CrearReceta {

    constructor(recetaRepositorio) {

        this.recetaRepositorio = recetaRepositorio;

    }

    async ejecutar(datos) {

        const { platoId, ingredientes } = datos;

        if (!platoId || !Array.isArray(ingredientes) ||
            ingredientes.length === 0) {

            throw new Error("Debe seleccionar un platillo y agregar ingredientes.");

        }


        const platoExiste = await this.recetaRepositorio.buscarPlato(platoId);

        if (!platoExiste) {
            throw new Error("El platillo seleccionado no existe.");
        }


        const ingredientesEncontrados = await Promise.all(
            ingredientes.map(async item => {

                const ingrediente =
                    await this.recetaRepositorio.buscarIngrediente(
                        item.ingredienteId
                    );

                if (!ingrediente) {
                    throw new Error(
                        `El ingrediente ${item.ingredienteId} no existe.`
                    );
                }

                return {
                    ingrediente,
                    cantidad: item.cantidad,
                    unidad: item.unidad
                };

            })
        );


        const receta = new Receta(platoId);

        for (const item of ingredientesEncontrados) {

            receta.agregarIngrediente(
                item.ingrediente,
                item.cantidad,
                item.unidad
            );

        }


        await this.recetaRepositorio.guardar(receta);

        return {
            platoId: receta.platoId,
            cantidadIngredientes: receta.ingredientes.length,
            costoTotal: receta.calcularCostoTotal(),
            mensaje: "Receta registrada correctamente."
        };

    }

}
