--
-- PostgreSQL database dump
--

\restrict nfLOGWLispygDXKKl8eZqmcP4xgqQYEMnt9DBgahEa2ACjUfs7BcDtDlg0JCfOw

-- Dumped from database version 17.11 (Debian 17.11-0+deb13u1)
-- Dumped by pg_dump version 17.11 (Debian 17.11-0+deb13u1)

-- Started on 2026-10-19 16:50:35 -05

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
-- TOC entry 898 (class 1247 OID 58220)
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
-- TOC entry 901 (class 1247 OID 58232)
-- Name: estado_cuenta; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_cuenta AS ENUM (
    'Abierta',
    'Pagada',
    'Cerrada'
);


ALTER TYPE public.estado_cuenta OWNER TO postgres;

--
-- TOC entry 895 (class 1247 OID 58240)
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
-- TOC entry 865 (class 1247 OID 58203)
-- Name: estado_mesa; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_mesa AS ENUM (
    'Libre',
    'Ocupada',
    'Reservada'
);


ALTER TYPE public.estado_mesa OWNER TO postgres;

--
-- TOC entry 880 (class 1247 OID 58274)
-- Name: estado_notificacion; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_notificacion AS ENUM (
    'No Leída',
    'Leída',
    'Entregada'
);


ALTER TYPE public.estado_notificacion OWNER TO postgres;

--
-- TOC entry 871 (class 1247 OID 58252)
-- Name: metodo_pago; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.metodo_pago AS ENUM (
    'Efectivo',
    'Tarjeta',
    'Otro'
);


ALTER TYPE public.metodo_pago OWNER TO postgres;

--
-- TOC entry 868 (class 1247 OID 58210)
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
-- TOC entry 874 (class 1247 OID 58260)
-- Name: tipo_movimiento; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_movimiento AS ENUM (
    'Ingreso',
    'Deducción por Venta',
    'Merma/Ajuste'
);


ALTER TYPE public.tipo_movimiento OWNER TO postgres;

--
-- TOC entry 877 (class 1247 OID 58268)
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
-- TOC entry 228 (class 1259 OID 58338)
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
-- TOC entry 227 (class 1259 OID 58337)
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
-- TOC entry 4232 (class 0 OID 0)
-- Dependencies: 227
-- Name: cuenta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cuenta_id_seq OWNED BY public.cuenta.id;


--
-- TOC entry 230 (class 1259 OID 58360)
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
-- TOC entry 229 (class 1259 OID 58359)
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
-- TOC entry 4233 (class 0 OID 0)
-- Dependencies: 229
-- Name: detalle_cuenta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalle_cuenta_id_seq OWNED BY public.detalle_cuenta.id;


--
-- TOC entry 224 (class 1259 OID 58312)
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
-- TOC entry 223 (class 1259 OID 58311)
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
-- TOC entry 4234 (class 0 OID 0)
-- Dependencies: 223
-- Name: ingrediente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingrediente_id_seq OWNED BY public.ingrediente.id;


--
-- TOC entry 218 (class 1259 OID 58282)
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
-- TOC entry 217 (class 1259 OID 58281)
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
-- TOC entry 4235 (class 0 OID 0)
-- Dependencies: 217
-- Name: mesa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mesa_id_seq OWNED BY public.mesa.id;


--
-- TOC entry 234 (class 1259 OID 58394)
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
-- TOC entry 233 (class 1259 OID 58393)
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
-- TOC entry 4236 (class 0 OID 0)
-- Dependencies: 233
-- Name: movimiento_inventario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movimiento_inventario_id_seq OWNED BY public.movimiento_inventario.id;


--
-- TOC entry 236 (class 1259 OID 58412)
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
-- TOC entry 235 (class 1259 OID 58411)
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
-- TOC entry 4237 (class 0 OID 0)
-- Dependencies: 235
-- Name: notificacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificacion_id_seq OWNED BY public.notificacion.id;


--
-- TOC entry 232 (class 1259 OID 58381)
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
-- TOC entry 231 (class 1259 OID 58380)
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
-- TOC entry 4238 (class 0 OID 0)
-- Dependencies: 231
-- Name: pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pago_id_seq OWNED BY public.pago.id;


--
-- TOC entry 222 (class 1259 OID 58302)
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
-- TOC entry 221 (class 1259 OID 58301)
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
-- TOC entry 4239 (class 0 OID 0)
-- Dependencies: 221
-- Name: plato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plato_id_seq OWNED BY public.plato.id;


--
-- TOC entry 226 (class 1259 OID 58321)
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
-- TOC entry 225 (class 1259 OID 58320)
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
-- TOC entry 4240 (class 0 OID 0)
-- Dependencies: 225
-- Name: receta_ingrediente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.receta_ingrediente_id_seq OWNED BY public.receta_ingrediente.id;


--
-- TOC entry 220 (class 1259 OID 58292)
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
-- TOC entry 219 (class 1259 OID 58291)
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
-- TOC entry 4241 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;


--
-- TOC entry 4012 (class 2604 OID 58341)
-- Name: cuenta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta ALTER COLUMN id SET DEFAULT nextval('public.cuenta_id_seq'::regclass);


--
-- TOC entry 4018 (class 2604 OID 58363)
-- Name: detalle_cuenta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_cuenta ALTER COLUMN id SET DEFAULT nextval('public.detalle_cuenta_id_seq'::regclass);


--
-- TOC entry 4008 (class 2604 OID 58315)
-- Name: ingrediente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingrediente ALTER COLUMN id SET DEFAULT nextval('public.ingrediente_id_seq'::regclass);


--
-- TOC entry 4002 (class 2604 OID 58285)
-- Name: mesa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa ALTER COLUMN id SET DEFAULT nextval('public.mesa_id_seq'::regclass);


--
-- TOC entry 4023 (class 2604 OID 58397)
-- Name: movimiento_inventario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario ALTER COLUMN id SET DEFAULT nextval('public.movimiento_inventario_id_seq'::regclass);


--
-- TOC entry 4025 (class 2604 OID 58415)
-- Name: notificacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion ALTER COLUMN id SET DEFAULT nextval('public.notificacion_id_seq'::regclass);


--
-- TOC entry 4021 (class 2604 OID 58384)
-- Name: pago id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago ALTER COLUMN id SET DEFAULT nextval('public.pago_id_seq'::regclass);


--
-- TOC entry 4006 (class 2604 OID 58305)
-- Name: plato id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plato ALTER COLUMN id SET DEFAULT nextval('public.plato_id_seq'::regclass);


--
-- TOC entry 4011 (class 2604 OID 58324)
-- Name: receta_ingrediente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta_ingrediente ALTER COLUMN id SET DEFAULT nextval('public.receta_ingrediente_id_seq'::regclass);


--
-- TOC entry 4004 (class 2604 OID 58295)
-- Name: usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- TOC entry 4218 (class 0 OID 58338)
-- Dependencies: 228
-- Data for Name: cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4220 (class 0 OID 58360)
-- Dependencies: 230
-- Data for Name: detalle_cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4214 (class 0 OID 58312)
-- Dependencies: 224
-- Data for Name: ingrediente; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4208 (class 0 OID 58282)
-- Dependencies: 218
-- Data for Name: mesa; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4224 (class 0 OID 58394)
-- Dependencies: 234
-- Data for Name: movimiento_inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4226 (class 0 OID 58412)
-- Dependencies: 236
-- Data for Name: notificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4222 (class 0 OID 58381)
-- Dependencies: 232
-- Data for Name: pago; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4212 (class 0 OID 58302)
-- Dependencies: 222
-- Data for Name: plato; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4216 (class 0 OID 58321)
-- Dependencies: 226
-- Data for Name: receta_ingrediente; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4210 (class 0 OID 58292)
-- Dependencies: 220
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4242 (class 0 OID 0)
-- Dependencies: 227
-- Name: cuenta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cuenta_id_seq', 1, false);


--
-- TOC entry 4243 (class 0 OID 0)
-- Dependencies: 229
-- Name: detalle_cuenta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_cuenta_id_seq', 1, false);


--
-- TOC entry 4244 (class 0 OID 0)
-- Dependencies: 223
-- Name: ingrediente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingrediente_id_seq', 1, false);


--
-- TOC entry 4245 (class 0 OID 0)
-- Dependencies: 217
-- Name: mesa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mesa_id_seq', 1, false);


--
-- TOC entry 4246 (class 0 OID 0)
-- Dependencies: 233
-- Name: movimiento_inventario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimiento_inventario_id_seq', 1, false);


--
-- TOC entry 4247 (class 0 OID 0)
-- Dependencies: 235
-- Name: notificacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notificacion_id_seq', 1, false);


--
-- TOC entry 4248 (class 0 OID 0)
-- Dependencies: 231
-- Name: pago_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pago_id_seq', 1, false);


--
-- TOC entry 4249 (class 0 OID 0)
-- Dependencies: 221
-- Name: plato_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plato_id_seq', 1, false);


--
-- TOC entry 4250 (class 0 OID 0)
-- Dependencies: 225
-- Name: receta_ingrediente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.receta_ingrediente_id_seq', 1, false);


--
-- TOC entry 4251 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_seq', 1, false);


--
-- TOC entry 4043 (class 2606 OID 58348)
-- Name: cuenta cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta
    ADD CONSTRAINT cuenta_pkey PRIMARY KEY (id);


--
-- TOC entry 4045 (class 2606 OID 58369)
-- Name: detalle_cuenta detalle_cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_cuenta
    ADD CONSTRAINT detalle_cuenta_pkey PRIMARY KEY (id);


--
-- TOC entry 4039 (class 2606 OID 58319)
-- Name: ingrediente ingrediente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingrediente
    ADD CONSTRAINT ingrediente_pkey PRIMARY KEY (id);


--
-- TOC entry 4029 (class 2606 OID 58290)
-- Name: mesa mesa_numero_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa
    ADD CONSTRAINT mesa_numero_key UNIQUE (numero);


--
-- TOC entry 4031 (class 2606 OID 58288)
-- Name: mesa mesa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa
    ADD CONSTRAINT mesa_pkey PRIMARY KEY (id);


--
-- TOC entry 4049 (class 2606 OID 58400)
-- Name: movimiento_inventario movimiento_inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_pkey PRIMARY KEY (id);


--
-- TOC entry 4051 (class 2606 OID 58421)
-- Name: notificacion notificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_pkey PRIMARY KEY (id);


--
-- TOC entry 4047 (class 2606 OID 58387)
-- Name: pago pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id);


--
-- TOC entry 4037 (class 2606 OID 58310)
-- Name: plato plato_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plato
    ADD CONSTRAINT plato_pkey PRIMARY KEY (id);


--
-- TOC entry 4041 (class 2606 OID 58326)
-- Name: receta_ingrediente receta_ingrediente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta_ingrediente
    ADD CONSTRAINT receta_ingrediente_pkey PRIMARY KEY (id);


--
-- TOC entry 4033 (class 2606 OID 58300)
-- Name: usuario usuario_credenciales_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_credenciales_email_key UNIQUE (credenciales_email);


--
-- TOC entry 4035 (class 2606 OID 58298)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 4054 (class 2606 OID 58349)
-- Name: cuenta cuenta_mesa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta
    ADD CONSTRAINT cuenta_mesa_id_fkey FOREIGN KEY (mesa_id) REFERENCES public.mesa(id) ON DELETE RESTRICT;


--
-- TOC entry 4055 (class 2606 OID 58354)
-- Name: cuenta cuenta_mesero_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta
    ADD CONSTRAINT cuenta_mesero_id_fkey FOREIGN KEY (mesero_id) REFERENCES public.usuario(id) ON DELETE SET NULL;


--
-- TOC entry 4056 (class 2606 OID 58370)
-- Name: detalle_cuenta detalle_cuenta_cuenta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_cuenta
    ADD CONSTRAINT detalle_cuenta_cuenta_id_fkey FOREIGN KEY (cuenta_id) REFERENCES public.cuenta(id) ON DELETE CASCADE;


--
-- TOC entry 4057 (class 2606 OID 58375)
-- Name: detalle_cuenta detalle_cuenta_plato_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_cuenta
    ADD CONSTRAINT detalle_cuenta_plato_id_fkey FOREIGN KEY (plato_id) REFERENCES public.plato(id) ON DELETE RESTRICT;


--
-- TOC entry 4059 (class 2606 OID 58406)
-- Name: movimiento_inventario movimiento_inventario_comanda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_comanda_id_fkey FOREIGN KEY (cuenta_id) REFERENCES public.cuenta(id) ON DELETE SET NULL;


--
-- TOC entry 4060 (class 2606 OID 58401)
-- Name: movimiento_inventario movimiento_inventario_ingrediente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_ingrediente_id_fkey FOREIGN KEY (ingrediente_id) REFERENCES public.ingrediente(id) ON DELETE CASCADE;


--
-- TOC entry 4061 (class 2606 OID 58422)
-- Name: notificacion notificacion_usuario_destino_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_usuario_destino_id_fkey FOREIGN KEY (usuario_destino_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 4058 (class 2606 OID 58388)
-- Name: pago pago_comanda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_comanda_id_fkey FOREIGN KEY (cuenta_id) REFERENCES public.cuenta(id) ON DELETE RESTRICT;


--
-- TOC entry 4052 (class 2606 OID 58332)
-- Name: receta_ingrediente receta_ingrediente_ingrediente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta_ingrediente
    ADD CONSTRAINT receta_ingrediente_ingrediente_id_fkey FOREIGN KEY (ingrediente_id) REFERENCES public.ingrediente(id) ON DELETE CASCADE;


--
-- TOC entry 4053 (class 2606 OID 58327)
-- Name: receta_ingrediente receta_ingrediente_platillo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta_ingrediente
    ADD CONSTRAINT receta_ingrediente_platillo_id_fkey FOREIGN KEY (plato_id) REFERENCES public.plato(id) ON DELETE CASCADE;


-- Completed on 2026-10-19 16:50:35 -05

--
-- PostgreSQL database dump complete
--

\unrestrict nfLOGWLispygDXKKl8eZqmcP4xgqQYEMnt9DBgahEa2ACjUfs7BcDtDlg0JCfOw

