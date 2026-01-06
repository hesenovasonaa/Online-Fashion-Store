function renderProducts(categoryName) { 
    const productsGrid = element('products-container');
    const categoryTitle = element('category-title');
    productsGrid.innerHTML = '';
    let filteredProducts;
    if (categoryName === 'home') {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(product => product.category === categoryName);
    }
    const categoryLabels = { home: 'New Products', women: 'Women', bags: 'Bags', shoes: 'Shoes' };
    categoryTitle.innerText = categoryLabels[categoryName] || 'Shoes';
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.img}" class="product-image" onclick="openProduct(${product.id})">
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">${Number(product.price).toFixed(2)} AZN</div>
                <div class="product-actions">
                    <button class="product-action" onclick="addToWishlist(${product.id})"><i class="far fa-heart"></i></button>
                    <button class="product-action" onclick="openProduct(${product.id})"><i class="fas fa-shopping-bag"></i></button>
                </div>
            </div>`;
        productsGrid.append(productCard);
    });
    renderBestSellers();
}

function openProduct(productId) { 
    selectedProduct = allProducts.find(product => product.id === productId);
    if (!selectedProduct) return;
    quantity = 1;
    element('product-modal-image').src = selectedProduct.img;
    element('product-modal-name').innerText = selectedProduct.name;
    element('product-modal-price').innerText = Number(selectedProduct.price).toFixed(2) + ' AZN';
    element('qty-number').innerText = quantity;
    const sizeOptionsContainer = element('size-options');
    sizeOptionsContainer.innerHTML = selectedProduct.sizes
        .map((size, index) =>
            `<button class="option-btn ${index === 0 ? 'active' : ''}">${size}</button>`
        ).join('');
    sizeOptionsContainer.onclick = e => {
        if (!e.target.classList.contains('option-btn')) return;
        sizeOptionsContainer.querySelectorAll('.option-btn')
            .forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    };
    const colorOptionsContainer = element('color-options');
    colorOptionsContainer.innerHTML = selectedProduct.colors
        .map((color, index) =>
            `<div class="color-option ${index === 0 ? 'active' : ''}" style="background:${color}"></div>`
        ).join('');
    colorOptionsContainer.onclick = e => {
        if (!e.target.classList.contains('color-option')) return;
        colorOptionsContainer.querySelectorAll('.color-option')
            .forEach(el => el.classList.remove('active'));
        e.target.classList.add('active');
    };
    element('product-modal').style.display = 'flex';
}

function addToCart() {
    const selectedSize = document.querySelector('#size-options .option-btn.active').innerText;
    cart.push({ ...selectedProduct, selectedSize: selectedSize, qty: quantity });
    updateCart();
    element('product-modal').style.display = 'none';
}

function updateCart() {
    const cartItemsList = element('cart-items');
    const cartBadge = element('cart-count');
    const cartTotalPrice = element('cart-total');
    cartBadge.innerText = cart.length;

    if (!cart.length) {
        cartItemsList.innerHTML = '<p class="empty-message">Your cart is empty</p>';
        cartTotalPrice.innerText = '0.00';
        return;
    }

    let totalPrice = 0;

    cartItemsList.innerHTML = cart.map((product, index) => {
        totalPrice += Number(product.price) * product.qty;
        return `
            <div class="sidebar-item">
                <img src="${product.img}" class="sidebar-item-image">
                <div class="sidebar-item-details">
                    <div class="sidebar-item-name">
                        ${product.name} (${product.selectedSize})
                    </div>
                    <div class="sidebar-item-price">
                        ${product.qty} x ${Number(product.price).toFixed(2)} AZN
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    cartTotalPrice.innerText = totalPrice.toFixed(2);
}


function removeFromCart(position) { 
    cart = cart.filter((item, index) => index !== position); 
    updateCart(); 
}

function addToWishlist(productId) {
    const product = allProducts.find(item => item.id === productId);
    if (product && !favorites.some(favoriteItem => favoriteItem.id === productId)) {
        favorites.push(product);
        updateWishlist();
    }
}

function updateWishlist() {
    const wishlistContainer = element('wishlist-items'), wishlistBadge = element('wishlist-count');
    wishlistBadge.innerText = favorites.length;
    if (favorites.length === 0) {
        wishlistContainer.innerHTML = '<p class="empty-message">Your wishlist is empty</p>';
        return;
    }
    wishlistContainer.innerHTML = '';
    favorites.forEach((product, index) => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'sidebar-item';
        wishlistItem.innerHTML = `
            <img src="${product.img}" class="sidebar-item-image">
            <div class="sidebar-item-details">
                <div class="sidebar-item-name">${product.name}</div>
                <div class="sidebar-item-price">${Number(product.price).toFixed(2)} AZN</div>
            </div>
            <button class="remove-item" onclick="removeFromWishlist(${index})"><i class="fas fa-trash"></i></button>`;
        wishlistContainer.append(wishlistItem);
    });
}

function removeFromWishlist(position) { 
    favorites = favorites.filter((item, index) => index !== position); 
    updateWishlist(); 
}

function renderBestSellers() {
    const bestSellersGrid = element('best-sellers-container');
    if (!bestSellersGrid) return;
    bestSellersGrid.innerHTML = ''; 
    let topProducts = [];
    for (let product of allProducts) {
        const getCount = (cat) => topProducts.filter(item => item.category === cat).length;
        if (product.category === 'women' && getCount('women') < 2) topProducts.push(product);
        else if (product.category === 'bags' && getCount('bags') < 1) topProducts.push(product);
        else if (product.category === 'shoes' && getCount('shoes') < 1) topProducts.push(product);
    }
    topProducts.forEach(product => {
        const sellerCard = document.createElement('div');
        sellerCard.className = 'seller-card';
        sellerCard.onclick = () => openProduct(product.id);
        sellerCard.innerHTML = `
            <img src="${product.img}" class="seller-image">
            <div class="seller-name">${product.name}</div>
            <div class="product-price" style="font-size:16px;">${Number(product.price).toFixed(2)} AZN</div>`;
        bestSellersGrid.append(sellerCard);
    });
}
