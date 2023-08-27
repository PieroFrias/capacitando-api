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

  async getCourseDetail(id, rol) {
    try {
      const course = await this.coursesRepository.getCourseDetail(id, rol);
      return course;
    } catch (error) {
      throw new Error("(SERVICE - getCourseDetail) Error al obtener el curso: " + error.message);
    }
  }
}

export default coursesService;
