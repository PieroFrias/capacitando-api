import { check } from "express-validator";
import validateResult from "../../../utils/validateResult.js";

const validateCreate = [
  check("nombre_sesion").exists().trim().not().isEmpty().withMessage("El nombre de la sesión es requerida"),
  check("descripcion").optional(),
  check("idcurso").exists().trim().not().isEmpty().isInt({ min: 1 }).withMessage("Curso asociado no válido"),

  (req, res, next) => { validateResult(req, res, next) },
]

const validateEdit = [
  check("nombre_sesion").optional().trim().not().isEmpty().withMessage("El nombre de la sesión es requerida"),
  check("descripcion").optional(),

  (req, res, next) => { validateResult(req, res, next) },
]

export { validateCreate, validateEdit };
