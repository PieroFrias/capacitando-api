import express from "express";
import coursesRouter from "./courses.routes.js";
import usersRouter from "./users.routes.js";
import sessionsRouter from "./sessions.routes.js";
import filesRouter from "./files.routes.js"

const router = express.Router();

router.use("/courses", coursesRouter);
router.use("/users", usersRouter);
router.use("/sessions", sessionsRouter);
router.use("/data/images", filesRouter);

export default router;
