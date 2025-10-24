import CartModel from './models/cart.model.js';

class CartDAO {
    async createCart() {
        return await CartModel.create({ products: []});
    }

    async getCartById(id) {
        return await CartModel.findById(id).populate('products.product').lean();
    }

    async addProductToCart(cid, pid, quantity = 1) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        return cart;
    }

    async removeProductFromCart(cid, pid) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = cart.products.filter(p => p.product.toString()!== pid);

        await cart.save();
        return cart;
    }

    async updateCart(cid, products) {
        return await CartModel.findByIdAndUpdate(cid, { products }, { new: true });
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            throw new Error('Producto no encontrado en el carrito');
        }

        await cart.save();
        return cart;
    }

    async clearCart(cid) {
        return await CartModel.findByIdAndUpdate(cid, { products: []}, { new: true });
    }
}

export default new CartDAO();