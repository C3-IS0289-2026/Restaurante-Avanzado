--
-- PostgreSQL database dump
--

\restrict VRVXxq9tsSyVv7ErNX3ZLLk4Fn7gqMsY3OWzbxHL0d5Sceu6kVPuSsYEM0zcg3j

-- Dumped from database version 17.11 (Debian 17.11-0+deb13u1)
-- Dumped by pg_dump version 17.11 (Debian 17.11-0+deb13u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: categoria_plato; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.categoria_plato AS ENUM (
    'Entradas',
    'Platos Fuertes',
    'Bebidas',
    'Postres',
    'Otros'
);


ALTER TYPE public.categoria_plato OWNER TO postgres;

--
-- Name: estado_cuenta; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_cuenta AS ENUM (
    'Abierta',
    'Pagada',
    'Cerrada'
);


ALTER TYPE public.estado_cuenta OWNER TO postgres;

--
-- Name: estado_detalle_cuenta; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_detalle_cuenta AS ENUM (
    'Enviado a Cocina',
    'En Preparación',
    'Listo para Servir',
    'Entregado',
    'Cancelado'
);


ALTER TYPE public.estado_detalle_cuenta OWNER TO postgres;

--
-- Name: estado_mesa; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_mesa AS ENUM (
    'Libre',
    'Ocupada',
    'Reservada'
);


ALTER TYPE public.estado_mesa OWNER TO postgres;

--
-- Name: estado_notificacion; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_notificacion AS ENUM (
    'No Leída',
    'Leída',
    'Entregada'
);


ALTER TYPE public.estado_notificacion OWNER TO postgres;

--
-- Name: metodo_pago; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.metodo_pago AS ENUM (
    'Efectivo',
    'Tarjeta',
    'Otro'
);


ALTER TYPE public.metodo_pago OWNER TO postgres;

--
-- Name: rol_usuario; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rol_usuario AS ENUM (
    'Mesero',
    'Cocinero',
    'Cajero',
    'Administrador'
);


ALTER TYPE public.rol_usuario OWNER TO postgres;

--
-- Name: tipo_movimiento; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_movimiento AS ENUM (
    'Ingreso',
    'Deducción por Venta',
    'Merma/Ajuste'
);


ALTER TYPE public.tipo_movimiento OWNER TO postgres;

--
-- Name: tipo_notificacion; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_notificacion AS ENUM (
    'Platillo Listo',
    'Alerta Stock Mínimo'
);


ALTER TYPE public.tipo_notificacion OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cuenta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuenta (
    id integer NOT NULL,
    mesa_id integer NOT NULL,
    mesero_id integer,
    numero_comensales integer NOT NULL,
    estado public.estado_cuenta DEFAULT 'Abierta'::public.estado_cuenta NOT NULL,
    subtotal numeric(10,2) DEFAULT 0.00 NOT NULL,
    impuestos numeric(10,2) DEFAULT 0.00 NOT NULL,
    total numeric(10,2) DEFAULT 0.00 NOT NULL,
    fecha_apertura timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_cierre timestamp without time zone
);


ALTER TABLE public.cuenta OWNER TO postgres;

--
-- Name: cuenta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cuenta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cuenta_id_seq OWNER TO postgres;

--
-- Name: cuenta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cuenta_id_seq OWNED BY public.cuenta.id;


--
-- Name: detalle_cuenta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_cuenta (
    id integer NOT NULL,
    cuenta_id integer NOT NULL,
    plato_id integer NOT NULL,
    cantidad integer NOT NULL,
    notas text,
    estado public.estado_detalle_cuenta DEFAULT 'Enviado a Cocina'::public.estado_detalle_cuenta NOT NULL,
    hora_envio timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.detalle_cuenta OWNER TO postgres;

--
-- Name: detalle_cuenta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalle_cuenta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalle_cuenta_id_seq OWNER TO postgres;

--
-- Name: detalle_cuenta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalle_cuenta_id_seq OWNED BY public.detalle_cuenta.id;


--
-- Name: ingrediente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingrediente (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    unidad_medida character varying(50) NOT NULL,
    stock_actual numeric(10,2) DEFAULT 0.00 NOT NULL,
    punto_reorden numeric(10,2) DEFAULT 0.00 NOT NULL
);


ALTER TABLE public.ingrediente OWNER TO postgres;

--
-- Name: ingrediente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingrediente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ingrediente_id_seq OWNER TO postgres;

--
-- Name: ingrediente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingrediente_id_seq OWNED BY public.ingrediente.id;


--
-- Name: mesa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mesa (
    id integer NOT NULL,
    numero character varying(50) NOT NULL,
    capacidad integer NOT NULL,
    estado public.estado_mesa DEFAULT 'Libre'::public.estado_mesa NOT NULL
);


ALTER TABLE public.mesa OWNER TO postgres;

--
-- Name: mesa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mesa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mesa_id_seq OWNER TO postgres;

--
-- Name: mesa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mesa_id_seq OWNED BY public.mesa.id;


--
-- Name: movimiento_inventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimiento_inventario (
    id integer NOT NULL,
    ingrediente_id integer NOT NULL,
    tipo_movimiento public.tipo_movimiento NOT NULL,
    cantidad numeric(10,2) NOT NULL,
    cuenta_id integer,
    fecha_movimiento timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.movimiento_inventario OWNER TO postgres;

--
-- Name: movimiento_inventario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movimiento_inventario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movimiento_inventario_id_seq OWNER TO postgres;

--
-- Name: movimiento_inventario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movimiento_inventario_id_seq OWNED BY public.movimiento_inventario.id;


--
-- Name: notificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificacion (
    id integer NOT NULL,
    tipo public.tipo_notificacion NOT NULL,
    mensaje text NOT NULL,
    estado public.estado_notificacion DEFAULT 'No Leída'::public.estado_notificacion NOT NULL,
    usuario_destino_id integer,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notificacion OWNER TO postgres;

--
-- Name: notificacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificacion_id_seq OWNER TO postgres;

--
-- Name: notificacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificacion_id_seq OWNED BY public.notificacion.id;


--
-- Name: pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pago (
    id integer NOT NULL,
    cuenta_id integer NOT NULL,
    metodo_pago public.metodo_pago NOT NULL,
    monto numeric(10,2) NOT NULL,
    fecha_pago timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.pago OWNER TO postgres;

--
-- Name: pago_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pago_id_seq OWNER TO postgres;

--
-- Name: pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pago_id_seq OWNED BY public.pago.id;


--
-- Name: plato; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plato (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    precio numeric(10,2) NOT NULL,
    descripcion text,
    categoria public.categoria_plato NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.plato OWNER TO postgres;

--
-- Name: plato_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plato_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plato_id_seq OWNER TO postgres;

--
-- Name: plato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plato_id_seq OWNED BY public.plato.id;


--
-- Name: receta_ingrediente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receta_ingrediente (
    id integer NOT NULL,
    plato_id integer NOT NULL,
    ingrediente_id integer NOT NULL,
    cantidad_requerida numeric(10,2) NOT NULL
);


ALTER TABLE public.receta_ingrediente OWNER TO postgres;

--
-- Name: receta_ingrediente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.receta_ingrediente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.receta_ingrediente_id_seq OWNER TO postgres;

--
-- Name: receta_ingrediente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.receta_ingrediente_id_seq OWNED BY public.receta_ingrediente.id;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    rol public.rol_usuario NOT NULL,
    credenciales_email character varying(100) NOT NULL,
    credenciales_password character varying(255) NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_seq OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;


--
-- Name: cuenta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta ALTER COLUMN id SET DEFAULT nextval('public.cuenta_id_seq'::regclass);


--
-- Name: detalle_cuenta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_cuenta ALTER COLUMN id SET DEFAULT nextval('public.detalle_cuenta_id_seq'::regclass);


--
-- Name: ingrediente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingrediente ALTER COLUMN id SET DEFAULT nextval('public.ingrediente_id_seq'::regclass);


--
-- Name: mesa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa ALTER COLUMN id SET DEFAULT nextval('public.mesa_id_seq'::regclass);


--
-- Name: movimiento_inventario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario ALTER COLUMN id SET DEFAULT nextval('public.movimiento_inventario_id_seq'::regclass);


--
-- Name: notificacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion ALTER COLUMN id SET DEFAULT nextval('public.notificacion_id_seq'::regclass);


--
-- Name: pago id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago ALTER COLUMN id SET DEFAULT nextval('public.pago_id_seq'::regclass);


--
-- Name: plato id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plato ALTER COLUMN id SET DEFAULT nextval('public.plato_id_seq'::regclass);


--
-- Name: receta_ingrediente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta_ingrediente ALTER COLUMN id SET DEFAULT nextval('public.receta_ingrediente_id_seq'::regclass);


--
-- Name: usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- Data for Name: cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta (id, mesa_id, mesero_id, numero_comensales, estado, subtotal, impuestos, total, fecha_apertura, fecha_cierre) FROM stdin;
\.


--
-- Data for Name: detalle_cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalle_cuenta (id, cuenta_id, plato_id, cantidad, notas, estado, hora_envio) FROM stdin;
\.


--
-- Data for Name: ingrediente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingrediente (id, nombre, unidad_medida, stock_actual, punto_reorden) FROM stdin;
\.


--
-- Data for Name: mesa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mesa (id, numero, capacidad, estado) FROM stdin;
\.


--
-- Data for Name: movimiento_inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento_inventario (id, ingrediente_id, tipo_movimiento, cantidad, cuenta_id, fecha_movimiento) FROM stdin;
\.


--
-- Data for Name: notificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notificacion (id, tipo, mensaje, estado, usuario_destino_id, fecha_creacion) FROM stdin;
\.


--
-- Data for Name: pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pago (id, cuenta_id, metodo_pago, monto, fecha_pago) FROM stdin;
\.


--
-- Data for Name: plato; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plato (id, nombre, precio, descripcion, categoria, activo) FROM stdin;
\.


--
-- Data for Name: receta_ingrediente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receta_ingrediente (id, plato_id, ingrediente_id, cantidad_requerida) FROM stdin;
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id, nombre, rol, credenciales_email, credenciales_password, activo) FROM stdin;
\.


--
-- Name: cuenta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cuenta_id_seq', 1, false);


--
-- Name: detalle_cuenta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_cuenta_id_seq', 1, false);


--
-- Name: ingrediente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingrediente_id_seq', 1, false);


--
-- Name: mesa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mesa_id_seq', 1, false);


--
-- Name: movimiento_inventario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimiento_inventario_id_seq', 1, false);


--
-- Name: notificacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notificacion_id_seq', 1, false);


--
-- Name: pago_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pago_id_seq', 1, false);


--
-- Name: plato_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plato_id_seq', 1, false);


--
-- Name: receta_ingrediente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.receta_ingrediente_id_seq', 1, false);


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_seq', 1, false);


--
-- Name: cuenta cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta
    ADD CONSTRAINT cuenta_pkey PRIMARY KEY (id);


--
-- Name: detalle_cuenta detalle_cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_cuenta
    ADD CONSTRAINT detalle_cuenta_pkey PRIMARY KEY (id);


--
-- Name: ingrediente ingrediente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingrediente
    ADD CONSTRAINT ingrediente_pkey PRIMARY KEY (id);


--
-- Name: mesa mesa_numero_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa
    ADD CONSTRAINT mesa_numero_key UNIQUE (numero);


--
-- Name: mesa mesa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa
    ADD CONSTRAINT mesa_pkey PRIMARY KEY (id);


--
-- Name: movimiento_inventario movimiento_inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_pkey PRIMARY KEY (id);


--
-- Name: notificacion notificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_pkey PRIMARY KEY (id);


--
-- Name: pago pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id);


--
-- Name: plato plato_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plato
    ADD CONSTRAINT plato_pkey PRIMARY KEY (id);


--
-- Name: receta_ingrediente receta_ingrediente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta_ingrediente
    ADD CONSTRAINT receta_ingrediente_pkey PRIMARY KEY (id);


--
-- Name: usuario usuario_credenciales_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_credenciales_email_key UNIQUE (credenciales_email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- Name: cuenta cuenta_mesa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta
    ADD CONSTRAINT cuenta_mesa_id_fkey FOREIGN KEY (mesa_id) REFERENCES public.mesa(id) ON DELETE RESTRICT;


--
-- Name: cuenta cuenta_mesero_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta
    ADD CONSTRAINT cuenta_mesero_id_fkey FOREIGN KEY (mesero_id) REFERENCES public.usuario(id) ON DELETE SET NULL;


--
-- Name: detalle_cuenta detalle_cuenta_cuenta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_cuenta
    ADD CONSTRAINT detalle_cuenta_cuenta_id_fkey FOREIGN KEY (cuenta_id) REFERENCES public.cuenta(id) ON DELETE CASCADE;


--
-- Name: detalle_cuenta detalle_cuenta_plato_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_cuenta
    ADD CONSTRAINT detalle_cuenta_plato_id_fkey FOREIGN KEY (plato_id) REFERENCES public.plato(id) ON DELETE RESTRICT;


--
-- Name: movimiento_inventario movimiento_inventario_cuenta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_cuenta_id_fkey FOREIGN KEY (cuenta_id) REFERENCES public.cuenta(id) ON DELETE SET NULL;


--
-- Name: movimiento_inventario movimiento_inventario_ingrediente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_ingrediente_id_fkey FOREIGN KEY (ingrediente_id) REFERENCES public.ingrediente(id) ON DELETE CASCADE;


--
-- Name: notificacion notificacion_usuario_destino_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_usuario_destino_id_fkey FOREIGN KEY (usuario_destino_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: pago pago_cuenta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_cuenta_id_fkey FOREIGN KEY (cuenta_id) REFERENCES public.cuenta(id) ON DELETE RESTRICT;


--
-- Name: receta_ingrediente receta_ingrediente_ingrediente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta_ingrediente
    ADD CONSTRAINT receta_ingrediente_ingrediente_id_fkey FOREIGN KEY (ingrediente_id) REFERENCES public.ingrediente(id) ON DELETE CASCADE;


--
-- Name: receta_ingrediente receta_ingrediente_plato_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta_ingrediente
    ADD CONSTRAINT receta_ingrediente_plato_id_fkey FOREIGN KEY (plato_id) REFERENCES public.plato(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict VRVXxq9tsSyVv7ErNX3ZLLk4Fn7gqMsY3OWzbxHL0d5Sceu6kVPuSsYEM0zcg3j

