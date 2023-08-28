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

  async getAllUsersAdmin(dataFilter, page, pageSize) {
    try {
      return await this.usersRepository.getAllUsersAdmin(dataFilter, page, pageSize);
    } catch (error) {
      throw new Error("(SERVICE - getAllUsersAdmin) Error al obtener los usuarios: " + error.message);
    }
  }

  async createUser(dataUser) {
    try {
      return await this.usersRepository.createUser(dataUser);
    } catch (error) {
      throw new Error("(SERVICE - createUser) Error al crear el usuario: " + error.message);
    }
  }
}

export default usersService;
