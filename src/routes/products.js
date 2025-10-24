import { Router } from "express";
import ProductDAO from "../dao/ProductDAO.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;
        const result = await ProductDAO.getProducts({ limit, page, sort, query });

        const baseURL = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
        const prevLink = result.hasPrevPage? `${baseURL}?page=${result.prevPage}&limit=${result.limit}&sort=${sort || ''}&query=${query || ''}` : null;
        const nextLink = result.hasNextPage? `${baseURL}?page=${result.nextPage}&limit=${result.limit}&sort=${sort || ''}&query=${query || ''}` : null;

        res.status(200).json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await ProductDAO.getProductById(productId);
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
    const newProduct = await ProductDAO.addProduct(req.body);
    const io = req.io;
    const productsResult = await ProductDAO.getProducts({});
    io.emit("updateProducts", productsResult.docs);
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
    const updatedProduct = await ProductDAO.updateProduct(
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
    await ProductDAO.deleteProduct(productId);
    const io = req.io;
    const productsResult = await ProductDAO.getProducts({});
    io.emit("updateProducts", productsResult.docs);
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
