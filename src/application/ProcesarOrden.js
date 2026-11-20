export class ProcesarOrdenConfirmada {

    constructor(inventarioRepositorio) {
        this.inventarioRepositorio = inventarioRepositorio;
    }

    async ejecutar(datosEvento) {

        const { tipo, ordenId, eventoId } = datosEvento;

        if (tipo !== "ORDER_CONFIRMED") {
            throw new Error("La notificación recibido no es válido.");
        }

        if (!ordenId || !eventoId) {
            throw new Error("Faltan datos para procesar la orden.");
        }

        const resultado =
            await this.inventarioRepositorio.descontarIngredientes(
                ordenId,
                eventoId
            );

        return {
            exitoso: true,
            ordenId: ordenId,
            ingredientesDescontados: resultado.totalIngredientes,
            mensaje: "Inventario actualizado correctamente."
        };
    }
}