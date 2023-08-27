import jwt from "jsonwebtoken";

const generarJWT = (usuario) => {
  return jwt.sign({ usuario }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

export default generarJWT;
