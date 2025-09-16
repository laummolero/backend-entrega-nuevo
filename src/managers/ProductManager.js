import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export default class ProductManager {
  constructor() {
    this.path = path.join(process.cwd(), "data", "products.json");
    this.products = [];
    this.init();
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      await this.saveProducts();
    }
  }

  async saveProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
  }

  async addProduct(productData) {
    const { title, description, code, price, stock, category } = productData;

    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Todos los campos son obligatorios");
    }

    const existingProduct = this.products.find((p) => p.code === code);
    if (existingProduct) {
      throw new Error("El código del producto ya existe");
    }

    const newProduct = {
      id: randomUUID(),
      title,
      description,
      code,
      price: Number(price),
      status: productData.status !== undefined ? productData.status : true,
      stock: Number(stock),
      category,
      thumbnails: productData.thumbnails || [],
    };

    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
  }

  async getProducts() {
    return this.products;
  }

  async getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  async updateProduct(id, updatedFields) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    const { id: _, ...fieldsToUpdate } = updatedFields;

    this.products[index] = { ...this.products[index], ...fieldsToUpdate };
    await this.saveProducts();
    return this.products[index];
  }

  async deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    this.products.splice(index, 1);
    await this.saveProducts();
  }
}
