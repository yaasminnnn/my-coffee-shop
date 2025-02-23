document.addEventListener("DOMContentLoaded", () => {
  const productListEl = document.getElementById("product-list");
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-button");
  const searchInput = document.getElementById("search-input");

  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const ordersBtn = document.getElementById("orders-btn");
  const authSection = document.getElementById("auth-section");
  const closeBtn = document.querySelector(".close-btn");
  const loginFormDiv = document.getElementById("login-form");
  const registerFormDiv = document.getElementById("register-form");
  const dashboardBtn = document.getElementById("dashboard-btn");

  const loginForm = loginFormDiv.querySelector("form");
  const registerForm = registerFormDiv.querySelector("form");

  let products = [];
  let cart = {};

  // Check login status
  const token = localStorage.getItem("token");
  if (token) {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    ordersBtn.style.display = "inline-block";

    // Check for admin role
    if (localStorage.getItem("userRole") === "admin") {
      dashboardBtn.style.display = "inline-block";
      ordersBtn.textContent = "All Orders";
    }
  }

  // Modal controls for authentication
  loginBtn.addEventListener("click", () => {
    authSection.style.display = "flex";
    loginFormDiv.style.display = "block";
    registerFormDiv.style.display = "none";
  });

  registerBtn.addEventListener("click", () => {
    authSection.style.display = "flex";
    registerFormDiv.style.display = "block";
    loginFormDiv.style.display = "none";
  });

  closeBtn.addEventListener("click", () => {
    authSection.style.display = "none";
  });

  // Orders button navigation
  ordersBtn.addEventListener("click", () => {
    window.location.href = "/orders.html";
  });

  // Add dashboard button event listener
  dashboardBtn.addEventListener("click", () => {
    if (localStorage.getItem("userRole") === "admin") {
      window.location.href = "/dashboard.html";
    } else {
      alert("Access denied. Admin privileges required.");
    }
  });

  // Login form submission
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    .then(res => res.json())
    .then(data => {
      console.log('Login response:', data); // Debug log
      if (data.token) {
        localStorage.clear(); // Clear existing data
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        
        console.log('Stored auth data:', {
          token: 'Present',
          role: localStorage.getItem('userRole')
        });

        // Check if admin and redirect appropriately
        if (localStorage.getItem("userRole") === "admin") {
          window.location.href = "/dashboard.html";
          return;
        }

        authSection.style.display = "none";
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
        ordersBtn.style.display = "inline-block";
        
        // Update dashboard button visibility
        if (data.user.role === "admin") {
          dashboardBtn.style.display = "inline-block";
          ordersBtn.textContent = "All Orders";
        } else {
          dashboardBtn.style.display = "none";
          ordersBtn.textContent = "My Orders";
        }
        
        alert("Login successful");
      } else {
        alert(data.error || "Login failed");
      }
    })
    .catch(err => console.error("Login error:", err));
  });

  // Register form submission
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        alert("Registration successful. Please login.");
        authSection.style.display = "none";
      } else {
        alert(data.error || "Registration failed");
      }
    })
    .catch(err => console.error("Registration error:", err));
  });

  // Logout functionality
  logoutBtn.addEventListener("click", () => {
    localStorage.clear(); // Clear all auth data
    loginBtn.style.display = "inline-block";
    registerBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    ordersBtn.style.display = "none";
    alert("Logged out");
  });

  // Fetch products from API with optional search
  const fetchProducts = () => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => {
        products = data;
        filterAndRenderProducts();
      })
      .catch(err => console.error("Error fetching products:", err));
  };

  fetchProducts();

  // Filter and render products based on search input
  function filterAndRenderProducts() {
    const searchQuery = searchInput.value.toLowerCase();
    const filteredProducts = searchQuery 
      ? products.filter(product => product.name.toLowerCase().startsWith(searchQuery))
      : products;
    
    renderProducts(filteredProducts);
  }

  // Render products on the page
  function renderProducts(productsToRender = products) {
    productListEl.innerHTML = "";
    productsToRender.forEach(product => {
      const productEl = document.createElement("div");
      productEl.className = "product";
      productEl.innerHTML = `
        <img src="${product.imageUrl || 'https://via.placeholder.com/200'}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description || ''}</p>
        <p>$${product.price.toFixed(2)}</p>
        <button data-id="${product._id}">Add to Cart</button>
      `;
      productListEl.appendChild(productEl);
    });
  }

  // Add product to cart
  productListEl.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const productId = e.target.getAttribute("data-id");
      const product = products.find(p => p._id === productId);
      if (cart[productId]) {
        cart[productId].quantity += 1;
      } else {
        cart[productId] = {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1
        };
      }
      renderCart();
    }
  });

  // Render the shopping cart
  function renderCart() {
    cartItemsEl.innerHTML = "";
    let total = 0;
    Object.values(cart).forEach(item => {
      total += item.price * item.quantity;
      const cartItemEl = document.createElement("div");
      cartItemEl.className = "cart-item";
      cartItemEl.innerHTML = `
        <p><strong>${item.name}</strong></p>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: $${item.price.toFixed(2)}</p>
        <button data-id="${item.productId}" class="remove-btn">Remove</button>
      `;
      cartItemsEl.appendChild(cartItemEl);
    });
    cartTotalEl.textContent = "Total: $" + total.toFixed(2);
  }

  // Remove item from cart
  cartItemsEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const productId = e.target.getAttribute("data-id");
      delete cart[productId];
      renderCart();
    }
  });

  // Checkout: place the order
  checkoutButton.addEventListener("click", () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to place an order.");
      return;
    }
    const items = Object.values(cart).map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    // For demonstration, a fixed shipping address is provided.
    const shippingAddress = {
      type: "Point",
      coordinates: [-73.935242, 40.730610] // Example coordinates (New York)
    };
    fetch("/api/orders", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ items, shippingAddress })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("Error placing order: " + data.error);
      } else {
        alert("Order placed successfully!");
        cart = {};
        renderCart();
      }
    })
    .catch(err => {
      console.error("Error placing order:", err);
      alert("Error placing order.");
    });
  });

  // Live search on product input
  searchInput.addEventListener("input", () => {
    filterAndRenderProducts();
  });
});
