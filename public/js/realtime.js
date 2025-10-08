const socket = io();

const productList = document.getElementById("product-list");
const createProductForm = document.getElementById("createProductForm");

console.log("Cliente conectado y escuchando eventos de socket...");

socket.on("updateProducts", (products) => {
  productsList.innerHTML = "";

  if (products.length === 0) {
    productsList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning">
                    No hay productos disponibles
                </div>
            </div>
        `;
    return;
  }

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "col-md-6 mb-3"; // Clases de Bootstrap para la columna
    productCard.innerHTML = `
            <div class="card product-card">
                <div class="card-body">
                    <h6 class="card-title">${product.title}</h6>
                    <p class="card-text">$${product.price}</p>
                    <p class="card-text"><small>Stock: ${product.stock}</small></p>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    productsList.appendChild(productCard);
  });
});

createProductForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(createProductForm);
  const product = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: parseFloat(formData.get("price")),
    stock: parseInt(formData.get("stock")),
    category: formData.get("category"),
  };

  fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.product && data.product.id) {
        console.log("Producto añadido exitosamente");
        createProductForm.reset();
      } else {
        console.error("Error al añadir producto:", data.error);
        alert(`Error: ${data.error}`);
      }
    })
    .catch((error) => console.error("Error en la solicitud fetch:", error));
});

function deleteProduct(id) {
  fetch(`/api/products/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        console.log("Producto eliminado exitosamente");
      } else {
        console.error("Error al eliminar producto:", data.error);
        alert(`Error: ${data.error}`);
      }
    })
    .catch((error) => console.error("Error en la solicitud fetch:", error));
}
