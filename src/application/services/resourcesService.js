class resourcesService {
  constructor(resourcesRepository) {
    this.resourcesRepository = resourcesRepository;
  }

  async getAllResources(idcontenido, dataSearch) {
    try {
      const resources = await this.resourcesRepository.getAllResources(idcontenido, dataSearch);
      return resources;
    } catch (error) {
      throw new Error(
        "(SERVICE - getAllResources) Error al obtener el recurso: " +
          error.message
      );
    }
  }

  async getResourceDetail(idrecurso) {
    try {
      const resource = await this.resourcesRepository.getResourceDetail(idrecurso);
      return resource;
    } catch (error) {
      throw new Error(
        "(SERVICE - getResourceDetail) Error al obtener el recurso: " +
          error.message
      );
    }
  }

  async createResource(dataResource) {
    try {
      const resource = await this.resourcesRepository.createResource(dataResource);
      return resource;
    } catch (error) {
      throw new Error(
        "(SERVICE - createResource) Error al crear el recurso: " + error.message
      );
    }
  }

  async updateResource(idrecurso, dataResource) {
    try {
      const resource = await this.resourcesRepository.updateResource(
        idrecurso,
        dataResource
      );
      return resource;
    } catch (error) {
      throw new Error(
        "(SERVICE - updateResource) Error al actualizar el recurso: " +
          error.message
      );
    }
  }

  async changeStatusResource(idrecurso) {
    try {
      const resource = await this.resourcesRepository.changeStatusResource(
        idrecurso
      );
      return resource;
    } catch (error) {
      throw new Error(
        "(SERVICE - changeStatusResource) Error al cambiar el estado del recurso: " +
          error.message
      );
    }
  }
}

export default resourcesService;
