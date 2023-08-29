import multer from "multer";
import path from "path";
import CoursesRepository from "../../domain/repositories/coursesRepository.js";
import CoursesService from "../../application/services/coursesService.js";
import deleteImage from "../../utils/deleteImage.js";
import connection from "../../infraestructure/config/db.js";

const coursesRepository = new CoursesRepository(connection);
const coursesService = new CoursesService(coursesRepository);

const getAllCourses = async (req, res) => {
  try {
    const { ...dataFilter } = req.body;
    const rol = req.user ? req.user.rol : null;
    const userId = req.user ? req.user.idusuario : null;
    const courses = await coursesService.getAllCourses(dataFilter, rol, userId);

    if (!courses || courses.length <= 0) {
      res.status(404).json({ error: "No se encontraron cursos" });
    } else {
      res.json(courses);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - getAllCourses)" });
  }
};

const getAllCoursesPaginated = async (req, res) => {
  try {
    const { page, pageSize, ...dataFilter } = req.body;
    const rol = req.user ? req.user.rol : null;
    const userId = req.user ? req.user.idusuario : null;

    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 9;

    const courses = await coursesService.getAllCoursesPaginated(dataFilter, pageNumber, limit, rol, userId);

    if (!courses || courses.coursesData.length <= 0) {
      res.status(404).json({ error: "No se encontraron cursos" });
    } else {
      res.json(courses);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - getAllCoursesPaginated)" });
  }
};

const getCourseDetail = async (req, res) => {
  try {
    const rol = req.user ? req.user.rol : null;
    const userId = req.user ? req.user.idusuario : null;
    const { id } = req.params;
    const course = await coursesService.getCourseDetail(id, rol, userId)

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

const createCourse = async (req, res) => {
  try {
    const dataCourse = req.body;
    const newCourse = await coursesService.createCourse(dataCourse);

    if (!newCourse) {
      res.status(400).json({ error: "El curso ya está registrado" });
    } else {
      res.json({ message: "Curso registrado exitosamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - createCourse)" });
  }
};

const addCourseUser = async (req, res) => {
  try {
    const { idcurso, idusuario } = req.body;
    const course = await coursesService.addCourseUser(idcurso, idusuario);

    if (course) {
      res.json({ message: "Usuario asignado al curso exitosamente" });
    } else {
      res.status(404).json({ error: "No se pudo asignar el usuario al curso" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en servidor (controller - addCourseUser)" });
  }
}

const deleteCourseUser = async (req, res) => {
  try {
    const { idcurso, idusuario } = req.body;
    const course = await coursesService.deleteCourseUser(idcurso, idusuario);

    if (course) {
      res.json({ message: "Usuario eliminado del curso exitosamente" });
    } else {
      res.status(404).json({ error: "No se pudo eliminar el usuario del curso" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en servidor (controller - deleteCourseUser)" });
  }
}

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const dataCourse = req.body;
    const course = await coursesService.updateCourse(id, dataCourse);

    if (course) {
      res.json({ message: "Curso actualizado exitosamente" });
    } else {
      res.status(404).json({ error: "Curso no encontrado o nombre de curso repetido" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en servidor (controller - updateCourse)" });
  }
};

const changeStatusCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await coursesService.changeStatusCourse(id);

    if (course) {
      res.json({ message: "Curso deshabilitado exitosamente" });
    } else {
      res.status(404).json({ error: "Curso no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - changeStatusCourse)" });
  }
};

const addUpdateImageCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const newImage = req.file ? req.file.filename : null;
    const imageCourse = await coursesService.addUpdateImageCourse(id, newImage);

    if (imageCourse) {
      res.json({ message: "Imágen cargada exitosamente" });
    } else {
      res.status(404).json({ error: "No se pudo cargar la imágen" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - addUpdateImageCourse)" });
  }
};

const deleteImageCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const img = await coursesService.deleteImageCourse(id);

    if (img) {
      const imgRoute = `src/infraestructure/storage/local/images/cursos/${img}`;
      deleteImage(imgRoute);

      res.json({ message: "Imagen eliminada correctamente" });
    } else {
      res.status(404).json({ error: "Imagen asociada no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor (controller - deleteImageCourse)" });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/infraestructure/storage/local/images/cursos");
  },

  filename: async (req, file, cb) => {
    try {
      const { id } = req.params;
      const course = await coursesService.getCourseDetail(id);
      const courseName = course.titulo.toLowerCase().replace(/\s/g, "_");
      const extention = path.extname(file.originalname);
      const imgName = `${courseName}${extention}`;

      cb(null, imgName);
    } catch (error) {
      const err = new Error("Ups, algo salió mal al guardar la imagen");
      err.status = 400;
      return cb(err);
    }
  },
});

const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const extPermitidas = [".png", ".jpg", ".jpeg"];
    const ext = path.extname(file.originalname);

    if (!extPermitidas.includes(ext)) {
      const error = new Error("Formato de imagen no válido. Se permiten solo archivos .png, .jpg o .jpeg.");
      error.status = 400;
      return cb(error);
    }

    cb(null, true);
  },
});

export {
  getAllCourses,
  getAllCoursesPaginated,
  getCourseDetail,
  createCourse,
  addCourseUser,
  deleteCourseUser,
  updateCourse,
  changeStatusCourse,
  addUpdateImageCourse,
  deleteImageCourse,
  uploadImage,
};
