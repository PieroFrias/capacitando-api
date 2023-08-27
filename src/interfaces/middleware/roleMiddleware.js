import jwt from "jsonwebtoken";
import User from "../../infraestructure/models/userModel.js";

const checkRole = (role) => async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      where: {
        usuario: decoded.usuario,
        estado: 1,
      },
    });

    if (role.includes(user.rol)) {
      req.user = user;
      next();
    } else {
      return res
        .status(403)
        .json({ error: "El usuario no tiene permisos suficientes." });
    }
  } catch (error) {
    res.status(403).json({ error: "No autorizado" });
  }
};

export default checkRole;
