import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'restaurante-avanzado',
  user: 'postgres',
  password: '123456789'
});

// Mensaje de conexión exitosa
pool.on('connect', () => {
  console.log('Base de datos conectada exitosamente');
});

// Manejo de errores
pool.on('error', (err) => {
  console.error('Error inesperado en el cliente inactivo', err);
  process.exit(-1);
});

export default pool;
