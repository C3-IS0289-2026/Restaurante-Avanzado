-- Enums
CREATE TYPE estado_mesa AS ENUM ('Libre', 'Ocupada', 'Reservada');
CREATE TYPE rol_usuario AS ENUM ('Mesero', 'Cocinero', 'Cajero', 'Administrador');
CREATE TYPE categoria_platillo AS ENUM ('Entradas', 'Platos Fuertes', 'Bebidas', 'Postres', 'Otros');
CREATE TYPE estado_comanda AS ENUM ('Abierta', 'Pagada', 'Cerrada');
CREATE TYPE estado_detalle_comanda AS ENUM ('Enviado a Cocina', 'En Preparación', 'Listo para Servir', 'Entregado', 'Cancelado');
CREATE TYPE metodo_pago AS ENUM ('Efectivo', 'Tarjeta', 'Otro');
CREATE TYPE tipo_movimiento AS ENUM ('Ingreso', 'Deducción por Venta', 'Merma/Ajuste');
CREATE TYPE tipo_notificacion AS ENUM ('Platillo Listo', 'Alerta Stock Mínimo');
CREATE TYPE estado_notificacion AS ENUM ('No Leída', 'Leída', 'Entregada');

-- Tables
CREATE TABLE mesa (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50) NOT NULL UNIQUE,
    capacidad INT NOT NULL,
    estado estado_mesa NOT NULL DEFAULT 'Libre'
);

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    rol rol_usuario NOT NULL,
    credenciales_email VARCHAR(100) UNIQUE NOT NULL,
    credenciales_password VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE platillo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    categoria categoria_platillo NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE ingrediente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    unidad_medida VARCHAR(50) NOT NULL,
    stock_actual DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    punto_reorden DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE receta_ingrediente (
    id SERIAL PRIMARY KEY,
    platillo_id INT NOT NULL REFERENCES platillo(id) ON DELETE CASCADE,
    ingrediente_id INT NOT NULL REFERENCES ingrediente(id) ON DELETE CASCADE,
    cantidad_requerida DECIMAL(10, 2) NOT NULL
);

CREATE TABLE comanda (
    id SERIAL PRIMARY KEY,
    mesa_id INT NOT NULL REFERENCES mesa(id) ON DELETE RESTRICT,
    mesero_id INT REFERENCES usuario(id) ON DELETE SET NULL,
    numero_comensales INT NOT NULL,
    estado estado_comanda NOT NULL DEFAULT 'Abierta',
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    impuestos DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    fecha_apertura TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP
);

CREATE TABLE detalle_comanda (
    id SERIAL PRIMARY KEY,
    comanda_id INT NOT NULL REFERENCES comanda(id) ON DELETE CASCADE,
    platillo_id INT NOT NULL REFERENCES platillo(id) ON DELETE RESTRICT,
    cantidad INT NOT NULL,
    notas TEXT,
    estado estado_detalle_comanda NOT NULL DEFAULT 'Enviado a Cocina',
    hora_envio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pago (
    id SERIAL PRIMARY KEY,
    comanda_id INT NOT NULL REFERENCES comanda(id) ON DELETE RESTRICT,
    metodo_pago metodo_pago NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimiento_inventario (
    id SERIAL PRIMARY KEY,
    ingrediente_id INT NOT NULL REFERENCES ingrediente(id) ON DELETE CASCADE,
    tipo_movimiento tipo_movimiento NOT NULL,
    cantidad DECIMAL(10, 2) NOT NULL,
    comanda_id INT REFERENCES comanda(id) ON DELETE SET NULL,
    fecha_movimiento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notificacion (
    id SERIAL PRIMARY KEY,
    tipo tipo_notificacion NOT NULL,
    mensaje TEXT NOT NULL,
    estado estado_notificacion NOT NULL DEFAULT 'No Leída',
    usuario_destino_id INT REFERENCES usuario(id) ON DELETE CASCADE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
