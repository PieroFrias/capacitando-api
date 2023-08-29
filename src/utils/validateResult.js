import { validationResult } from "express-validator";

const validateResult = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (error) {
    const errorMessages = error.array().map((err) => err.msg);
    res.status(400).json({ errors: errorMessages });
  }
};

export default validateResult;
