export class OrdenEventoController {

    constructor(procesarOrdenConfirmada) {
        this.procesarOrdenConfirmada = procesarOrdenConfirmada;
    }

    procesar = async (req, res) => {

        try {

            const resultado =
                await this.procesarOrdenConfirmada.ejecutar(req.body);

            res.status(200).json(resultado);

        } catch (error) {

            if (error.name === "StockInsuficienteError") {

                return res.status(409).json({
                    exitoso: false,
                    error: error.name,
                    mensaje: error.message,
                    ingrediente: error.ingrediente,
                    disponible: error.disponible,
                    requerido: error.requerido
                });
            }

            console.error("Error al procesar la orden:", error);

            res.status(500).json({
                exitoso: false,
                mensaje: "No fue posible actualizar el inventario."
            });
        }
    };
}