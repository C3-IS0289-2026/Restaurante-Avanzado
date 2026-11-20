import { conexionBD } from "./ConexionA.js";
import { StockInsuficienteError } from "../domain/StockInsuficienteError.js";

export class InventarioRepositorio {

    async descontarIngredientes(ordenId, eventoId) {

        const cliente = await conexionA.connect();

        try {

            await cliente.query("BEGIN");


            const orden = await cliente.query(
                `SELECT id, estado
                 FROM ordenes
                 WHERE id = $1
                 FOR UPDATE`,
                [ordenId]
            );

            if (orden.rows.length === 0) {
                throw new Error("La orden no existe.");
            }

            if (orden.rows[0].estado !== "CONFIRMED") {
                throw new Error("La orden no está confirmada.");
            }


            const eventoExistente = await cliente.query(
                `SELECT evento_id
                 FROM processed_events
                 WHERE evento_id = $1`,
                [eventoId]
            );

            if (eventoExistente.rows.length > 0) {
                await cliente.query("ROLLBACK");

                return {
                    totalIngredientes: 0,
                    duplicado: true
                };
            }


            const consultaIngredientes = await cliente.query(
                `SELECT
                    i.id AS ingrediente_id,
                    i.nombre,
                    i.stock_actual,
                    i.unidad_base,
                    SUM(ri.cantidad * do.cantidad) AS cantidad_requerida

                 FROM detalle_orden do

                 INNER JOIN receta_ingrediente ri
                    ON ri.plato_id = do.plato_id

                 INNER JOIN ingrediente i
                    ON i.id = ri.ingrediente_id

                 WHERE do.orden_id = $1

                 GROUP BY
                    i.id,
                    i.nombre,
                    i.stock_actual,
                    i.unidad_base

                 ORDER BY i.id`,
                [ordenId]
            );

            const ingredientes = consultaIngredientes.rows;

            if (ingredientes.length === 0) {
                throw new Error(
                    "La orden no tiene ingredientes asociados a sus recetas."
                );
            }


            const idsIngredientes = ingredientes.map(
                ingrediente => ingrediente.ingrediente_id
            );

            const inventarioBloqueado = await cliente.query(
                `SELECT id, stock_actual
                 FROM ingrediente
                 WHERE id = ANY($1::int[])
                 ORDER BY id
                 FOR UPDATE`,
                [idsIngredientes]
            );

            const stockPorId = new Map(
                inventarioBloqueado.rows.map(ingrediente => [
                    ingrediente.id,
                    Number(ingrediente.stock_actual)
                ])
            );


            for (const ingrediente of ingredientes) {

                const disponible = stockPorId.get(
                    ingrediente.ingrediente_id
                );

                const requerido = Number(
                    ingrediente.cantidad_requerida
                );

                if (disponible < requerido) {

                    throw new StockInsuficienteError(
                        ingrediente.nombre,
                        disponible,
                        requerido
                    );
                }
            }


            for (const ingrediente of ingredientes) {

                const requerido = Number(
                    ingrediente.cantidad_requerida
                );

                await cliente.query(
                    `UPDATE ingrediente
                     SET stock_actual = stock_actual - $1
                     WHERE id = $2`,
                    [requerido, ingrediente.ingrediente_id]
                );

                await cliente.query(
                    `INSERT INTO inventory_movements
                    (
                        ingrediente_id,
                        orden_id,
                        tipo,
                        cantidad,
                        fecha
                    )
                    VALUES ($1, $2, $3, $4, NOW())`,
                    [
                        ingrediente.ingrediente_id,
                        ordenId,
                        "CONSUMO",
                        requerido
                    ]
                );
            }


            await cliente.query(
                `INSERT INTO processed_events (evento_id, orden_id)
                 VALUES ($1, $2)`,
                [eventoId, ordenId]
            );

            await cliente.query("COMMIT");

            return {
                totalIngredientes: ingredientes.length,
                duplicado: false
            };

        } catch (error) {


            await cliente.query("ROLLBACK");

            throw error;

        } finally {

            cliente.release();
        }
    }
}