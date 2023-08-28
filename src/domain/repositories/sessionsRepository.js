import { Op } from "sequelize";
import Session from "../../infraestructure/models/sessionModel.js";
import Course from "../../infraestructure/models/courseModel.js";

class sessionsRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async getAllSessions(id_curso, dataSearch) {
    try {
      let whereCondition = { estado: 1, idcurso: id_curso, };

      const { search } = dataSearch;
      if (search) {
        whereCondition[Op.or] = [
          { nombre_sesion: { [Op.like]: `%${search}%` } },
          { descripcion: { [Op.like]: `%${search}%` } },
        ];
      };

      const sessions = await Session.findAll({
        where: whereCondition,
        include: [Course],
        order: [["idsesion", "DESC"]],
        distinct: true,
      });

      if (sessions.length <= 0) { return false; }

      const sessionsData = sessions.map((session) => ({
        idsesion: parseInt(session.idsesion),
        nombre_sesion: session.nombre_sesion,
        descripcion: session.descripcion,
        curso: session.curso.titulo,
        idcurso: parseInt(session.idcurso),
        estado: session.estado,
      }));

      return sessionsData;
    } catch (error) {
      throw error;
    }
  }

  async getSessionDetail(id) {
    try {      
      const session = await Session.findOne({
        where: { estado: 1, idsesion: id, },
        include: [Course],
      });

      if (!session) { return false; }

      const sessionData = {
        idsesion: parseInt(session.idsesion),
        nombre_sesion: session.nombre_sesion,
        descripcion: session.descripcion,
        curso: session.curso.titulo,
        idcurso: parseInt(session.idcurso),
        estado: session.estado,
      };

      return sessionData;
    } catch (error) {
      throw error;
    }
  }

  async createSession(dataSession, idcurso) {
    try {
      const { nombre_sesion } = dataSession;
      const sessionExists = await Session.findOne({
        where: { nombre_sesion, estado: 1 },
      });

      if (sessionExists) { return false; }

      const session = await Session.create(dataSession);
      return session;
    } catch (error) {
      throw error;
    }
  }

  async updateSession(idcurso, dataSession) {
    try {
      const session = await Session.findOne({
        where: { idcurso, estado: 1 },
      });

      const {
        titulo,
        url_video_intro,
        hora_duracion,
        total_clases,
        descripcion,
        idcurso,
      } = dataSession;

      const sessionTitle = titulo ? await Session.findOne({ where: { titulo, estado: 1 } }) : null;

      if (!session || (sessionTitle && sessionTitle.titulo !== session.titulo)) {
        return false;
      }

      if (titulo && titulo !== session.titulo) {
        session.titulo = titulo;
      }
      session.url_video_intro = url_video_intro;
      session.hora_duracion = hora_duracion;
      session.total_clases = total_clases;
      session.descripcion = descripcion;
      session.idcurso = idcurso;

      await session.save();
      return session;
    } catch (error) {
      throw error;
    }
  }

  async changeStatusSession(idcurso) {
    try {
      const session = await Session.findOne({
        where: { idcurso, estado: 1 },
      });

      if (!session) { return false; }

      session.estado = 0;

      await session.save();
      return session;
    } catch (error) {
      throw error;
    }
  }
}

export default sessionsRepository;
