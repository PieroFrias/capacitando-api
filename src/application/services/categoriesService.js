class categoriesService {
    constructor(categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }

    // async getAllCategories(dataFilter, page, pageSize, rol){
    //     try {
    //         const categories = await this.categoriesRepository.getAllCategories(dataFilter, page, pageSize, rol);
    //         return categories;
    //     } catch (error) {
    //         throw new Error("(SERVICE - getAllCategories) Error al obtener las categorias: " + error.message);
    //     }
    // }

    async getCategoryDetail(id) {
        try {
            const category = await this.categoriesRepository.getCategoryDetail(id);
            return category;
        } catch (error) {
            throw new Error("(SERVICE - getCategoryDetail) Error al obtener la categoria: " + error.message);
        }
    }

    // async createCategory(dataCategory){
    //     try {
    //         const category = await this.categoriesRepository.createCategory(dataCategory);
    //         return category;
    //     } catch (error) {
    //         throw new Error("(SERVICE - createCategory) Error al crear la categoria: " + error.message);
    //     }
    // }

    // async updateCategory(id, dataCategory){
    //     try {
    //         const category = await this.categoriesRepository.updateCategory(id, dataCategory);
    //         return category;
    //     } catch (error) {
    //         throw new Error("(SERVICE - updateCategory) Error al actualizar la categoria: " + error.message);
    //     }
    // }

}

export default categoriesService;