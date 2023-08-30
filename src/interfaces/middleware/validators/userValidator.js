import { check } from "express-validator";
import validateResult from "../../../utils/validateResult.js";

const validateCreate = [
  check("usuario").exists().trim().not().isEmpty().withMessage("El nombre de usuario es requerido"),
  check("password").isLength({ min: 8 }).withMessage("El password debe tener mínimo 8 caracteres"),    
  check("nombre").exists().trim().not().isEmpty().withMessage("El nombre es requerido"),
  check("apellido").exists().trim().not().isEmpty().withMessage("El apellido es requerido"),
  check("telefono").optional().trim().isLength({ min: 9, max: 9 }).withMessage("El número de celular debe tener 9 caracteres").matches(/^[0-9]+$/).withMessage("El número de celular debe contener solo números"),
  check("dni").optional().trim().isLength({ min: 8, max: 8 }).withMessage("El número de DNI debe tener 8 caracteres").matches(/^[0-9]+$/).withMessage("El número de DNI debe contener solo números"),
  check("correo").exists().not().isEmpty().isEmail().withMessage("Email no válido"),
  check("direccion").optional().trim().not().isEmpty().withMessage("La dirección es requerida"),
  check("carrera").optional().trim().not().isEmpty().withMessage("La carrera es requerida"),
  check("perfil").optional().trim().not().isEmpty().withMessage("El perfil es requerido"),
  check("rol").exists().not().isEmpty().withMessage("El rol es requerido").matches(/^[2-3]$/).withMessage("El campo rol solo puede contener estos valores: 2 (docente) y 3 (estudiante)"),

  (req, res, next) => { validateResult(req, res, next) },
]

const validateEdit = [
  check("usuario").optional().trim().not().isEmpty().withMessage("El nombre de usuario es requerido"),
  check(["currentPassword", "newPassword"]).optional().isLength({ min: 8 }).withMessage("El password debe tener mínimo 8 caracteres"),
  check("nombre").optional().trim().not().isEmpty().withMessage("El nombre es requerido"),
  check("apellido").optional().trim().not().isEmpty().withMessage("El apellido es requerido"),
  check("telefono").optional().trim().isLength({ min: 9, max: 9 }).withMessage("El número de celular debe tener 9 caracteres").matches(/^[0-9]+$/).withMessage("El número de celular debe contener solo números"),
  check("dni").optional().trim().isLength({ min: 8, max: 8 }).withMessage("El número de DNI debe tener 8 caracteres").matches(/^[0-9]+$/).withMessage("El número de DNI debe contener solo números"),
  check("correo").optional().not().isEmpty().isEmail().withMessage("Email no válido"),
  check("direccion").optional().trim().not().isEmpty().withMessage("La dirección es requerida"),
  check("carrera").optional().trim().not().isEmpty().withMessage("La carrera es requerida"),
  check("perfil").optional().trim().not().isEmpty().withMessage("El perfil es requerido"),
  check("rol").optional().not().isEmpty().withMessage("El rol es requerido").matches(/^[2-3]$/).withMessage("El campo rol solo puede contener estos valores: 2 (docente) y 3 (estudiante)"),

  (req, res, next) => { validateResult(req, res, next) },
]

export { validateCreate, validateEdit };
