import { Router } from "express";

import RecetaRepositorio from "../infrastructure/RecetaRepositorio.js";
import CrearReceta from "../application/CrearReceta.js";
import RecetaController from "./components/RecetaController.js";

const router = Router();

const repositorio = new RecetaRepositorio();
const crearReceta = new CrearReceta(repositorio);
const controlador = new RecetaController(crearReceta);

router.post("/", controlador.crear);

export default router;