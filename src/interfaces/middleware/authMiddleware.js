import jwt from "jsonwebtoken";
import User from "../../infrastructure/models/userModel.js"

const checkAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(' ')[1];      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findOne({
        where: {
          usuario: decoded.usuario,
          estado: 1,
        },
        attributes: { exclude: ['password'] },
      });

      return next();
    } catch (error) {
      const e = new Error('Token no válido');
      return res.status(403).json({ error: e.message });
    }
  }

  if (!token) {
    const error = new Error('Token no válido o inexistente');
    return res.status(403).json({ error: error.message });
  }

  next();
};

export default checkAuth;
