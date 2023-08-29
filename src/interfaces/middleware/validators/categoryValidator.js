import { check } from "express-validator";
import validateResult from "../../../utils/validateResult.js";

const validateCreate = [
  check("categoria").exists().trim().not().isEmpty().withMessage("La categoría es requerida"),

  (req, res, next) => { validateResult(req, res, next) },
];

const validateEdit = [
  check("categoria").optional().trim().not().isEmpty().withMessage("La categoría es requerida"),

  (req, res, next) => { validateResult(req, res, next) },
]

export { validateCreate, validateEdit };
