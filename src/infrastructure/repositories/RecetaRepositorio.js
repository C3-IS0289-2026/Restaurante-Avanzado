import { Ingrediente } from "../domain/Ingrediente.js";

export class RecetaRepositorio {

    async buscarPlato(id) {

        const consulta = `
            SELECT id
            FROM plato
            WHERE id = $1
        `;

        const resultado = await conexionBD.query(consulta, [id]);

        return resultado.rows.length > 0;

    }

    async buscarIngrediente(id) {

        const consulta = `
            SELECT id, nombre, unidad_medida, costo_unitario
            FROM ingrediente
            WHERE id = $1
        `;

        const resultado = await conexionBD.query(consulta, [id]);

        if (resultado.rows.length === 0) {
            return null;
        }

        const dato = resultado.rows[0];

        return new Ingrediente(
            dato.id,
            dato.nombre,
            dato.unidad_medida,
            Number(dato.costo_unitario)
        );

    }

    async guardar(receta) {

        const conexion = await conexionBD.connect();

        try {

            await conexion.query("BEGIN");

            for (const item of receta.ingredientes) {

                const consulta = `
                    INSERT INTO receta_ingrediente
                    (plato_id, ingrediente_id, cantidad, unidad)
                    VALUES ($1, $2, $3, $4)
                `;

                await conexion.query(consulta, [
                    receta.platoId,
                    item.ingrediente.id,
                    item.cantidad,
                    item.unidad
                ]);

            }

            await conexion.query("COMMIT");

        } catch (error) {

            await conexion.query("ROLLBACK");

            throw error;

        } finally {

            conexion.release();

        }

    }

}