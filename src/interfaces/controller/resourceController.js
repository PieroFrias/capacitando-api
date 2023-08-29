import ResourcesRepository from "../../domain/repositories/resourcesRepository.js";
import ResourcesService from "../../application/services/resourcesService.js";
import connection from "../../infraestructure/config/db.js";

const resourcesRepository = new ResourcesRepository(connection);
const resourcesService = new ResourcesService(resourcesRepository);

const getAllResources = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...dataSearch } = req.body;

    const resources = await resourcesService.getAllResources(id, dataSearch);

    if (!resources || resources.length <= 0) {
      res.status(404).json({ error: "No se encontraron recursos" });
    } else {
      res.json(resources);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - getAllResources)" });
  }
};

const getResourceDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await resourcesService.getResourceDetail(id);
    
    if (!resource) {
      res.status(404).json({ error: "No se encontró el recurso" });
    } else {
      res.json(resource);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - getResourceDetail)" });
  }
}

const createResource = async (req, res) => {
  try {
    const dataResource = req.body;
    const resource = await resourcesService.createResource(dataResource);
    
    if (!resource) {
      res.status(400).json({ error: "No se pudo registrar, verifica si el recurso ya existe." });
    } else {
      res.json({ message: "Recurso registrado exitosamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - createResource)" });
  }
}

const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const dataResource = req.body;
    const resource = await resourcesService.updateResource(id, dataResource);
    
    if (!resource) {
      res.status(400).json({ error: "No se pudo actualizar, verifica si el recurso ya existe." });
    } else {
      res.json({ message: "Recurso actualizado exitosamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - updateSession)" });
  }
}

const changeStatusResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await resourcesService.changeStatusResource(id);
    
    if (!resource) {
      res.status(400).json({ error: "No se pudo deshabilitar el recurso, verifica si el recurso existe." });
    } else {
      res.json({ message: "Recurso deshabilitado exitosamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - changeStatusResource)" });
  }
}

export {
  getAllResources,
  getResourceDetail,
  createResource,
  updateResource,
  changeStatusResource,
};
