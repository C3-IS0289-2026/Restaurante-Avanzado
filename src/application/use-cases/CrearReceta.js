
import Receta from '../domain/Receta.js';

export default class CrearReceta {

    constructor(recetaRepositorio) {
        this.recetaRepositorio = recetaRepositorio;
    }

    async ejecutar(datos) {

        const { platoId, ingredientes, instrucciones = '' } = datos;

        if (!platoId || !Array.isArray(ingredientes)) {
            throw new Error(
                'Debe proporcionar un platillo y una lista de ingredientes.'
            );
        }

        if (ingredientes.length === 0) {
            throw new Error(
                'La receta debe contener al menos un ingrediente.'
            );
        }

        const platoExiste =
            await this.recetaRepositorio.buscarPlato(platoId);

        if (!platoExiste) {
            throw new Error('El platillo no existe.');
        }

        const ingredientesEncontrados = await Promise.all(
            ingredientes.map(item =>
                this.recetaRepositorio.buscarIngrediente(
                    item.ingredientId ?? item.ingredienteId
                )
            )
        );

        if (ingredientesEncontrados.some(item => !item)) {
            throw new Error(
                'Uno o más ingredientes no existen en el inventario.'
            );
        }

        const receta = new Receta({
            dishId: platoId,
            instructions: instrucciones
        });

        ingredientes.forEach(item => {

            receta.addIngredient(
                item.ingredientId ?? item.ingredienteId,
                item.quantity ?? item.cantidad,
                item.unit ?? item.unidad
            );

        });

        if (!receta.isValid()) {
            throw new Error(
                'No se puede guardar una receta sin ingredientes.'
            );
        }

        await this.recetaRepositorio.guardar(receta);

        return {
            platoId: receta.dishId,
            ingredientes: receta.ingredients,
            cantidadIngredientes: receta.ingredients.length,
            mensaje: 'Receta creada correctamente.'
        };
    }
}
