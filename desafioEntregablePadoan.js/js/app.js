const shopContent = document.getElementById("shopContent");
const verCarrito = document.getElementById("verCarrito");
const modalContainer = document.getElementById("modal-container");
const showAlert = document.getElementById("showAlert");
const cantidadCarrito = document.getElementById("cantidadCarrito");
const tarjetaForm = document.getElementById("tarjetaForm");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const getProductos = async() => {
  const response = await fetch("data.json");
  const data = await response.json();

  data.forEach((product) => {
    let content = document.createElement("div");
    content.className = "card";
    content.innerHTML = `
      <img src="${product.img}">
      <h3>${product.nombre}</h3>
      <p class="price">${product.precio} $</p>
      <p class="info">${product.detalle}</p>
    `;
  
    shopContent.append(content);
  
    let comprar = document.createElement("button");
    comprar.innerText = "comprar";
    comprar.className = "comprar";
  
    content.append(comprar);
  
    comprar.addEventListener("click", () => {
      const productInCart = carrito.find((cartProduct) => cartProduct.id === product.id);
  
      if (productInCart) {
        carrito.map((prod) => {
          if (productInCart.id === product.id) {
            if (prod.cantidad < product.stock) {
              productInCart.cantidad++;
            } else {
              showAlert.innerText = "No hay suficiente stock disponible.";
              setTimeout(() => {
                showAlert.innerText = "";
              }, 3000);
            }
          }
        });
      } else {
        if (product.cantidad < product.stock) {
          carrito.push({
            id: product.id,
            img: product.img,
            nombre: product.nombre,
            precio: product.precio,
            cantidad: 1,
          });
          carritoCounter();
          saveLocal();
          pintarCarrito();
        } else {
          showAlert.innerText = "No hay suficiente stock disponible.";
          setTimeout(() => {
            showAlert.innerText = "";
          }, 3000);
        }
      };
    });
  });
};

getProductos();

const saveLocal = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

tarjetaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  eliminarProductosDelCarrito();
  document.getElementById("vent").style.display = "none";
  modalContainer.style.display = "none";
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'La compra fue realizada con exito',
    showConfirmButton: false,
    timer: 1500
  });
  tarjetaForm.reset();
});

function eliminarProductosDelCarrito() {
  carrito = [];
  pintarCarrito();
  carritoCounter();
  saveLocal();
};

