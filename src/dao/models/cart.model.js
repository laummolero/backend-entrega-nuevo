import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: {
        type:[],
        default:[]
    }
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;