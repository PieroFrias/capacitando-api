class contentsService {
  constructor(contentsRepository) {
    this.contentsRepository = contentsRepository;
  }

  async getAllContents(idsesion, dataSearch) {
    try {
      const contents = await this.contentsRepository.getAllContents(idsesion, dataSearch);
      return contents;
    } catch (error) {
      throw new Error("(SERVICE - getAllContents) Error al obtener el contenido: " + error.message);
    }
  }

  async getContentDetail(idcontenido) {
    try {
      const content = await this.contentsRepository.getContentDetail(idcontenido);
      return content;
    } catch (error) {
      throw new Error("(SERVICE - getContentDetail) Error al obtener el contenido: " + error.message);
    }
  }

  async createContent(dataContent) {
    try {
      const content = await this.contentsRepository.createContent(dataContent);
      return content;
    } catch (error) {
      throw new Error("(SERVICE - createContent) Error al crear el contenido: " + error.message);
    }
  }

  async updateContent(idcontenido, dataContent) {
    try {
      const content = await this.contentsRepository.updateContent(idcontenido, dataContent);
      return content;
    } catch (error) {
      throw new Error("(SERVICE - updateContent) Error al actualizar el contenido: " + error.message);
    }
  }

  async changeStatusContent(idcontenido) {
    try {
      const content = await this.contentsRepository.changeStatusContent(idcontenido);
      return content;
    } catch (error) {
      throw new Error("(SERVICE - changeStatusContent) Error al cambiar el estado del contenido: " + error.message);
    }
  }
}

export default contentsService;