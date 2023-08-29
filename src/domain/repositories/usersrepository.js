import { Op } from "sequelize";
import User from "../../infraestructure/models/userModel.js";

class usersRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async authenticateUser(usuario, password) {
    try {
      const user = await User.findOne({
        where: { usuario, estado: 1 },
      });

      if (user && (await user.comprobarPassword(password))) {
        console.log("Password correcto");
        return user;
      } else {
        console.log("Password incorrecto");
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllUsersAdmin(dataFilter) {
    try {
      const { search, rol } = dataFilter;
      const rolFilter = rol ? { rol: rol } : {}; 

      let whereCondition = {};
      whereCondition = {
        rol: {
          [Op.not]: 1,
        },
        ...rolFilter,
      };
      
      if (search) {
        whereCondition[Op.or] = [
          { usuario: { [Op.like]: `%${search}%` } },
          { apellido: { [Op.like]: `%${search}%` } },
          { correo: { [Op.like]: `%${search}%` } },
        ];
      }

      const users = await User.findAll({
        where: whereCondition,
        attributes: { exclude: ["password"] },
        order: [["apellido", "ASC"]],
        distinct: true,
      });

      if (users.length <= 0) { return false; }

      const usersData = users.map((user) => {
        return {
          ...user.get(),
          foto: user.foto ? `${process.env.DOMAIN}/${process.env.DATA}/usuarios/${author.foto}` : null,
        };
      });

      return usersData;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsersAdminPaginated(dataFilter, page, pageSize) {
    try {
      const offset = (page - 1) * pageSize;

      const { search, rol } = dataFilter;
      const rolFilter = rol ? { rol: rol } : {}; 

      let whereCondition = {};
      whereCondition = {
        rol: {
          [Op.not]: 1,
        },
        ...rolFilter,
      };
      
      if (search) {
        whereCondition[Op.or] = [
          { usuario: { [Op.like]: `%${search}%` } },
          { apellido: { [Op.like]: `%${search}%` } },
          { correo: { [Op.like]: `%${search}%` } },
        ];
      }

      const users = await User.findAndCountAll({
        where: whereCondition,
        attributes: { exclude: ["password"] },
        order: [["apellido", "ASC"]],
        offset,
        limit: pageSize,
        distinct: true,
      });

      if (users.count <= 0) { return false; }

      const usersData = users.rows.map((user) => {
        return {
          ...user.get(),
          foto: user.foto ? `${process.env.DOMAIN}/${process.env.DATA}/usuarios/${author.foto}` : null,
        };
      });

      const totalItems = users.count;
      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        usersData,
        currentPage: page,
        totalPages,
        totalItems,
      };
    } catch (error) {
      throw error;
    }
  }

  async createUser(dataUser) {
    try {
      const { usuario } = dataUser;

      const userExists = await User.findOne({
        where: { usuario, estado: 1, },
      });

      if (userExists) { return false; }

      const user = await User.create(dataUser);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserDetail(idusuario, userId, userRol) {
    try {
      const user = await User.findOne({
        where: { idusuario, estado: 1 },
        attributes: { exclude: ["password"] },
      });

      if (!user) { throw new Error('Usuario no encontrado'); }

      if (userRol !== 1 && userId !== user.idusuario) {
        throw new Error('No tienes permisos para ver este perfil');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, dataUser, idUser, userRol) {
    try {
      const user = await User.findOne({
        where: { idusuario: userId, estado: 1 }
      });

      const { 
        usuario, 
        currentPassword, 
        newPassword,
        nombre,
        apellido,
        telefono,
        dni,
        correo,
        direccion,
        carrera,
        perfil,
        rol,
      } = dataUser;

      const name = usuario ? await User.findOne({ where: { usuario, estado: 1 } }) : null;
      const email = correo ? await User.findOne({ where: { correo, estado: 1 } }) : null;

      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      
      if (name && name.usuario !== user.usuario) {
        throw new Error('El nombre de usuario ya está en uso');
      }
      
      if (email && email.correo !== user.correo) {
        throw new Error('La dirección de correo electrónico ya está en uso');
      }
      
      if (userRol !== 1 && idUser !== user.idusuario) {
        throw new Error('No tienes permisos para editar este perfil');
      }

      const comprobarPass = await user.comprobarPassword(currentPassword);

      if (!comprobarPass) { return false; }

      if ((usuario && usuario !== user.usuario) || (correo && correo !== user.correo)) {
        user.usuario = usuario;
        user.correo = correo;
      }

      user.password = newPassword;
      user.nombre = nombre || user.nombre;
      user.apellido = apellido || user.apellido;
      user.telefono = telefono || user.telefono;
      user.dni = dni || user.dni;
      user.direccion = direccion || user.direccion;
      user.carrera = carrera || user.carrera;
      user.perfil = perfil || user.perfil;
      user.rol = rol || user.rol;

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async addUpdateImageUser(idusuario, newImage) {
    try {
      if (!newImage) { return false; }

      const user = await User.findOne({
        where: { idusuario, estado: 1 },
      });

      user.foto = newImage;

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteImageUser(idusuario) {
    try {
      const user = await User.findOne({
        where: { idusuario, estado: 1, },
      });

      if (!user) { return false; }

      const img = user.foto;

      user.foto = null;
      await user.save();
      return img;
    } catch (error) {
      throw error;
    }
  }

  async changeStatusUser(idusuario) {
    try {
      const user = await User.findOne({
        where: { idusuario, estado: 1 }
      });

      if (!user) { return false; }

      user.estado = 0;

      await user.save();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default usersRepository;
