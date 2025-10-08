import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    res.status(200).json({ product });
  } catch (error) {
    if (error.message === "Producto no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    const io = req.io;
    const products = await productManager.getProducts();
    io.emit("updateProducts", products);
    res.status(201).json({ product: newProduct });
  } catch (error) {
    if (
      error.message === "Todos los campos son obligatorios" ||
      error.message === "El código del producto ya existe"
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = await productManager.updateProduct(
      productId,
      req.body
    );
    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    if (error.message === "Producto no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    await productManager.deleteProduct(productId);
    const io = req.io;
    const products = await productManager.getProducts();
    io.emit("updateProducts", products);
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    if (error.message === "Producto no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

export default router;
