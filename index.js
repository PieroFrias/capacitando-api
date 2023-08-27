import express from "express";
import indexRouter from "./src/interfaces/router/index.routes.js";
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandlerMiddleware from "./src/interfaces/middleware/errorHandlerMiddleware.js";
import creatAdmin from "./src/utils/firstUser.js";

dotenv.config();

const app = express();
creatAdmin();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(cors());

app.use("/api", indexRouter);

app.get("/", (req, res) => {
  res.send("API CAPACITANDO");
});

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`🚀 Servidor iniciado en el puerto ${port}`);
});
