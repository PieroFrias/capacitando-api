import { Op } from "sequelize";
// import Course from "../../infraestructure/models/courseModel.js";
import Category from "../../infraestructure/models/categoryModel.js";
// import Session from "../../infraestructure/models/sessionModel.js";
// import Content from "../../infraestructure/models/contentModel.js";
// import CourseUser from "../../infraestructure/models/courseUserModel.js";
// import User from "../../infraestructure/models/userModel.js";

class categoriesRepository {
    constructor(connection) {
        this.connection = connection;
    }

    async getAllCategories(dataFilter, page, pageSize) {
        try {
            const offset = (page - 1) * pageSize;

            const { search, categoryId } = dataFilter;

            const categoryFilter = {};

            let whereCondition = {};

            whereCondition = {
                estado: 1,
                ...categoryFilter,
            };


            const categories = await Category.findAndCountAll({
                where: whereCondition,
                order: [["idcategoria", "ASC"]],
                offset,
                limit: pageSize,
                distinct: true,
            });

            if (categories.count <= 0) { return false; }

            const categoriesData = categories.rows.map((category) => ({
                idcategoria: parseInt(category.idcategoria),
                categoria: category.categoria,
                estado: category.estado,
            }));

            const totalItems = categories.count;
            const totalPages = Math.ceil(totalItems / pageSize);

            return {
                categoriesData,
                currentPage: page,
                totalPages,
                totalItems,
            };
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

            const categoryData = {
                idcategoria: parseInt(category.idcategoria),
                categoria: category.categoria,
                estado: category.estado,
            };

            return categoryData;
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

    async updateCategory(idcategoria, dataCategorie) {
        try {
            const categorie = await Category.findOne({
                where: { idcategoria, estado: 1 },
            });

            const {
                categoria,
            } = dataCategorie;

            const categorieTitle = categoria ? await Category.findOne({ where: { categoria, estado: 1 } }) : null;

            if (!categorie || (categorieTitle && categorieTitle.categoria !== categorie.categoria)) {
                return false;
            }

            if (categoria && categoria !== categorie.categoria) {
                categorie.categoria = categoria;
            }

            categorie.idcategoria = idcategoria;

            await categorie.save();
            return categorie;
        } catch (error) {
            throw error;
        }
    }

    async changeStatusCategory(idcategoria) {
        try {
            const categorie = await Category.findOne({
                where: { idcategoria, estado: 1 },
            });

            if (!categorie) { return false; }

            categorie.estado = 0;

            await categorie.save();
            return categorie;
        } catch (error) {
            throw error;
        }
    }
}

export default categoriesRepository;