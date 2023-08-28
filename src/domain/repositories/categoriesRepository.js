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

    // async getAllCategories(dataFilter, page, pageSize, rol) {
    //     try {
    //         const offset = (page - 1) * pageSize;
    //         const { search, categoryId } = dataFilter;

    //         let categoryFilter = categoryId ? { idcategoria: categoryId } : {};

    //         let filterConditions = [getWhereConditionByRol(rol)];

    //         if (search) {
    //             filterConditions.push({
    //                 [Op.or]: [
    //                     { titulo: { [Op.like]: `%${search}%` } },
    //                     { descripcion: { [Op.like]: `%${search}%` } },
    //                 ],
    //             });
    //         };

    //         const whereCondition = { [Op.and]: filterConditions, };

    //         const courses = await Category.findAndCountAll({
    //             where: whereCondition,
    //             include: [{
    //                 model: Category,
    //                 where: categoryFilter,
    //             }],
    //             order: [["updated_at", "DESC"]],
    //             offset,
    //             limit: pageSize,
    //             distinct: true,
    //         })

    //         if (courses.count <= 0) { return false; }

    //         const categoriesData = courses.rows.map((categorie) => ({
    //             idcategoria: parseInt(categorie.idcategoria),
    //             categoria: categorie.categoria,
    //             estado: categorie.estado,
    //         }));

    //         const totalItems = categories.count;
    //         const totalPages = Math.ceil(totalItems / pageSize);

    //         return {
    //             categoriesData,
    //             currentPage: page,
    //             totalPages,
    //             totalItems,
    //         };

    //     } catch (error) {
    //         throw error;
    //     }
    // }

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

    // async createCategory(dataCategory) {
    //     try {
    //         const { categoria } = dataCategory;
    //         const categoryExist = await Category.findOne({
    //             where: { categoria: categoria, estado: 1 },
    //         });

    //         if (categoryExist) { return false; }

    //         const category = await Category.create(dataCategory);
    //         return category;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async updateCategory(idcategoria, dataCategorie) {
    //     try {
    //         const categorie = await Category.findOne({
    //             where: { idcategoria, estado: 1 },
    //         });

    //         const {
    //             categoria,
    //         } = dataCategorie;

    //         const categorieTitle = categoria ? await Category.findOne({ where: { categoria, estado: 1 } }) : null;

    //         if (!categorie || (categorieTitle && categorieTitle.categoria !== categorie.categoria)) {
    //             return false;
    //         }

    //         if (categoria && categoria !== categorie.categoria) {
    //             categorie.categoria = categoria;
    //         }

    //         categorie.idcategoria = idcategoria;

    //         await categorie.save();
    //         return categorie;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async changeStatusCategorie(idcategoria) {
    //     try {
    //         const categorie = await Category.findOne({
    //             where: { idcategoria, estado: 1 },
    //         });

    //         if (!categorie) { return false; }

    //         categorie.estado = 0;

    //         await categorie.save();
    //         return categorie;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

export default categoriesRepository;