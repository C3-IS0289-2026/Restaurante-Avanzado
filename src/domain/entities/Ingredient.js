export class Ingrediente {

    constructor(id, nombre, unidadBase, costoUnitario) {

        if (!id || !nombre) {
            throw new Error("El ingrediente debe tener ID y nombre.");
        }

        const unidadesValidas = [
            "gramos",
            "mililitros",
            "unidades"
        ];

        if (!unidadesValidas.includes(unidadBase)) {
            throw new Error("La unidad base no es válida.");
        }

        if (!Number.isFinite(costoUnitario) || costoUnitario < 0) {
            throw new Error("El costo unitario no es válido.");
        }

        this.id = id;
        this.nombre = nombre;
        this.unidadBase = unidadBase;
        this.costoUnitario = costoUnitario;

    }

}

