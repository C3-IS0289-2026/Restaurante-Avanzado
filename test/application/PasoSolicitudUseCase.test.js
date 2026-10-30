import test from 'node:test';
import assert from 'node:assert/strict';
import { PasoSolicitudUseCase } from '../../src/application/use-cases/PasoSolicitudUseCase.js';
import { ESTADOS_SOLICITUD } from '../../src/domain/entities/Solicitud.js';

test('PasoSolicitudUseCase - Avance automático secuencial (Enviado a Cocina -> En Preparación)', async () => {
  // Mock DetalleCuentaService
  let updatedData = null;
  const mockDetalleService = {
    async getById(id) {
      return {
        id: Number(id),
        cuenta_id: 1,
        plato_id: 10,
        cantidad: 2,
        notas: null,
        estado: ESTADOS_SOLICITUD.ENVIADO_A_COCINA,
        hora_envio: new Date(),
        plato_nombre: 'Lasaña Mixta',
        plato_precio: 32000,
        mesa_numero: 'Mesa 2',
        mesero_id: 3,
        mesero_nombre: 'Carlos Mesero'
      };
    },
    async update(id, data) {
      updatedData = data;
      return { id, ...data };
    }
  };

  const mockNotifService = {
    async crearNotificacionPlatilloListo() {
      throw new Error('No debe llamarse en paso a preparación');
    }
  };

  const useCase = new PasoSolicitudUseCase({
    detalleCuentaService: mockDetalleService,
    notificacionService: mockNotifService
  });

  const result = await useCase.execute({ solicitudId: 101 });

  assert.equal(result.estadoAnterior, ESTADOS_SOLICITUD.ENVIADO_A_COCINA);
  assert.equal(result.nuevoEstado, ESTADOS_SOLICITUD.EN_PREPARACION);
  assert.equal(updatedData.estado, ESTADOS_SOLICITUD.EN_PREPARACION);
  assert.equal(result.notificacionGenerada, null);
});

test('PasoSolicitudUseCase - Avance a "Listo para Servir" dispara notificación al mesero (HU-007.1)', async () => {
  let notificacionPayload = null;

  const mockDetalleService = {
    async getById(id) {
      return {
        id: Number(id),
        cuenta_id: 1,
        plato_id: 4,
        cantidad: 1,
        notas: 'Sin sal',
        estado: ESTADOS_SOLICITUD.EN_PREPARACION,
        hora_envio: new Date(),
        plato_nombre: 'Bife de Chorizo',
        plato_precio: 45000,
        mesa_numero: 'Mesa VIP 1',
        mesero_id: 7,
        mesero_nombre: 'Maria Mesera'
      };
    },
    async update(id, data) {
      return { id, ...data };
    }
  };

  const mockNotifService = {
    async crearNotificacionPlatilloListo(plato, mesa, meseroId) {
      notificacionPayload = { plato, mesa, meseroId };
      return { id: 1, plato, mesa, meseroId, estado: 'No Leída' };
    }
  };

  const useCase = new PasoSolicitudUseCase({
    detalleCuentaService: mockDetalleService,
    notificacionService: mockNotifService
  });

  const result = await useCase.execute({ solicitudId: 202 });

  assert.equal(result.estadoAnterior, ESTADOS_SOLICITUD.EN_PREPARACION);
  assert.equal(result.nuevoEstado, ESTADOS_SOLICITUD.LISTO_PARA_SERVIR);
  assert.ok(result.notificacionGenerada);
  assert.equal(notificacionPayload.plato, 'Bife de Chorizo');
  assert.equal(notificacionPayload.mesa, 'Mesa VIP 1');
  assert.equal(notificacionPayload.meseroId, 7);
});

test('PasoSolicitudUseCase - Rechazo de transición inválida (HU-006.4)', async () => {
  const mockDetalleService = {
    async getById(id) {
      return {
        id: Number(id),
        cuenta_id: 1,
        plato_id: 4,
        cantidad: 1,
        estado: ESTADOS_SOLICITUD.LISTO_PARA_SERVIR,
        hora_envio: new Date()
      };
    },
    async update() {}
  };

  const useCase = new PasoSolicitudUseCase({
    detalleCuentaService: mockDetalleService,
    notificacionService: {}
  });

  await assert.rejects(
    async () => {
      await useCase.execute({
        solicitudId: 303,
        nuevoEstado: ESTADOS_SOLICITUD.EN_PREPARACION
      });
    },
    {
      message: /Transición de estado inválida/
    }
  );
});
