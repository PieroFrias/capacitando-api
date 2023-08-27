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
        idcurso: course.idcurso,
        titulo: course.titulo,
        descripcion: course.descripcion,
        categoria: course.categorium.categoria,
        idcategoria: course.categorium.idcategoria,
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

  async getCourseDetail(id, rol) {
    try {
      const whereCondition = {
        ...getWhereConditionByRol(rol),
        idcurso: id,
      }
      
      const course = await Course.findOne({
        where: whereCondition,
        include: [
          { model: Category, },
          {
            model: CourseUser,
            include: [{ model: User, }],
          },
          {
            model: Session,
            include: [{ model: Content }]
          }
        ],
      });

      if (!course) { return false; }

      const isActiveSession = session => session.estado === 1;
      const isActiveContent = content => content.estado === 1;
      const isTeacher = instructor => instructor.user.estado === 1 && instructor.user.rol === 2;

      const courseData = {
        idcurso: course.idcurso,
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
          idsesion: session.idsesion,
          nombre_sesion: session.nombre_sesion,
          descripcion_sesion: session.descripcion,
          total_contenido: session.contenidos.filter(isActiveContent).length,
          contenido: session.contenidos
          .filter(isActiveContent)
          .map((content) => ({
            idcontenido: content.idcontenido,
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
}

function getWhereConditionByRol(rol) {
  let whereCondition = {};

  if (rol == 2 || rol == 3 || rol == null) {
    whereCondition.estado = 1;
  }

  return whereCondition;
}

export default coursesRepository;
