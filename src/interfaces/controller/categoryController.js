import CategoriesRepository from "../../domain/repositories/categoriesRepository.js";
import CategoriesService from "../../application/services/categoriesService.js";
import connection from "../../infraestructure/config/db.js";

const categoriesRepository = new CategoriesRepository(connection);
const categoriesService = new CategoriesService(categoriesRepository);

const getAllCategories = async (req, res) => {
  try {
    const { ...dataFilter } = req.body;

    const categories = await categoriesService.getAllCategories(dataFilter);

    if (!categories || categories.length <= 0) {
      res.status(404).json({ error: "No se encontraron categorias" });
    } else {
      res.json(categories);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error:
          "Ocurrió un error en el servidor (controller - getAllCategories)",
      });
  }
};

const getCategoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoriesService.getCategoryDetail(id);

    if (!category) {
      res.status(404).json({ error: "No se encontró la categoria" });
    } else {
      res.json(category);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error:
          "Ocurrió un error en el servidor (controller - getCategoryDetail)",
      });
  }
};

const createCategory = async (req, res) => {
  try {
    const dataCategory = req.body;
    const newCategory = await categoriesService.createCategory(dataCategory);

    if (!newCategory) {
      res.status(400).json({ error: "La categoria ya está registrado" });
    } else {
      res.json({ message: "Categoria registrado exitosamente" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Ocurrió un error en el servidor (controller - createCategory)",
      });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const dataCategory = req.body;
    const updatedCategory = await categoriesService.updateCategory(
      id,
      dataCategory
    );

    if (updatedCategory) {
      res.json({ message: "Categoria actualizado exitosamente" });
    } else {
      res
        .status(400)
        .json({
          error: "Categoria no encontrada o nombre de Categoria repetida",
        });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Ocurrió un error en el servidor (controller - updateCategory)",
      });
  }
};

const changeStatusCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoriesService.changeStatusCategory(id);

    if (category) {
      res.json({ message: "Categoria actualizado exitosamente" });
    } else {
      res.status(400).json({ error: "Categoria no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error:
          "Ocurrió un error en servidor (controller - changeStatusCategory)",
      });
  }
};

export {
  getAllCategories,
  getCategoryDetail,
  createCategory,
  updateCategory,
  changeStatusCategory,
};
