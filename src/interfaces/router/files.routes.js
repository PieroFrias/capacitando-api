import express from "express";
import { fileImage } from "../controller/fileController.js"

const router = express.Router();

router.get('/:folder/:file', fileImage);

export default router;

