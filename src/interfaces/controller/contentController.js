import SessionsRepository from "../../domain/repositories/sessionsRepository.js";
import SessionsService from "../../application/services/sessionsService.js";
import connection from "../../infraestructure/config/db.js";

const sessionsRepository = new SessionsRepository(connection);
const sessionsService = new SessionsService(sessionsRepository);

const getAllSessions = async (req, res) => {
  try {
    const rol = req.user ? req.user.rol : null;
    const userId = req.user ? req.user.idusuario : null;
    const { id } = req.params;
    const { ...dataSearch } = req.body;

    const sessions = await sessionsService.getAllSessions(id, dataSearch, userId, rol);

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
    const rol = req.user ? req.user.rol : null;
    const userId = req.user ? req.user.idusuario : null;
    const { id } = req.params;
    const session = await sessionsService.getSessionDetail(id, userId, rol);
    
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
    const userId = req.user ? req.user.idusuario : null;
    const dataSession = req.body;
    const session = await sessionsService.createSession(dataSession, userId);
    
    if (!session) {
      res.status(400).json({ error: "No se pudo registrar, verifica si la sesión ya existe o si usted está asignado al curso." });
    } else {
      res.json({ message: "Sesión registrada exitosamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - createSession)" });
  }
}

const updateSession = async (req, res) => {
  try {
    const userId = req.user ? req.user.idusuario : null;
    const { id } = req.params;
    const dataSession = req.body;
    const session = await sessionsService.updateSession(id, dataSession, userId);
    
    if (!session) {
      res.status(400).json({ error: "No se pudo actualizar, verifica si la sesión ya existe o si usted está asignado al curso." });
    } else {
      res.json({ message: "Sesión actualizada exitosamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - updateSession)" });
  }
}

const changeStatusSession = async (req, res) => {
  try {
    const userId = req.user ? req.user.idusuario : null;
    const { id } = req.params;
    const session = await sessionsService.changeStatusSession(id, userId);
    
    if (!session) {
      res.status(400).json({ error: "No se pudo deshabilitar la sesión, verifica si la sesión existe o si usted está asignado al curso." });
    } else {
      res.json({ message: "Sesión deshabilitada exitosamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - changeStatusSession)" });
  }
}

export {
  getAllSessions,
  getSessionDetail,
  createSession,
  updateSession,
  changeStatusSession,
};
