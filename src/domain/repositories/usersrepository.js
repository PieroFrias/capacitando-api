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

  async getAllUsersAdmin(dataFilter, page, pageSize) {
    try {
      const offset = (page - 1) * pageSize;

      const { search, rol } = dataFilter;
      const rolFilter = rol ? { rol: rol } : {}; 

      let whereCondition = {};
      whereCondition = {
        estado: 1,
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

  async updateUser(userId, dataUser, idUser) {
    try {
      const user = await User.findOne({
        where: { idusuario: userId, estado: 1 }
      });

      const { usuario, currentPassword, newPassword } = dataUser;
      const name = usuario ? await User.findOne({ where: { usuario, estado: 1 } }) : null;

      if (!user || (name && name.id_usuario !== user.id_usuario) || idUser !== user.id_usuario) { 
        return false; 
      }

      const comprobarPass = await user.comprobarPassword(currentPassword);

      if (!comprobarPass) { return false; }

      user.usuario = usuario || user.usuario;
      user.password = newPassword;

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findOne({
        where: { id_usuario: userId, estado: 1 }
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
