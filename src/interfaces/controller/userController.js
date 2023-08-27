import UsersService from "../../application/services/usersService.js";
import UsersRepository from "../../domain/repositories/usersRepository.js";
import generarJWT from "../../utils/generarJWT.js";
import connection from "../../infraestructure/config/db.js";

const usersRepository = new UsersRepository(connection);
const userService = new UsersService(usersRepository);

const authenticateUser = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const user = await userService.authenticateUser(usuario, password);

    if (user) {
      res.json({
        id_user: user.idusuario,
        usuario: user.usuario,
        rol: user.rol,
        status: user.estado,
        token: generarJWT(usuario),
      });
    } else {
      res.status(400).json({ error: "Usuario o contraseña no válidos" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al autenticar el usuario (controller - authenticateUser)" });
  }
};

const getAllUsersAdmin = async (req, res) => {
  try {
    const { page, pageSize, ...dataFilter } = req.body;

    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 9;

    const users = await userService.getAllUsersAdmin(dataFilter, pageNumber, limit);
    
    if (!users || users.usersData.length <= 0) {
      res.status(404).json({ error: "No se encontraron usuarios" });
    } else {
      res.json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al obtener los usuarios (controller - getAllUsersAdmin)" });
  }
};

export {
  authenticateUser,
  getAllUsersAdmin,
};
