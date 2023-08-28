class sessionsService {
    constructor(sessionsRepository) {
      this.sessionsRepository = sessionsRepository;
    }
  
    async getAllSessions(id, dataSearch) {
      try {
        const sessions = await this.sessionsRepository.getAllSessions(id, dataSearch);
        return sessions;
      } catch (error) {
        throw new Error("(SERVICE - getAllSessions) Error al obtener las sesiones: " + error.message);
      }
    }

    async getSessionDetail(id) {
      try {
        const session = await this.sessionsRepository.getSessionDetail(id);
        return session;
      } catch (error) {
        throw new Error("(SERVICE - getSessionDetail) Error al obtener la sesión: " + error.message);
      }
    }

    async createSession(dataSession, idcurso) {
      try {
        const session = await this.sessionsRepository.createSession(dataSession, idcurso);
        return session;
      } catch (error) {
        throw new Error("(SERVICE - createSession) Error al crear la sesión: " + error.message);
      }
    }
  }
  
  export default sessionsService;
  