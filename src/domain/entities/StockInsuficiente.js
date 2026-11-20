export class StockInsuficiente extends Error {

    constructor(ingrediente, disponible, requerido) {

        super(
            `Stock insuficiente de ${ingrediente}. ` +
            `Disponible: ${disponible}, requerido: ${requerido}`
        );

        this.name = "StockInsuficienteError";
        this.ingrediente = ingrediente;
        this.disponible = disponible;
        this.requerido = requerido;
    }
}