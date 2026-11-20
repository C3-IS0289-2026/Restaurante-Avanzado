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
        resultado.id,
        resultado.nombre,
        resultado.unidad_medida,
        resultado.costo_unitario
);

    }

    
    async guardar(receta) {

    const client = await conexionBD.connect();

    try {

        await client.query('BEGIN');

        for (const ingrediente of receta.ingredients) {

            await client.query(
                `INSERT INTO receta_ingrediente
                (plato_id, ingrediente_id, cantidad, unidad)
                VALUES ($1, $2, $3, $4)`,
                [
                    receta.dishId,
                    ingrediente.ingredientId,
                    ingrediente.quantity,
                    ingrediente.unit
                ]
            );

        }

        await client.query('COMMIT');

    } catch (error) {

        await client.query('ROLLBACK');
        throw error;

    } finally {

        client.release();

    }
}


    }

