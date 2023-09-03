import { Op } from "sequelize";
import Session from "../../infraestructure/models/sessionModel.js";
import Course from "../../infraestructure/models/courseModel.js";
import CourseUser from "../../infraestructure/models/courseUserModel.js";
import Content from "../../infraestructure/models/contentModel.js";

class sessionsRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async getAllSessions(id_curso, dataSearch, userId, rol) {
    try {
      if (rol !== 1) {
        const isUserAssignedToCourse = await CourseUser.findOne({
          where: { idcurso: id_curso, idusuario: userId },
        });
  
        if (!isUserAssignedToCourse) { return false; }
      }

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
        include: [{
          model: Course,
          where: { estado: 1 }
        }],
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

  async getSessionDetail(idsesion, userId, rol) {
    try {
      const session = await Session.findOne({
        where: { estado: 1, idsesion, },
        include: [
          {
            model: Course,
            where: { estado: 1 },
          },
          { model: Content }
        ],
      });

      if (!session) { return false; }

      if (rol !== 1) {
        const isUserAssignedToCourse = await CourseUser.findOne({
          where: { idcurso: session.idcurso, idusuario: userId },
        });
  
        if (!isUserAssignedToCourse) { return false; }
      }

      const sessionData = {
        idsesion: parseInt(session.idsesion),
        nombre_sesion: session.nombre_sesion,
        descripcion: session.descripcion,
        curso: session.curso.titulo,
        idcurso: parseInt(session.idcurso),

        contenidos: session.contenidos
        .filter((content) => content.estado == 1)
        .map((content) => ({
          idcontenido: parseInt(content.idcontenido),
          titulo: content.titulo,
          descripcion: content.descripcion,
          estado: content.estado,
        })),

        estado: session.estado,
      };

      return sessionData;
    } catch (error) {
      throw error;
    }
  }

  async createSession(dataSession, userId) {
    try {
      const { nombre_sesion, idcurso } = dataSession;

      const isUserAssignedToCourse = await CourseUser.findOne({
        where: { idcurso, idusuario: userId },
      });

      const sessionExists = await Session.findOne({
        where: { nombre_sesion, idcurso, estado: 1 },
      });

      if (!isUserAssignedToCourse || sessionExists) { return false; }

      const session = await Session.create(dataSession);
      return session;
    } catch (error) {
      throw error;
    }
  }

  async updateSession(idsesion, dataSession, userId) {
    try {
      const session = await Session.findOne({
        where: { idsesion, estado: 1 },
      });

      const isUserAssignedToCourse = await CourseUser.findOne({
        where: { idcurso: session.idcurso, idusuario: userId },
      });

      if (!isUserAssignedToCourse) { return false; }

      const { nombre_sesion, descripcion, } = dataSession;

      const sessionName = nombre_sesion ? await Session.findOne({ where: { nombre_sesion, estado: 1 } }) : null;

      if (!session || (sessionName && sessionName.nombre_sesion !== session.nombre_sesion)) {
        return false;
      }

      if (nombre_sesion && nombre_sesion !== session.nombre_sesion) {
        session.nombre_sesion = nombre_sesion;
      }
      session.descripcion = descripcion;

      await session.save();
      return session;
    } catch (error) {
      throw error;
    }
  }

  async changeStatusSession(idsesion, userId) {
    try {
      const session = await Session.findOne({
        where: { idsesion, estado: 1 },
        include: [
          { model: Content },
          { 
            model: Course,
            where:{ estado: 1 } 
          }
        ],
      });

      if (!session) { return false; }

      const isUserAssignedToCourse = await CourseUser.findOne({
        where: { idcurso: session.idcurso, idusuario: userId },
      });

      if (!isUserAssignedToCourse) { return false; }

      session.estado = 0;
      await session.save();
      
      for (const content of session.contenidos) {
        content.estado = 0;
        await content.save();
      }

      const course = await Course.findOne({
        where: { idcurso: session.idcurso },
      });

      course.total_clases -= session.contenidos.length;
      course.hora_duracion = ((course.hora_duracion * 60) - session.contenidos.reduce((sum, content) => sum + content.minutos_video, 0)) / 60;
  
      await course.save();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default sessionsRepository;
