import express from "express";
import filesRouter from "./files.routes.js"

const router = express.Router();

router.use("/data/images", filesRouter);

export default router;
