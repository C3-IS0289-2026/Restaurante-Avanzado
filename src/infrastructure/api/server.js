import http from 'node:http';
import { URL } from 'node:url';
import dotenv from 'dotenv';
import { handleSolicitudesRoutes } from './routes/solicitudesRoutes.js';
import { DomainError } from '../../domain/exceptions/DomainErrors.js';
import { defaultContainer } from '../container.js';

dotenv.config();

const DEFAULT_PORT = process.env.API_PORT || process.env.PORT || 3001;

/**
 * Agrega cabeceras CORS estándar a la respuesta
 * @param {http.ServerResponse} res
 */
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

/**
 * Extrae y parsea el cuerpo de una petición JSON
 * @param {http.IncomingMessage} req
 * @returns {Promise<Object|null>}
 */
async function parseJsonBody(req) {
  const method = req.method.toUpperCase();
  if (!['POST', 'PUT', 'PATCH'].includes(method)) {
    return null;
  }

  return new Promise((resolve, reject) => {
    let rawData = '';
    req.on('data', chunk => {
      rawData += chunk;
      if (rawData.length > 1e6) { // Protección de tamaño (1MB)
        req.destroy();
        reject(new Error('Payload Too Large'));
      }
    });

    req.on('end', () => {
      if (!rawData.trim()) {
        return resolve(null);
      }
      try {
        const parsed = JSON.parse(rawData);
        resolve(parsed);
      } catch (err) {
        reject(new Error(`JSON malformado en el cuerpo de la petición: ${err.message}`));
      }
    });

    req.on('error', err => reject(err));
  });
}

/**
 * Crea e inicializa la instancia del servidor HTTP
 * @param {Object} [options={}]
 * @param {Object} [options.container=defaultContainer] - Contenedor DI inyectable para pruebas
 * @returns {http.Server}
 */
export function createServer({ container = defaultContainer } = {}) {
  const server = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    // Manejo de preflight CORS (OPTIONS)
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const path = parsedUrl.pathname;
      const method = req.method.toUpperCase();
      const query = Object.fromEntries(parsedUrl.searchParams.entries());

      // Health Check
      if (path === '/health' || path === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'ok',
          service: 'Restaurante-Avanzado Backend API',
          module: 'Paso de Solicitudes y KDS',
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // Parsear Body
      const body = await parseJsonBody(req);

      // Despachar a rutas de solicitudes
      const handled = await handleSolicitudesRoutes(
        req,
        res,
        {
          path,
          method,
          query,
          params: {},
          body
        },
        container
      );

      if (!handled && !res.writableEnded) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: `Ruta no encontrada: ${method} ${path}`
        }));
      }
    } catch (error) {
      // Polimorfismo de excepciones (SOLID OCP): las subclases de DomainError definen su propio httpStatus y code
      const isDomainError = error instanceof DomainError;
      if (!isDomainError) {
        console.error('Error interno del servidor:', error);
      }

      if (!res.writableEnded) {
        const statusCode = isDomainError
          ? error.httpStatus
          : error.message?.includes('JSON malformado')
            ? 400
            : 500;

        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          code: isDomainError ? error.code : 'INTERNAL_ERROR',
          error: error.message || 'Error interno del servidor'
        }));
      }
    }
  });

  return server;
}

// Iniciar servidor si se ejecuta directamente
const isMainModule = process.argv[1] && process.argv[1].endsWith('server.js');
if (isMainModule) {
  const server = createServer();
  server.listen(DEFAULT_PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Backend API - Módulo Paso de Solicitudes & KDS`);
    console.log(`📡 Escuchando en: http://localhost:${DEFAULT_PORT}`);
    console.log(`📋 Health check:   http://localhost:${DEFAULT_PORT}/api/health`);
    console.log(`📋 KDS Tablero:    http://localhost:${DEFAULT_PORT}/api/solicitudes/kds?agrupado=true`);
    console.log(`=======================================================`);
  });
}

export default createServer;
