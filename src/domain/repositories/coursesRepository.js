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

  async getAllCourses(dataFilter, rol, userId) {
    try {
      const { search, categoryId } = dataFilter;
      const categoryFilter = categoryId ? { idcategoria: categoryId } : {};

      let whereCondition = {};

      if (rol == 1) {
        whereCondition = {
          ...categoryFilter,
        };

        if (search) {
          whereCondition[Op.or] = [
            { titulo: { [Op.like]: `%${search}%` } },
            { descripcion: { [Op.like]: `%${search}%` } },
          ];
        }
      } else if (rol == 2 || rol == 3) {
        const userCourses = await CourseUser.findAll({
          where: { idusuario: userId },
        });

        const courseIds = userCourses.map((userCourse) => userCourse.idcurso);

        whereCondition = {
          estado: 1,
          idcurso: courseIds,
          ...categoryFilter,
        };

        if (search) {
          whereCondition[Op.or] = [
            { titulo: { [Op.like]: `%${search}%` } },
            { descripcion: { [Op.like]: `%${search}%` } },
          ];
        }
      }

      const courses = await Course.findAll({
        where: whereCondition,
        include: [{
          model: Category,
          where: categoryFilter,
        }],
        order: [["updated_at", "DESC"]],
        distinct: true,
      });

      if (courses.length <= 0) { return false; }

      const coursesData = courses.map((course) => ({
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

      return coursesData;
    } catch (error) {
      throw error;
    }
  }

  async getAllCoursesPaginated(dataFilter, page, pageSize, rol, userId) {
    try {
      const offset = (page - 1) * pageSize;

      const { search, categoryId } = dataFilter;
      const categoryFilter = categoryId ? { idcategoria: categoryId } : {};

      let whereCondition = {};

      if (rol == 1) {
        whereCondition = {
          ...categoryFilter,
        };

        if (search) {
          whereCondition[Op.or] = [
            { titulo: { [Op.like]: `%${search}%` } },
            { descripcion: { [Op.like]: `%${search}%` } },
          ];
        }
      } else if (rol == 2 || rol == 3) {
        const userCourses = await CourseUser.findAll({
          where: { idusuario: userId },
        });

        const courseIds = userCourses.map((userCourse) => userCourse.idcurso);

        whereCondition = {
          estado: 1,
          idcurso: courseIds,
          ...categoryFilter,
        };

        if (search) {
          whereCondition[Op.or] = [
            { titulo: { [Op.like]: `%${search}%` } },
            { descripcion: { [Op.like]: `%${search}%` } },
          ];
        }
      }

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

  async getCourseDetail(id, rol, userId) {
    try {
      let whereCondition = {};
  
      if (rol == 1) {
        whereCondition = { idcurso: id };
      }
      else if (rol == 2 || rol == 3) {
        const userCourses = await CourseUser.findAll({
          where: { idusuario: userId },
        });
  
        const courseIds = userCourses.map((userCourse) => userCourse.idcurso);
  
        if (!courseIds.includes(id)) { return false; }

        whereCondition = { estado: 1, idcurso: courseIds, };
      }

      const course = await Course.findOne({
        where: whereCondition,
        include: [
          { model: Category, },
          {
            model: CourseUser,
            include: [{ model: User, where: { estado: 1 } }],
          },
          { model: Session, include: [{ model: Content }] }
        ],
      });

      if (!course) { return false; }

      const isActiveSession = session => session.estado == 1;
      const isActiveContent = content => content.estado == 1;
      const isTeacher = instructor => instructor.user.rol == 2;
      const isStudent = student => student.user.rol == 3;

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

        estudiantes: course.curso_usuarios
          .filter(isStudent)
          .map((student) => ({
            id_estudiante: parseInt(student.user.idusuario),
            estudiante: `${student.user.nombre} ${student.user.apellido}`,
            telefono: student.user.telefono,
            dni: student.user.dni,
            correo: student.user.correo,
            direccion: student.user.direccion,
            carrera: student.user.carrera,
            foto: student.user.foto
              ? `${process.env.DOMAIN}/${process.env.DATA}/usuarios/${student.user.foto}`
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

  async addCourseUser(idcurso, idusuario) {
    try {
      const course = await Course.findOne({
        where: { idcurso, estado: 1 },
      });

      const user = await User.findOne({
        where: { idusuario, estado: 1 },
      });

      if (!course || !user) { return false; }

      const courseUser = await CourseUser.findOne({
        where: { idcurso, idusuario },
      });

      if (courseUser) { return false; }

      await CourseUser.create({ idcurso, idusuario });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async deleteCourseUser(idcurso, idusuario) {
    try {
      const course = await Course.findOne({
        where: { idcurso, estado: 1 },
      });

      const user = await User.findOne({
        where: { idusuario, estado: 1 },
      });

      if (!course || !user) { return false; }

      const courseUser = await CourseUser.findOne({
        where: { idcurso, idusuario },
      });

      if (!courseUser) { return false; }

      await courseUser.destroy();
      return true;
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

  async changeStatusCourse(idcurso, estado) {
    try {
      const course = await Course.findOne({
        where: { idcurso },
      });

      if (!course) { return false; }

      course.estado = estado;
      await course.save();
      
      return course;
    } catch (error) {
      throw error;
    }
  }
}

export default coursesRepository;
