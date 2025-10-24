import { Router } from "express";
import ProductDAO from '../dao/ProductDAO.js';
import CartDAO from '../dao/CartDAO.js';

const router = Router();

// Ruta para la vista home
router.get('/', async (req, res) => {
    try {
        const result = await ProductDAO.getProducts({ limit: 10, page: 1 });
        res.render('home', { products: result.docs });
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta para la vista realTimeProducts.handlebars
router.get('/realtimeproducts', async (req, res) => {
    try {
        const result = await ProductDAO.getProducts({ limit: 100 }); 
        res.render('realTimeProducts', { products: result.docs });
    } catch (error) {
        res.status(500).send('Error al obtener los productos en tiempo real');
    }
});

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const result = await ProductDAO.getProducts({ limit, page, sort, query });

        const baseURL = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
        const prevLink = result.hasPrevPage? `${baseURL}?page=${result.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null;
        const nextLink = result.hasNextPage? `${baseURL}?page=${result.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null;

        res.render('products', {
            products: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
    }
});

// Vista para un carrito específico
router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartDAO.getCartById(cid);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).send('Error al obtener el carrito');
    }
});



export default router;
