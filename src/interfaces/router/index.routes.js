import express from "express";
import coursesRouter from "./courses.routes.js";
import usersRouter from "./users.routes.js";
import sessionsRouter from "./sessions.routes.js";
import categoriesRouter from "./categories.routes.js";
import contentsRouter from "./contents.routes.js";
import filesRouter from "./files.routes.js";

const router = express.Router();

router.use("/courses", coursesRouter);
router.use("/users", usersRouter);
router.use("/sessions", sessionsRouter);
router.use("/categories", categoriesRouter);
router.use("/contents", contentsRouter);
router.use("/data", filesRouter);

export default router;
