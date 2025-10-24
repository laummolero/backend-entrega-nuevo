import { Router } from "express";
import CartDAO from "../dao/CartDAO.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await CartDAO.createCart();
    res.status(201).json({ cart: newCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await CartDAO.getCartById(cartId);
    if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const updatedCart = await CartDAO.addProductToCart(cartId, productId);
    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    if (error.message === "Carrito no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await CartDAO.removeProductFromCart(cid, pid);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body; 
        const cart = await CartDAO.updateCart(cid, products);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await CartDAO.updateProductQuantity(cid, pid, quantity);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartDAO.clearCart(cid);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

export default router;
