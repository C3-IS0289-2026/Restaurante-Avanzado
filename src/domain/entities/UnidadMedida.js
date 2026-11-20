
const unidades = {
    gramos: {
        unidadBase: "gramos",
        factor: 1
    },
    kilogramos: {
        unidadBase: "gramos",
        factor: 1000
    },
    mililitros: {
        unidadBase: "mililitros",
        factor: 1
    },
    litros: {
        unidadBase: "mililitros",
        factor: 1000
    },
    unidades: {
        unidadBase: "unidades",
        factor: 1
    }
};

export class UnidadMedida {

    static convertir(cantidad, unidad) {

        if (!Number.isFinite(cantidad) || cantidad <= 0) {
            throw new Error("La cantidad debe ser mayor a cero.");
        }

        const conversion = unidades[unidad];

        if (!conversion) {
            throw new Error("Unidad de medida no permitida.");
        }

        return {
            cantidadBase: cantidad * conversion.factor,
            unidadBase: conversion.unidadBase
        };

    }

}
