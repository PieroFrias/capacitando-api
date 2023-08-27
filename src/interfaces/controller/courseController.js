import CoursesRepository from "../../domain/repositories/coursesRepository.js";
import CoursesService from "../../application/services/coursesService.js";
import connection from "../../infraestructure/config/db.js";

const coursesRepository = new CoursesRepository(connection);
const coursesService = new CoursesService(coursesRepository);

const getAllCourses = async (req, res) => {
  try {
    const { page, pageSize, ...dataFilter } = req.body;
    const rol = req.user ? req.user.rol : null;

    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 9;

    const courses = await coursesService.getAllCourses(dataFilter, pageNumber, limit, rol);

    if (!courses || courses.coursesData.length <= 0) {
      res.status(404).json({ error: "No se encontraron cursos" });
    } else {
      res.json(courses);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - getAllCourses)" });
  }
};

const getCourseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = req.user ? req.user.rol : null;
    const course = await coursesService.getCourseDetail(id, rol);

    if (!course) {
      res.status(404).json({ error: "No se encontró el curso" });
    } else {
      res.json(course);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - getCourseDetail)" });
  }
};

export {
  getAllCourses,
  getCourseDetail,
};
