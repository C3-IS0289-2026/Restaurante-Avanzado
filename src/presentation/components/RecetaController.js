export default class RecetaController {

    constructor(crearReceta) {
        this.crearReceta = crearReceta;
    }

    crear = async (req, res) => {

        try {

            const resultado =
                await this.crearReceta.ejecutar(req.body);

            res.status(201).json({
                mensaje: "Receta creada correctamente.",
                ...resultado
            });

        } catch (error) {

            console.error(error);

            res.status(400).json({
                mensaje: error.message
            });
        }
    };
}