function element(elementId) { 
    return document.getElementById(elementId); 
}
function setupEvents() { 
    const navigationLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navigationLinks.forEach(navLink => {
        navLink.addEventListener('click', (event) => {
            event.preventDefault();
            let categoryName = navLink.dataset.category || 'home';
            navigationLinks.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
            renderProducts(categoryName); 
            if (window.innerWidth < 768) {
                closeMobileMenu();
            }
        });
    });
    element('close-product-modal').addEventListener('click', () => {
        element('product-modal').style.display = 'none';
    });
    element('cart-icon').addEventListener('click', () => {
        element('cart-sidebar').classList.add('active');
    });
    element('close-cart').addEventListener('click', () => {
        element('cart-sidebar').classList.remove('active');
    });
    element('wishlist-icon').addEventListener('click', () => {
        element('wishlist-sidebar').classList.add('active');
    });
    element('close-wishlist').addEventListener('click', () => {
        element('wishlist-sidebar').classList.remove('active');
    });
    element('user-icon').addEventListener('click', () => {
        element('signin-modal').style.display = 'flex';
    });
    element('close-signin').addEventListener('click', () => {
        element('signin-modal').style.display = 'none';
    });
    element('qty-plus').addEventListener('click', () => { 
        quantity++;
        element('qty-number').innerText = quantity;
    });
    element('qty-minus').addEventListener('click', () => { 
        if (quantity > 1) { 
            quantity--;
            element('qty-number').innerText = quantity;
        }
    });
    element('add-to-cart-btn').addEventListener('click', addToCart);
    element('mobile-menu-btn').addEventListener('click', () => {
        element('mobile-menu').classList.add('active');
    });
    element('close-mobile-menu').addEventListener('click', closeMobileMenu);
    element('phone-icon').addEventListener('click', () => {
        showNotification('Contact: +994 12 345 67 89');
    });
    element('signin-form').addEventListener('submit', (event) => {
        event.preventDefault();
        showNotification('Registration is successful!');
        element('signin-modal').style.display = 'none';
        element('signin-form').reset();
    });
}
function closeMobileMenu() { 
    element('mobile-menu').classList.remove('active'); 
}
function showNotification(message) {
    const oldNotification = document.querySelector('.notification'); 
    if (oldNotification) {
        oldNotification.remove();
    }
    const notification = document.createElement('div'); 
    notification.className = 'notification'; 
    notification.innerText = message;
    document.body.append(notification);
    setTimeout(() => { 
        notification.style.opacity = '0'; 
        setTimeout(() => notification.remove(), 500);
    }, 2500);
}
window.addEventListener('click', (event) => { 
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none'; 
    }
});