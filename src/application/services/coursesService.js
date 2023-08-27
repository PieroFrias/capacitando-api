class coursesService {
  constructor(coursesRepository) {
    this.coursesRepository = coursesRepository;
  }

  async getAllCourses(dataFilter, page, pageSize, rol) {
    try {
      const courses = await this.coursesRepository.getAllCourses(dataFilter, page, pageSize, rol);
      return courses;
    } catch (error) {
      throw new Error("(SERVICE - getAllCoursesAdmin) Error al obtener los cursos: " + error.message);
    }
  }

  async getCourseDetail(id) {
    try {
      const course = await this.coursesRepository.getCourseDetail(id);
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
