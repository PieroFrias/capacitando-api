import { Op } from "sequelize";
import Course from "../../infraestructure/models/courseModel.js";
import Category from "../../infraestructure/models/categoryModel.js";
import Session from "../../infraestructure/models/sessionModel.js";
import Content from "../../infraestructure/models/contentModel.js";
import CourseUser from "../../infraestructure/models/courseUserModel.js";
import User from "../../infraestructure/models/userModel.js";

class coursesRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async getAllCourses(dataFilter, page, pageSize, rol) {
    try {
      const offset = (page - 1) * pageSize;

      const { search, categoryId } = dataFilter;

      const categoryFilter = categoryId ? { idcategoria: categoryId } : {}; 

      let filterConditions = [getWhereConditionByRol(rol)];
      if (search) {
        filterConditions.push({
          [Op.or]: [
            { titulo: { [Op.like]: `%${search}%` } },
            { descripcion: { [Op.like]: `%${search}%` } },
          ],
        });
      };

      const whereCondition = { [Op.and]: filterConditions, };

      const courses = await Course.findAndCountAll({
        where: whereCondition,
        include: [{
          model: Category,
          where: categoryFilter,
        }],
        order: [["updated_at", "DESC"]],
        offset,
        limit: pageSize,
        distinct: true,
      });

      if (courses.count <= 0) { return false; }

      const coursesData = courses.rows.map((course) => ({
        idcurso: parseInt(course.idcurso),
        titulo: course.titulo,
        descripcion: course.descripcion,
        categoria: course.categorium.categoria,
        idcategoria: parseInt(course.categorium.idcategoria),
        url_video_intro: course.url_video_intro,
        estado: course.estado,
        hora_duracion: course.hora_duracion,
        total_clases: course.total_clases,

        url_portada: course.url_portada
          ? `${process.env.DOMAIN}/${process.env.DATA}/cursos/${course.url_portada}`
          : null,
      }));

      const totalItems = courses.count;
      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        coursesData,
        currentPage: page,
        totalPages,
        totalItems,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCourseDetail(id) {
    try {      
      const course = await Course.findOne({
        where: { estado: 1, idcurso: id, },
        include: [
          { model: Category, },
          {
            model: CourseUser,
            include: [{ model: User, where: { estado: 1 } }],
          },
          {
            model: Session,
            include: [{ model: Content }]
          }
        ],
      });

      if (!course) { return false; }

      const isActiveSession = session => session.estado == 1;
      const isActiveContent = content => content.estado == 1;
      const isTeacher = instructor => instructor.user.rol == 2;

      const courseData = {
        idcurso: parseInt(course.idcurso),
        titulo: course.titulo,
        descripcion: course.descripcion,
        categoria: course.categorium.categoria,
        idcategoria: course.categorium.idcategoria,
        url_video_intro: course.url_video_intro,
        estado: course.estado,
        hora_duracion: course.hora_duracion,
        total_clases: course.total_clases,
        
        sesiones: course.sesions
        .filter(isActiveSession)
        .map((session) => ({
          idsesion: parseInt(session.idsesion),
          nombre_sesion: session.nombre_sesion,
          descripcion_sesion: session.descripcion,
          total_contenido: session.contenidos.filter(isActiveContent).length,
          contenido: session.contenidos
          .filter(isActiveContent)
          .map((content) => ({
            idcontenido: parseInt(content.idcontenido),
            titulo: content.titulo,
            descripcion_contenido: content.descripcion,
            url_video: content.url_video,
            minutos: content.minutos_video,
          })),
        })),

        docentes: course.curso_usuarios
          .filter(isTeacher)
          .map((instructor) => ({
            id_docentes: parseInt(instructor.user.idusuario),
            docente: `${instructor.user.nombre} ${instructor.user.apellido}`,
            telefono: instructor.user.telefono,
            dni: instructor.user.dni,
            correo: instructor.user.correo,
            direccion: instructor.user.direccion,
            carrera: instructor.user.carrera,
            perfil: instructor.user.perfil,
            foto: instructor.user.foto
              ? `${process.env.DOMAIN}/${process.env.DATA}/usuarios/${instructor.user.foto}`
              : null,
          })),

        url_portada: course.url_portada
          ? `${process.env.DOMAIN}/${process.env.DATA}/cursos/${course.url_portada}`
          : null,
      };

      return courseData;
    } catch (error) {
      throw error;
    }
  }

  async createCourse(dataCourse) {
    try {
      const { titulo } = dataCourse;
      const courseExists = await Course.findOne({
        where: { titulo, estado: 1 },
      });

      if (courseExists) { return false; }

      const course = await Course.create(dataCourse);
      return course;
    } catch (error) {
      throw error;
    }
  }

  async updateCourse(idcurso, dataCourse) {
    try {
      const course = await Course.findOne({
        where: { idcurso, estado: 1 },
      });

      const {
        titulo,
        url_video_intro,
        hora_duracion,
        total_clases,
        descripcion,
        idcategoria,
      } = dataCourse;

      const courseTitle = titulo ? await Course.findOne({ where: { titulo, estado: 1 } }) : null;

      if (!course || (courseTitle && courseTitle.titulo !== course.titulo)) {
        return false;
      }

      if (titulo && titulo !== course.titulo) {
        course.titulo = titulo;
      }
      course.url_video_intro = url_video_intro;
      course.hora_duracion = hora_duracion;
      course.total_clases = total_clases;
      course.descripcion = descripcion;
      course.idcategoria = idcategoria;

      await course.save();
      return course;
    } catch (error) {
      throw error;
    }
  }

  async addUpdateImageCourse(idcurso, newImage) {
    try {
      if (!newImage) { return false; }

      const course = await Course.findOne({
        where: { idcurso, estado: 1 },
      });

      course.url_portada = newImage;

      await course.save();
      return course;
    } catch (error) {
      throw error;
    }
  }

  async deleteImageCourse(idcurso) {
    try {
      const course = await Course.findOne({
        where: { idcurso, estado: 1, },
      });

      if (!course) { return false; }

      const img = course.url_portada;

      course.url_portada = null;
      await course.save();
      return img;
    } catch (error) {
      throw error;
    }
  }

  async changeStatusCourse(idcurso) {
    try {
      const course = await Course.findOne({
        where: { idcurso, estado: 1 },
      });

      if (!course) { return false; }

      course.estado = 0;

      await course.save();
      return course;
    } catch (error) {
      throw error;
    }
  }
}

function getWhereConditionByRol(rol) {
  let whereCondition = {};

  if (rol == 2 || rol == 3 || rol == null) {
    whereCondition.estado = 1;
  }

  return whereCondition;
}

export default coursesRepository;
