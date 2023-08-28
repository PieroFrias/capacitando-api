import SessionsRepository from "../../domain/repositories/sessionsRepository.js";
import SessionsService from "../../application/services/sessionsService.js";
import connection from "../../infraestructure/config/db.js";

const sessionsRepository = new SessionsRepository(connection);
const sessionsService = new SessionsService(sessionsRepository);

const getAllSessions = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...dataSearch } = req.body;

    const sessions = await sessionsService.getAllSessions(id, dataSearch);

    if (!sessions || sessions.length <= 0) {
      res.status(404).json({ error: "No se encontraron sesiones" });
    } else {
      res.json(sessions);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - getAllSessions)" });
  }
};

const getSessionDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await sessionsService.getSessionDetail(id);
    
    if (!session) {
      res.status(404).json({ error: "No se encontró la sesión" });
    } else {
      res.json(session);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - getSessionDetail)" });
  }
}

const createSession = async (req, res) => {
  try {
    const { idcurso } = req.params;
    const dataSession = req.body;
    const session = await sessionsService.createSession(dataSession, idcurso);
    
    if (!session) {
      res.status(400).json({ error: "La sesión ya fue registrada" });
    } else {
      res.json({ message: "Sesión registrada exitosamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - createSession)" });
  }
}

export {
  getAllSessions,
  getSessionDetail,
  createSession,
};
