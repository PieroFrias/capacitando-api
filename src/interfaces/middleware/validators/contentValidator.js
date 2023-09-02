import { check } from "express-validator";
import validateResult from "../../../utils/validateResult.js";

const validateCreate = [
  check("titulo").exists().trim().not().isEmpty().withMessage("El título del contenido es requerido"),
  check("idsesion").exists().trim().not().isEmpty().isInt({ min: 1 }).withMessage("Sesión asociada no válida"),
  check("url_video").exists().trim().not().isEmpty().withMessage("La url del contenido es requerida").isURL().withMessage("La url del video no es válida"),
  check("minutos_video").exists().trim().not().isEmpty().isInt({ min: 0 }).withMessage("Los minutos del vídeo debe ser un valor entero (aproximado))"),

  (req, res, next) => { validateResult(req, res, next) },
]

const validateEdit = [
  check("titulo").optional().trim().not().isEmpty().withMessage("El título del contenido es requerido"),
  check("url_video").optional().trim().not().isEmpty().withMessage("La url del contenido es requerida").isURL().withMessage("La url del video no es válida"),
  check("minutos_video").optional().trim().not().isEmpty().isInt({ min: 0 }).withMessage("Los minutos del vídeo debe ser un valor entero (aproximado)"),

  (req, res, next) => { validateResult(req, res, next) },
]

export { validateCreate, validateEdit };
