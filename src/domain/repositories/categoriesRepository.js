import { Op } from "sequelize";
import Category from "../../infraestructure/models/categoryModel.js";

class categorysRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async getAllCategories(dataFilter) {
    try {
      const { search } = dataFilter;

      let whereCondition = {};

      whereCondition = { estado: 1 };

      if (search) {
        whereCondition.categoria = {
          [Op.like]: `%${search}%`,
        };
      }

      const categorys = await Category.findAll({
        where: whereCondition,
        order: [["idcategoria", "DESC"]],
      });

      if (categorys.length <= 0) { return false; }

      return categorys;
    } catch (error) {
      throw error;
    }
  }

  async getCategoryDetail(id) {
    try {
      const category = await Category.findOne({
        where: { estado: 1, idcategoria: id },
      });

      if (!category) { return false; }

      return category;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(dataCategory) {
    try {
      const { categoria } = dataCategory;
      const categoryExist = await Category.findOne({
        where: { categoria: categoria, estado: 1 },
      });

      if (categoryExist) { return false; }

      const category = await Category.create(dataCategory);
      return category;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(idcategoria, dataCategory) {
    try {
      const category = await Category.findOne({
        where: { idcategoria, estado: 1 },
      });

      const { categoria } = dataCategory;

      const categoryTitle = categoria ? await Category.findOne({ where: { categoria, estado: 1 } }) : null;

      if (!category || (categoryTitle && categoryTitle.categoria !== category.categoria)) {
        return false;
      }

      if (categoria && categoria !== category.categoria) {
        category.categoria = categoria;
      }

      await category.save();
      return category;
    } catch (error) {
      throw error;
    }
  }

  async changeStatusCategory(idcategoria) {
    try {
      const category = await Category.findOne({
        where: { idcategoria, estado: 1 },
      });

      if (!category) { return false; }

      category.estado = 0;

      await category.save();
      return category;
    } catch (error) {
      throw error;
    }
  }
}

export default categorysRepository;
