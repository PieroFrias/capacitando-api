class sessionsService {
    constructor(sessionsRepository) {
      this.sessionsRepository = sessionsRepository;
    }
  
    async getAllSessions(id, dataSearch, userId, rol) {
      try {
        const sessions = await this.sessionsRepository.getAllSessions(id, dataSearch, userId, rol);
        return sessions;
      } catch (error) {
        throw new Error("(SERVICE - getAllSessions) Error al obtener las sesiones: " + error.message);
      }
    }

    async getSessionDetail(id, userId, rol) {
      try {
        const session = await this.sessionsRepository.getSessionDetail(id, userId, rol);
        return session;
      } catch (error) {
        throw new Error("(SERVICE - getSessionDetail) Error al obtener la sesión: " + error.message);
      }
    }

    async createSession(dataSession, userId) {
      try {
        const session = await this.sessionsRepository.createSession(dataSession, userId);
        return session;
      } catch (error) {
        throw new Error("(SERVICE - createSession) Error al crear la sesión: " + error.message);
      }
    }

    async updateSession(idsesion, dataSession, userId) {
      try {
        const session = await this.sessionsRepository.updateSession(idsesion, dataSession, userId);
        return session;
      } catch (error) {
        throw new Error("(SERVICE - updateSession) Error al actualizar la sesión: " + error.message);
      }
    }

    async changeStatusSession(idsesion, userId) {
      try {
        const session = await this.sessionsRepository.changeStatusSession(idsesion, userId);
        return session;
      } catch (error) {
        throw new Error("(SERVICE - changeStatusSession) Error al deshabilitar de la sesión: " + error.message);
      }
    }
  }
  
  export default sessionsService;
  