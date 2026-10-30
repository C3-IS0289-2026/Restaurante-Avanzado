/**
 * Cliente HTTP del KDS (HU-005 / HU-006)
 * Se encarga SOLO de hablar con el backend, así las vistas no usan fetch directamente.
 */
const API_URL = 'http://localhost:3001/api/solicitudes';

export class KdsApiClient {
  constructor(baseUrl = API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Trae las comandas activas separadas por columna (recibidos, preparacion, listos).
   * Usa GET /api/solicitudes/kds?agrupado=true
   */
  async obtenerTablero() {
    const respuesta = await fetch(`${this.baseUrl}/kds?agrupado=true`);
    return this._leerRespuesta(respuesta);
  }

  /**
   * Pasa una comanda a su siguiente estado (Recibido -> En Preparación -> Listo).
   * Usa PATCH /api/solicitudes/:id/avanzar
   */
  async avanzarComanda(id) {
    const respuesta = await fetch(`${this.baseUrl}/${id}/avanzar`, { method: 'PATCH' });
    return this._leerRespuesta(respuesta);
  }

  /**
   * Convierte la respuesta en JSON y lanza un error con el mensaje del backend si algo falla.
   * @private
   */
  async _leerRespuesta(respuesta) {
    const json = await respuesta.json();
    if (!respuesta.ok || json.success === false) {
      throw new Error(json.error || 'No se pudo comunicar con el servidor');
    }
    return json.data;
  }
}

export default KdsApiClient;
