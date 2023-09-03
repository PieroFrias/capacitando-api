import { Op } from "sequelize";
import Content from "../../infraestructure/models/contentModel.js";
import Session from "../../infraestructure/models/sessionModel.js";
import Course from "../../infraestructure/models/courseModel.js";

class contentsRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async getAllContents(idsesion, dataSearch) {
    try {
      let whereCondition = { estado: 1, idsesion: idsesion, };

      const { search } = dataSearch;
      if (search) {
        whereCondition[Op.or] = [
          { titulo: { [Op.like]: `%${search}%` } },
          { descripcion: { [Op.like]: `%${search}%` } },
        ];
      };

      const contents = await Content.findAll({
        where: whereCondition,
        include: [Session],
        order: [["idcontenido", "DESC"]],
      });

      if (contents.length <= 0) { return false; }

      const contentsData = contents.map((content) => ({
        idcontenido: parseInt(content.idcontenido),
        titulo: content.titulo,
        sesion: content.sesion.nombre_sesion,
        idsesion: parseInt(content.sesion.idsesion),
        url_video: content.url_video,
        minutos_video: content.minutos_video,
        estado: content.estado,
      }));

      return contentsData;
    } catch (error) {
      throw error;
    }
  }

  async getContentDetail(idcontenido) {
    try {
      const content = await Content.findOne({
        where: { estado: 1, idcontenido, },
        include: [Session],
      });

      if (!content) { return false; }

      const contentData = {
        idcontenido: parseInt(content.idcontenido),
        titulo: content.titulo,
        sesion: content.sesion.sesion,
        idsesion: parseInt(content.sesion.idsesion),
        url_video: content.url_video,
        minutos_video: content.minutos_video,
        estado: content.estado,
      };

      return contentData;
    } catch (error) {
      throw error;
    }
  }

  async createContent(dataContent) {
    try {
      const { titulo, idsesion } = dataContent;

      const contentExists = await Content.findOne({
        where: { titulo, idsesion, estado: 1 },
      });

      if (contentExists) { return false; }

      const content = await Content.create(dataContent);

      const session = await Session.findOne({
        where: { idsesion: content.idsesion },
      });

      const course = await Course.findOne({
        where: { idcurso: session.idcurso },
      });

      course.total_clases = course.total_clases + 1; 
      course.hora_duracion = ((course.hora_duracion * 60) + content.minutos_video) / 60;
      await course.save();

      return content;
    } catch (error) {
      throw error;
    }
  }

  async updateContent(idcontenido, dataContent) {
    try {
      const content = await Content.findOne({
        where: { idcontenido, estado: 1 },
      });

      const current_min_video = content.minutos_video;

      const { 
        titulo, 
        url_video,
        minutos_video,
      } = dataContent;

      const contentTitle = titulo ? await Content.findOne({ where: { titulo, estado: 1 } }) : null;

      if (!content || (contentTitle && contentTitle.titulo !== content.titulo)) {
        return false;
      }

      if (titulo && titulo !== content.titulo) {
        content.titulo = titulo;
      }
      content.url_video = url_video;
      content.minutos_video = minutos_video;
      await content.save();

      const session = await Session.findOne({
        where: { idsesion: content.idsesion },
      });

      const course = await Course.findOne({
        where: { idcurso: session.idcurso },
      });

      if (current_min_video > minutos_video) {
        course.hora_duracion = ((course.hora_duracion * 60) - (current_min_video - minutos_video)) / 60;
      } else if (current_min_video < minutos_video) {
        course.hora_duracion = ((course.hora_duracion * 60) + (minutos_video - current_min_video)) / 60;
      }

      await course.save();

      return content;
    } catch (error) {
      throw error;
    }
  }

  async changeStatusContent(idcontenido) {
    try {
      const content = await Content.findOne({
        where: { idcontenido, estado: 1 },
      });

      if (!content) { return false; }

      content.estado = 0;
      await content.save();

      const session = await Session.findOne({
        where: { idsesion: content.idsesion },
      });

      const course = await Course.findOne({
        where: { idcurso: session.idcurso },
      });

      course.total_clases = course.total_clases - 1;
      course.hora_duracion = ((course.hora_duracion * 60) - (content.minutos_video)) / 60;
      await course.save();

      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default contentsRepository;
