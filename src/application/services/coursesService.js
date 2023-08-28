class coursesService {
  constructor(coursesRepository) {
    this.coursesRepository = coursesRepository;
  }

  async getAllCourses(dataFilter, page, pageSize, rol, userId) {
    try {
      const courses = await this.coursesRepository.getAllCourses(dataFilter, page, pageSize, rol, userId);
      return courses;
    } catch (error) {
      throw new Error("(SERVICE - getAllCoursesAdmin) Error al obtener los cursos: " + error.message);
    }
  }

  async getCourseDetail(id, rol, userId) {
    try {
      const course = await this.coursesRepository.getCourseDetail(id, rol, userId);
      return course;
    } catch (error) {
      throw new Error("(SERVICE - getCourseDetail) Error al obtener el curso: " + error.message);
    }
  }

  async createCourse(dataCourse) {
    try {
      const course = await this.coursesRepository.createCourse(dataCourse);
      return course;
    } catch (error) {
      throw new Error("(SERVICE - createCourse) Error al crear el curso: " + error.message);
    }
  }

  async addCourseUser(idcurso, idusuario) {
    try {
      const course = await this.coursesRepository.addCourseUser(idcurso, idusuario);
      return course;
    } catch (error) {
      throw new Error("(SERVICE - addCourseUser) Error al asignar al usuario al curso: " + error.message);
    }
  }

  async deleteCourseUser(idcurso, idusuario) {
    try {
      const course = await this.coursesRepository.deleteCourseUser(idcurso, idusuario);
      return course;
    } catch (error) {
      throw new Error("(SERVICE - deleteCourseUser) Error al eliminar al usuario del curso: " + error.message);
    }
  }

  async updateCourse(id, dataCourse) {
    try {
      const course = await this.coursesRepository.updateCourse(id, dataCourse);
      return course;
    } catch (error) {
      throw new Error("(SERVICE - updateCourse) Error al actualizar el curso: " + error.message);
    }
  }

  async addUpdateImageCourse(id, newImage) {
    try {
      const course = await this.coursesRepository.addUpdateImageCourse(id, newImage);
      return course;
    } catch (error) {
      throw new Error("(SERVICE - addUpdateImageCourse) Error al cargar la imagen del curso: " + error.message);
    }
  }

  async deleteImageCourse(id) {
    try {
      const img = await this.coursesRepository.deleteImageCourse(id);
      return img;
    } catch (error) {
      throw new Error("(SERVICE - deleteImageCourse) Error al eliminar la imagen del curso: " + error.message);
    }
  }

  async changeStatusCourse(id) {
    try {
      const course = await this.coursesRepository.changeStatusCourse(id);
      return course;
    } catch (error) {
      throw new Error("(SERVICE - changeStatusCourse) Error al cambiar el estado del curso: " + error.message);
    }
  }
}

export default coursesService;
