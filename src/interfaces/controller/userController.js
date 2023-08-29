import multer from "multer";
import path from "path";
import UsersService from "../../application/services/usersService.js";
import UsersRepository from "../../domain/repositories/usersRepository.js";
import generarJWT from "../../utils/generarJWT.js";
import deleteImage from "../../utils/deleteImage.js";
import connection from "../../infraestructure/config/db.js";

const usersRepository = new UsersRepository(connection);
const usersService = new UsersService(usersRepository);

const authenticateUser = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const user = await usersService.authenticateUser(usuario, password);

    if (user) {
      res.json({
        idusuario: user.idusuario,
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
    const { ...dataFilter } = req.body;
    const users = await usersService.getAllUsersAdmin(dataFilter);
    
    if (!users || users.length <= 0) {
      res.status(404).json({ error: "No se encontraron usuarios" });
    } else {
      res.json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al obtener los usuarios (controller - getAllUsersAdmin)" });
  }
};

const getAllUsersAdminPaginated = async (req, res) => {
  try {
    const { page, pageSize, ...dataFilter } = req.body;

    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 9;

    const users = await usersService.getAllUsersAdminPaginated(dataFilter, pageNumber, limit);
    
    if (!users || users.usersData.length <= 0) {
      res.status(404).json({ error: "No se encontraron usuarios" });
    } else {
      res.json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al obtener los usuarios (controller - getAllUsersAdminPaginated)" });
  }
};

const createUser = async (req, res) => {
  try {
    const dataUser = req.body;
    const user = await usersService.createUser(dataUser);

    if (user) {
      res.json({ message: "Usuario creado exitosamente" });
    } else {
      res.status(400).json({ error: "El nombre de usuario ya está en uso" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al crear el usuario (controller - createUser)" });
  }
}

const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userRol = req.user.rol;
    const userId = req.user.idusuario;
    const user = await usersService.getUserDetail(id, userId, userRol);

    if (!user) {
      res.status(404).json({ error: "No se encontró el usuario" });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error("Error en el servidor al obtener el usuario (controller - getUserDetail)");
    res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { user } = req;
    res.json({
      idusuario: user.idusuario,
      usuario: user.usuario,
      rol: user.rol,
      estado: user.estado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al obtener el perfil del usuario (controller - getProfile)" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const dataUser = req.body;
    const idUser = req.user.idusuario;
    const userRol = req.user.rol;
    const updatedUser = await usersService.updateUser(id, dataUser, idUser, userRol);

    if (updatedUser) {
      res.json({ message: "Usuario actualizado correctamente" });
    } else {
      res.status(400).json({ error: "No se pudo actualizar, por favor revise sus datos e intente nuevamente." });
    }
  } catch (error) {
    console.error("Error en el servidor al actualizar el usuario (controller - updateUser)");
    res.status(500).json({ error: error.message });
  }
};

const changeStatusUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersService.changeStatusUser(id);

    if (user) {
      res.json({ message: "Usuario deshabilitado correctamente" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al eliminar el usuario (controller - changeStatusUser)" });
  }
};

const addUpdateImageUser = async (req, res) => {
  try {
    const { id } = req.params;
    const newImage = req.file ? req.file.filename : null;
    const imageUser = await usersService.addUpdateImageUser(id, newImage);

    if (imageUser) {
      res.json({ message: "Imágen cargada exitosamente" });
    } else {
      res.status(404).json({ error: "No se pudo cargar la imágen" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - addUpdateImageUser)" });
  }
};

const deleteImageUser = async (req, res) => {
  try {
    const { id } = req.params;
    const img = await usersService.deleteImageUser(id);

    if (img) {
      const imgRoute = `src/infraestructure/storage/local/images/usuarios/${img}`;
      deleteImage(imgRoute);

      res.json({ message: "Imagen eliminada correctamente" });
    } else {
      res.status(404).json({ error: "Imagen asociada no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor (controller - deleteImageUser)" });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/infraestructure/storage/local/images/usuarios");
  },

  filename: async (req, file, cb) => {
    try {
      const { id } = req.params;
      const user = await usersService.getUserDetail(id);
      const userName = user.usuario.toLowerCase().replace(/\s/g, "_");
      const extention = path.extname(file.originalname);
      const imgName = `${userName}${extention}`;

      cb(null, imgName);
    } catch (error) {
      const err = new Error("Ups, algo salió mal al guardar la imagen");
      err.status = 400;
      return cb(err);
    }
  },
});

const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const extPermitidas = [".png", ".jpg", ".jpeg"];
    const ext = path.extname(file.originalname);

    if (!extPermitidas.includes(ext)) {
      const error = new Error("Formato de imagen no válido. Se permiten solo archivos .png, .jpg o .jpeg.");
      error.status = 400;
      return cb(error);
    }

    cb(null, true);
  },
});

export {
  authenticateUser,
  getAllUsersAdmin,
  getAllUsersAdminPaginated,
  getUserDetail,
  createUser,
  getProfile,
  updateUser,
  addUpdateImageUser,
  deleteImageUser,
  uploadImage,
  changeStatusUser,
};
