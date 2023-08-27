import express from "express";
import { fileImage } from "../controller/fileController.js"

const router = express.Router();

router.get('/:folder/:img', fileImage);

export default router;

