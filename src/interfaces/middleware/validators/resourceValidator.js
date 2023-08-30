import { check } from "express-validator";
import validateResult from "../../../utils/validateResult.js";

const validateCreate = [
  check("nombre").exists().trim().not().isEmpty().withMessage("El nombre del recurso es requerido"),
  check("url").exists().trim().not().isEmpty().withMessage("La url del recurso es requerida").isURL().withMessage("La url del recurso no es válida"),
  check("idcontenido").exists().trim().not().isEmpty().isInt({ min: 1 }).withMessage("Contenido asociado no válido"),

  (req, res, next) => { validateResult(req, res, next) },
]

const validateEdit = [
  check("nombre").optional().trim().not().isEmpty().withMessage("El nombre del recurso es requerido"),
  check("url").optional().trim().not().isEmpty().withMessage("La url del recurso es requerida").isURL().withMessage("La url del recurso no es válida"),

  (req, res, next) => { validateResult(req, res, next) },
]

export { validateCreate, validateEdit };
