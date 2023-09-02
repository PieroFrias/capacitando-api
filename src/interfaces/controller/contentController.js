import ContentsRepository from "../../domain/repositories/contentsRepository.js";
import ContentsService from "../../application/services/contentsService.js";
import connection from "../../infraestructure/config/db.js";

const contentsRepository = new ContentsRepository(connection);
const contentsService = new ContentsService(contentsRepository);

const getAllContents = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...dataSearch } = req.body;

    const contents = await contentsService.getAllContents(id, dataSearch);

    if (!contents || contents.length <= 0) {
      res.status(404).json({ error: "No se encontró contenido" });
    } else {
      res.json(contents);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - getAllContents)" });
  }
};

const getContentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await contentsService.getContentDetail(id);
    
    if (!content) {
      res.status(404).json({ error: "No se encontró el contenido" });
    } else {
      res.json(content);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - getContentDetail)" });
  }
}

const createContent = async (req, res) => {
  try {
    const userId = req.user ? req.user.idusuario : null;
    const dataContent = req.body;
    const content = await contentsService.createContent(dataContent, userId);
    
    if (!content) {
      res.status(400).json({ error: "No se pudo registrar, verifica si el contenido ya existe." });
    } else {
      res.json({ message: "Contenido registrado exitosamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - createContent)" });
  }
}

const updateContent = async (req, res) => {
  try {
    const userId = req.user ? req.user.idusuario : null;
    const { id } = req.params;
    const dataContent = req.body;
    const content = await contentsService.updateContent(id, dataContent, userId);
    
    if (!content) {
      res.status(400).json({ error: "No se pudo actualizar, verifica si el contenido ya existe." });
    } else {
      res.json({ message: "Contenido actualizado exitosamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - updateContent)" });
  }
}

const changeStatusContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await contentsService.changeStatusContent(id);
    
    if (!content) {
      res.status(400).json({ error: "No se pudo deshabilitar el contenido, verifica si el contenido existe." });
    } else {
      res.json({ message: "Contenido deshabilitado exitosamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrió un error en el servidor (controller - changeStatusContent)" });
  }
}

export {
  getAllContents,
  getContentDetail,
  createContent,
  updateContent,
  changeStatusContent,
};
