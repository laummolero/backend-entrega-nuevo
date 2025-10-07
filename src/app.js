import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import ProductManager from "./managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas de vistas
app.get("/", async (req, res) => {
  try {
    const productManager = new ProductManager();
    const products = await productManager.getProducts();
    res.render("home", {
      title: "Todos los Productos",
      products: products,
    });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

app.get("/realtimeproducts", async (req, res) => {
  try {
    const productManager = new ProductManager();
    const products = await productManager.getProducts();
    res.render("realTimeProducts", {
      title: "Productos en Tiempo Real",
      products: products,
      useWebsockets: true,
    });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

// WebSockets
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("createProduct", async (productData) => {
    console.log("Evento createProduct recibido:", productData);

    try {
      const productManager = new ProductManager();
      const newProduct = await productManager.addProduct(productData);
      console.log("Producto creado:", newProduct);

      io.emit("productCreated", newProduct);
      console.log("Evento productCreated emitido a todos los clientes");
    } catch (error) {
      console.error("Error creando producto:", error.message);
      socket.emit("error", { message: error.message });
    }
  });

  ocket.on("deleteProduct", async (productId) => {
    console.log("EVENTO deleteProduct RECIBIDO:", productId);
    try {
      const productManager = new ProductManager();
      await productManager.deleteProduct(productId);
      io.emit("productDeleted", productId);
      console.log("PRODUCTO ELIMINADO EXITOSAMENTE");
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

const PORT = 8080;

httpServer.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

export default app;
