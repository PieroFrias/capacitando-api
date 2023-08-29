class usersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async authenticateUser(username, password) {
    try {
      return await this.usersRepository.authenticateUser(username, password);
    } catch (error) {
      throw new Error("(SERVICE - authenticateUser) Error al autenticar el usuario: " + error.message);
    }
  }

  async getAllUsersAdmin(dataFilter) {
    try {
      return await this.usersRepository.getAllUsersAdmin(dataFilter);
    } catch (error) {
      throw new Error("(SERVICE - getAllUsersAdmin) Error al obtener los usuarios: " + error.message);
    }
  }

  async getAllUsersAdminPaginated(dataFilter, page, pageSize) {
    try {
      return await this.usersRepository.getAllUsersAdminPaginated(dataFilter, page, pageSize);
    } catch (error) {
      throw new Error("(SERVICE - getAllUsersAdminPaginated) Error al obtener los usuarios: " + error.message);
    }
  }

  async getUserDetail(id, userId, userRol) {
    try {
      return await this.usersRepository.getUserDetail(id, userId, userRol);
    } catch (error) {
      console.error("(SERVICE - getUserDetail) Error al obtener el usuario");
      throw error;
    }
  }

  async createUser(dataUser) {
    try {
      return await this.usersRepository.createUser(dataUser);
    } catch (error) {
      throw new Error("(SERVICE - createUser) Error al crear el usuario: " + error.message);
    }
  }

  async updateUser(userId, dataUser, idUser, userRol) {
    try {
      return await this.usersRepository.updateUser(userId, dataUser, idUser, userRol);
    } catch (error) {
      console.error("(SERVICE - updateUser) Error al actualizar el usuario");
      throw error; 
    }
  }

  async addUpdateImageUser(id, newImage) {
    try {
      return await this.usersRepository.addUpdateImageUser(id, newImage);
    } catch (error) {
      throw new Error("(SERVICE - addUpdateImageUser) Error al actualizar la imagen del usuario: " + error.message);
    }
  }

  async deleteImageUser(id) {
    try {
      return await this.usersRepository.deleteImageUser(id);
    } catch (error) {
      throw new Error("(SERVICE - deleteImageUser) Error al eliminar la imagen del usuario: " + error.message);
    }
  }

  async changeStatusUser(id) {
    try {
      return await this.usersRepository.changeStatusUser(id);
    } catch (error) {
      throw new Error("(SERVICE - changeStatusUser) Error al cambiar el estado del usuario: " + error.message);
    }
  }
}

export default usersService;
