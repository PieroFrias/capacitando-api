import { check } from "express-validator";
import validateResult from "../../../utils/validateResult.js";

const validateStatus = [
  check("estado").optional().trim().not().isEmpty().withMessage("El valor de estado es obligatorio").matches(/^[0-1]$/).withMessage("El campo estado solo puede contener estos valores: 0 (deshabilitado) y 1 (habilitado)"),

  (req, res, next) => { validateResult(req, res, next); },
];

export { validateStatus };
