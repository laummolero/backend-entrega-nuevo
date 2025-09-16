import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export default class CartManager {
  constructor() {
    this.path = path.join(process.cwd(), "data", "carts.json");
    this.carts = [];
    this.init();
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.carts = JSON.parse(data);
    } catch (error) {
      await this.saveCarts();
    }
  }

  async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async createCart() {
    const newCart = {
      id: randomUUID(),
      products: [],
    };

    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  async getCartById(id) {
    const cart = this.carts.find((c) => c.id === id);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    return cart;
  }

  async addProductToCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    const existingProduct = cart.products.find((p) => p.product === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    await this.saveCarts();
    return cart;
  }
}
