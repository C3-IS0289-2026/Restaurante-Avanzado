import test from 'node:test';
import assert from 'node:assert/strict';
import { Plato, CATEGORIAS_PLATO } from '../../src/domain/entities/Plato.js';
import { ValidationError } from '../../src/domain/exceptions/DomainErrors.js';

const datosValidos = {
  nombre: '  Bandeja Paisa  ',
  precio: '35000.456',
  descripcion: '  Plato típico  ',
  categoria: CATEGORIAS_PLATO.PLATOS_FUERTES
};

test('Entidad Plato - Creación válida normaliza nombre, precio y descripción', () => {
  const plato = new Plato(datosValidos);

  assert.equal(plato.id, null);
  assert.equal(plato.nombre, 'Bandeja Paisa');
  assert.equal(plato.precio, 35000.46);
  assert.equal(plato.descripcion, 'Plato típico');
  assert.equal(plato.categoria, 'Platos Fuertes');
  assert.equal(plato.activo, true);
});

test('Entidad Plato - Descripción vacía se guarda como null', () => {
  assert.equal(new Plato({ ...datosValidos, descripcion: '   ' }).descripcion, null);
  assert.equal(new Plato({ ...datosValidos, descripcion: undefined }).descripcion, null);
});

test('Entidad Plato - Rechaza nombre inválido', () => {
  assert.throws(() => new Plato({ ...datosValidos, nombre: '' }), ValidationError);
  assert.throws(() => new Plato({ ...datosValidos, nombre: '   ' }), ValidationError);
  assert.throws(() => new Plato({ ...datosValidos, nombre: 123 }), ValidationError);
  assert.throws(() => new Plato({ ...datosValidos, nombre: 'a'.repeat(101) }), {
    message: /no puede superar 100/
  });
});

test('Entidad Plato - Rechaza precio inválido', () => {
  assert.throws(() => new Plato({ ...datosValidos, precio: '' }), ValidationError);
  assert.throws(() => new Plato({ ...datosValidos, precio: null }), ValidationError);
  assert.throws(() => new Plato({ ...datosValidos, precio: -1 }), ValidationError);
  assert.throws(() => new Plato({ ...datosValidos, precio: 'abc' }), ValidationError);
  assert.throws(() => new Plato({ ...datosValidos, precio: Infinity }), ValidationError);
  assert.throws(() => new Plato({ ...datosValidos, precio: 100000000 }), ValidationError);
});

test('Entidad Plato - Rechaza categoría fuera del catálogo', () => {
  assert.throws(() => new Plato({ ...datosValidos, categoria: 'Parrilla' }), {
    message: /Categoría inválida: Parrilla/
  });
});

test('Entidad Plato - toPersistence no incluye id y respeta activo', () => {
  const datos = new Plato({ ...datosValidos, activo: false }).toPersistence();

  assert.deepEqual(Object.keys(datos), ['nombre', 'precio', 'descripcion', 'categoria', 'activo']);
  assert.equal(datos.activo, false);
});