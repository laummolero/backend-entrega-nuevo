import ProductModel from './models/product.model.js';

class ProductDAO {
    async getProducts({ limit = 10, page = 1, sort, query }) {
        const options = {
            page: Number(page),
            limit: Number(limit),
            lean: true 
        };

        if (sort) {
            options.sort = { price: sort === 'asc'? 1 : -1 };
        }

        const filter = {};
        if (query) {
            const [key, value] = query.split(':');
            if (key && value) {
                if (key === 'status') {
                    filter[key] = value === 'true';
                } else {
                    filter[key] = value;
                }
            }
        }

        const result = await ProductModel.paginate(filter, options);
        return result;
    }

    async addProduct(productData) {
        return await ProductModel.create(productData);
    }

    async getProductById(id) {
        return await ProductModel.findById(id).lean();
    }

    async updateProduct(id, updatedFields) {
        return await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true }).lean();
    }

    async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}

export default new ProductDAO();