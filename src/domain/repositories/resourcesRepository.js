import { Op } from "sequelize";
import Resource from "../../infraestructure/models/resourceModel.js";
import Content from "../../infraestructure/models/contentModel.js";

class resourcesRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async getAllResources(idcontenido, dataSearch) {
    try {
      let whereCondition = { estado: 1, idcontenido: idcontenido, };

      const { search } = dataSearch;
      if (search) {
        whereCondition[Op.or] = [
          { nombre: { [Op.like]: `%${search}%` } },
        ];
      };

      const resources = await Resource.findAll({
        where: whereCondition,
        include: [Content],
        order: [["idrecurso", "DESC"]],
      });

      if (resources.length <= 0) { return false; }

      const resourcesData = resources.map((resource) => ({
        idrecurso: parseInt(resource.idrecurso),
        nombre: resource.nombre,
        contenido: resource.contenido.titulo,
        idcontenido: parseInt(resource.contenido.idcontenido),
        url: resource.url ? resource.url : null,
        estado: resource.estado,
      }));

      return resourcesData;
    } catch (error) {
      throw error;
    }
  }

  async getResourceDetail(idrecurso) {
    try {
      const resource = await Resource.findOne({
        where: { estado: 1, idrecurso, },
        include: [Content],
      });

      if (!resource) { return false; }

      const resourceData = {
        idrecurso: parseInt(resource.idrecurso),
        nombre: resource.nombre,
        contenido: resource.contenido.titulo,
        idcontenido: parseInt(resource.contenido.idcontenido),
        url: resource.url ? resource.url : null,
        estado: resource.estado,
      };

      return resourceData;
    } catch (error) {
      throw error;
    }
  }

  async createResource(dataResource) {
    try {
      const { nombre } = dataResource;

      const resourceExists = await Resource.findOne({
        where: { nombre, estado: 1 },
      });

      if (resourceExists) { return false; }

      const resource = await Resource.create(dataResource);
      return resource;
    } catch (error) {
      throw error;
    }
  }

  async updateResource(idrecurso, dataResource) {
    try {
      const resource = await Resource.findOne({
        where: { idrecurso, estado: 1 },
      });

      const { nombre, url } = dataResource;

      const resourceName = nombre ? await Resource.findOne({ where: { nombre, estado: 1 } }) : null;

      if (!resource || (resourceName && resourceName.nombre !== resource.nombre)) {
        return false;
      }

      if (nombre && nombre !== resource.nombre) {
        resource.nombre = nombre;
      }
      resource.url = url;

      await resource.save();
      return resource;
    } catch (error) {
      throw error;
    }
  }

  async changeStatusResource(idrecurso) {
    try {
      const resource = await Resource.findOne({
        where: { idrecurso, estado: 1 },
      });

      if (!resource) { return false; }

      resource.estado = 0;

      await resource.save();
      return resource;
    } catch (error) {
      throw error;
    }
  }
}

export default resourcesRepository;
