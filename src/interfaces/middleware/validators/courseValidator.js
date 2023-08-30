import { check } from "express-validator";
import validateResult from "../../../utils/validateResult.js";

const validateCreate = [
  check("titulo").exists().trim().not().isEmpty().withMessage("El nombre de título del curso es requerido"),
  check("descripcion").optional().trim().not().isEmpty().withMessage("La descripción del curso es requerida"),
  check("url_video_intro").exists().trim().not().isEmpty().withMessage("La url del video de introducción es requerida").isURL().withMessage("La url del video no es válida"),
  check("idcategoria").exists().trim().not().isEmpty().isInt({ min: 1 }).withMessage("Categoría asociada no válida"),

  (req, res, next) => { validateResult(req, res, next) },
]

const validateEdit = [
  check("titulo").optional().trim().not().isEmpty().withMessage("El nombre de título del curso es requerido"),
  check("descripcion").optional().trim().not().isEmpty().withMessage("La descripción del curso es requerida"),
  check("url_video_intro").optional().trim().not().isEmpty().withMessage("La url del video de introducción es requerida").isURL().withMessage("La url del video no es válida"),
  check("idcategoria").optional().trim().not().isEmpty().isInt({ min: 1 }).withMessage("Categoría asociada no válida"),

  (req, res, next) => { validateResult(req, res, next) },
]

export { validateCreate, validateEdit };
