/* 
==========================================================================
   [AQUI VA TU BACKEND] - LÓGICA DE APIs
==========================================================================
*/
const BackendService = {
    API_URL: 'https://mi-servidor-backend.com/api',

    getProductsMock: async function() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: 1, name: 'Chaqueta de Cuero Vintage', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', isNew: true },
                    { id: 2, name: 'Camiseta Básica Premium', price: 25.50, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80', isNew: false },
                    { id: 3, name: 'Pantalón Vaquero Slim', price: 59.99, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80', isNew: false },
                    { id: 4, name: 'Zapatillas Urbanas', price: 85.00, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80', isNew: true }
                ]);
            }, 500);
        });
    }
};

/* ==========================================================================
   LÓGICA DEL CARRITO (CON LOCALSTORAGE)
========================================================================== */
let cart = JSON.parse(localStorage.getItem('mujerUnicaCart')) || [];

function saveCart() {
    localStorage.setItem('mujerUnicaCart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = cart.length;
        if (cart.length === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'block';
        }
    }
}

window.addToCart = function(productName, price) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Debes iniciar sesión para añadir productos al carrito.');
        window.location.href = 'login.html';
        return;
    }

    cart.push({ name: productName, price: price });
    saveCart();
    alert(`Añadido: ${productName} por S/ ${price.toFixed(2)}`);
};

window.emptyCart = function() {
    cart = [];
    saveCart();
    renderCart(); // Si estamos en la página del carrito
};

/* ==========================================================================
   RENDERIZADO DE PÁGINAS
========================================================================== */

function createProductCard(product) {
    const isNewBadge = product.isNew ? `<span class="badge-new">Nuevo</span>` : '';
    return `
        <article class="card">
            <div class="card-image-wrapper">
                ${isNewBadge}
                <img src="${product.imageUrl}" alt="${product.name}" class="card-image">
                <div class="overlay">
                    <button class="action-btn">Detalles</button>
                    <button class="action-btn primary-btn" onclick="addToCart('${product.name}', ${product.price})">Añadir 🛒</button>
                </div>
            </div>
            <div class="card-content">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">S/ ${product.price.toFixed(2)}</p>
            </div>
        </article>
    `;
}

async function loadCatalog() {
    const container = document.getElementById('products-container');
    if (!container) return; // No estamos en la página del catálogo

    const products = await BackendService.getProductsMock();
    container.innerHTML = '';
    products.forEach(p => {
        container.innerHTML += createProductCard(p);
    });
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items-container');
    const totalContainer = document.getElementById('cart-total-price');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        totalContainer.innerText = '0.00';
        return;
    }

    let html = '';
    let total = 0;
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <span>${item.name}</span>
                <strong>S/ ${item.price.toFixed(2)}</strong>
            </div>
        `;
        total += item.price;
    });

    cartContainer.innerHTML = html;
    totalContainer.innerText = total.toFixed(2);
}

/* ==========================================================================
   NAVEGACIÓN DINÁMICA
========================================================================== */
function renderNavbar() {
    const navContainer = document.getElementById('dynamic-nav');
    if (!navContainer) return;

    // Obtener la página actual para mantener el "active-link"
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    let html = '';

    if (isLoggedIn) {
        // Estado 2: Usuario Registrado
        html = `
            <li><a href="index.html" class="${currentPath === 'index.html' ? 'active-link' : ''}">Inicio</a></li>
            <li><a href="conjuntos.html" class="${currentPath === 'conjuntos.html' ? 'active-link' : ''}">Conjuntos</a></li>
            <li><a href="accesorios.html" class="${currentPath === 'accesorios.html' ? 'active-link' : ''}">Accesorios</a></li>
            <li><a href="promociones.html" class="${currentPath === 'promociones.html' ? 'active-link' : ''}">Promociones</a></li>
            <li><a href="nosotros.html" class="${currentPath === 'nosotros.html' ? 'active-link' : ''}">Nosotros</a></li>
            <li><a href="sedes.html" class="${currentPath === 'sedes.html' ? 'active-link' : ''}">Sedes</a></li>
            <li><a href="envio.html" class="${currentPath === 'envio.html' ? 'active-link' : ''}">Envío</a></li>
            <li><a href="perfil.html" class="${currentPath === 'perfil.html' ? 'active-link' : ''}">Perfil</a></li>
            <li><a href="#" onclick="handleLogout()">Cerrar Sesión</a></li>
        `;
    } else {
        // Estado 1: Visitante (Afuera)
        html = `
            <li><a href="index.html" class="${currentPath === 'index.html' ? 'active-link' : ''}">Inicio</a></li>
            <li><a href="catalogo.html" class="${currentPath === 'catalogo.html' ? 'active-link' : ''}">Catálogo</a></li>
            <li><a href="nosotros.html" class="${currentPath === 'nosotros.html' ? 'active-link' : ''}">Nosotros</a></li>
            <li><a href="sedes.html" class="${currentPath === 'sedes.html' ? 'active-link' : ''}">Sedes</a></li>
            <li><a href="login.html" class="${currentPath === 'login.html' || currentPath === 'registro.html' ? 'active-link' : ''}">Regístrese</a></li>
        `;
    }

    navContainer.innerHTML = html;
}

window.handleLogout = function() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
};

/* ==========================================================================
   FORMULARIOS Y PERFIL
========================================================================== */
window.handleRegisterSubmit = function(event) {
    event.preventDefault();
    
    // Extraer datos del formulario
    const fullname = document.getElementById('fullname')?.value || 'Usuario Anónimo';
    const email = document.getElementById('email-reg')?.value || '';
    const talla = document.getElementById('talla')?.value || 'No especificada';
    const ocupacion = document.getElementById('ocupacion')?.value || 'No especificada';

    // Guardar en localStorage
    const userData = { fullname, email, talla, ocupacion };
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');

    alert('¡Registro Exitoso! Tus datos se han guardado en tu Perfil.');
    window.location.href = 'index.html';
};

window.handleLoginSubmit = function(event) {
    event.preventDefault();
    alert('¡Inicio de Sesión Exitoso!');
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'index.html';
};

window.loadProfileData = function() {
    const profileContainer = document.getElementById('profile-data');
    if (!profileContainer) return; // Si no estamos en perfil.html no hacer nada

    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
        const user = JSON.parse(userDataStr);
        document.getElementById('prof-name').innerText = user.fullname;
        document.getElementById('prof-email').innerText = user.email;
        document.getElementById('prof-talla').innerText = user.talla;
        document.getElementById('prof-ocupacion').innerText = user.ocupacion;
    }
};

// Inicialización general
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    loadCatalog();
    renderCart();
    renderNavbar();
    loadProfileData();
});
