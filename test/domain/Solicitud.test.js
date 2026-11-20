import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Solicitud,
  ESTADOS_SOLICITUD,
  TRANSICIONES_PERMITIDAS,
  SECUENCIA_PASO
} from '../../src/domain/entities/Solicitud.js';

test('Entidad Solicitud - Creación válida con valores por defecto', () => {
  const solicitud = new Solicitud({
    cuenta_id: 1,
    plato_id: 10,
    cantidad: 2,
    notas: 'Sin cebolla',
    plato_nombre: 'Hamburguesa Artesanal',
    plato_precio: 25000,
    mesa_numero: 'Mesa 4'
  });

  assert.equal(solicitud.cuenta_id, 1);
  assert.equal(solicitud.plato_id, 10);
  assert.equal(solicitud.cantidad, 2);
  assert.equal(solicitud.estado, ESTADOS_SOLICITUD.ENVIADO_A_COCINA);
  assert.equal(solicitud.notas, 'Sin cebolla');
  assert.equal(solicitud.plato_nombre, 'Hamburguesa Artesanal');
  assert.equal(solicitud.puedeAvanzar(), true);
});

test('Entidad Solicitud - Validación de campos obligatorios', () => {
  assert.throws(() => new Solicitud({ plato_id: 1, cantidad: 1 }), {
    message: /cuenta_id es obligatorio/
  });

  assert.throws(() => new Solicitud({ cuenta_id: 1, cantidad: 1 }), {
    message: /plato_id es obligatorio/
  });

  assert.throws(() => new Solicitud({ cuenta_id: 1, plato_id: 1, cantidad: 0 }), {
    message: /cantidad debe ser un número entero mayor a 0/
  });

  assert.throws(() => new Solicitud({ cuenta_id: 1, plato_id: 1, cantidad: 1, estado: 'Inventado' }), {
    message: /Estado inicial inválido/
  });
});

test('Entidad Solicitud - Paso secuencial completo: Enviado -> En Preparación -> Listo -> Entregado', () => {
  const solicitud = new Solicitud({
    cuenta_id: 1,
    plato_id: 5,
    cantidad: 1
  });

  assert.equal(solicitud.estado, ESTADOS_SOLICITUD.ENVIADO_A_COCINA);

  // Paso 1: A preparación
  const s1 = solicitud.avanzar();
  assert.equal(s1, ESTADOS_SOLICITUD.EN_PREPARACION);
  assert.equal(solicitud.estado, ESTADOS_SOLICITUD.EN_PREPARACION);

  // Paso 2: A listo para servir
  const s2 = solicitud.avanzar();
  assert.equal(s2, ESTADOS_SOLICITUD.LISTO_PARA_SERVIR);
  assert.equal(solicitud.estado, ESTADOS_SOLICITUD.LISTO_PARA_SERVIR);

  // Paso 3: A entregado
  const s3 = solicitud.avanzar();
  assert.equal(s3, ESTADOS_SOLICITUD.ENTREGADO);
  assert.equal(solicitud.estado, ESTADOS_SOLICITUD.ENTREGADO);

  // Ya no puede avanzar
  assert.equal(solicitud.puedeAvanzar(), false);
  assert.throws(() => solicitud.avanzar(), {
    message: /no puede avanzar más/
  });
});

test('Entidad Solicitud - Bloqueo de transiciones inválidas (HU-006.4)', () => {
  const solicitud = new Solicitud({
    cuenta_id: 1,
    plato_id: 5,
    cantidad: 1,
    estado: ESTADOS_SOLICITUD.LISTO_PARA_SERVIR
  });

  // Intentar retroceder a En Preparación debe ser rechazado
  assert.throws(
    () => solicitud.cambiarEstado(ESTADOS_SOLICITUD.EN_PREPARACION),
    {
      message: /Transición de estado inválida: No se puede cambiar de "Listo para Servir" a "En Preparación"/
    }
  );

  // Intentar saltar directamente desde Enviado a Cocina a Entregado
  const nuevaSol = new Solicitud({
    cuenta_id: 1,
    plato_id: 2,
    cantidad: 1
  });

  assert.throws(
    () => nuevaSol.cambiarEstado(ESTADOS_SOLICITUD.ENTREGADO),
    {
      message: /Transición de estado inválida: No se puede cambiar de "Enviado a Cocina" a "Entregado"/
    }
  );
});

test('Entidad Solicitud - Cancelación con motivo', () => {
  const solicitud = new Solicitud({
    cuenta_id: 1,
    plato_id: 3,
    cantidad: 1,
    notas: 'Poco picante'
  });

  solicitud.cancelar('Cliente se retiró');
  assert.equal(solicitud.estado, ESTADOS_SOLICITUD.CANCELADO);
  assert.match(solicitud.notas, /Cliente se retiró/);
  assert.equal(solicitud.puedeAvanzar(), false);
});

test('Entidad Solicitud - Cálculo de tiempo de espera y alerta de demora', () => {
  const hace20Minutos = new Date(Date.now() - 20 * 60 * 1000);
  const solicitudDemorada = new Solicitud({
    cuenta_id: 1,
    plato_id: 3,
    cantidad: 1,
    hora_envio: hace20Minutos
  });

  assert.ok(solicitudDemorada.calcularTiempoEsperaMinutos() >= 20);
  assert.equal(solicitudDemorada.esDemorado(15), true);

  const reciente = new Solicitud({
    cuenta_id: 1,
    plato_id: 3,
    cantidad: 1,
    hora_envio: new Date()
  });
  assert.equal(reciente.esDemorado(15), false);
});
