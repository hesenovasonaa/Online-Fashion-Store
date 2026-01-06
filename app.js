let allProducts = [];
let cart = []; 
let favorites = []; 
let selectedProduct = null;
let quantity = 1;
const productNames = {
    women: ['Summer Clothing', 'Shirt', 'Elegant Dress', 'Comfortable Blouse', 'Winter Clothing', 'Summer Tunic', 'Coat', 
            'Style Shirt', 'Colorful Clothing','Classic Blouse', 'Fashionable Clothing','Casual Shirt','Event Dress','Mini Dress',
            'Jeans','Leopard Shirt','Midi Shorts','Jacket','Blazer','Oversize'],
    bags: ['Bag', 'Shoulder Bag', 'Leather Bag', 'Mini Bag', 'Big Bag', 'Style Bag', 'Everyday Bag', 'Elegant Bag','Travel Bag',
        'Luxury Bag','Coach','Handbags','Tote Bag','Leopard Bag','Pink Bag','GYM Bag'],
    shoes: ['Shoes', 'Classic Shoes', 'Comfortable Shoes', 'Fashion Shoes', 'Leather Shoes', 'Summer Shoes', 'Winter Shoes', 'Sports Shoes',
        'Ladies Shoes','YSL Heels','Party Shoes','Leopard Shoes','Sandals','Helled Sandals','Ballet Shoes','Sneakers']
};
const imgPool = {
    women: [
        'images/women/img2.jpg', 'images/women/img3.jpg', 'images/women/img4.jpg','images/women/img5.jpg', 'images/women/img1.jpg', 
        'images/women/img6.jpg','images/women/img7.jpg', 'images/women/img8.jpg', 'images/women/img9.jpg',
        'images/women/img10.jpg', 'images/women/img11.jpg','images/women/img12.jpg','images/women/img36.jpg',
        'images/women/img37.jpg','images/women/img38.jpg',
        'images/women/img39.jpg','images/women/img52.jpg',
        'images/women/img53.jpg','images/women/img54.jpg','images/women/img55.jpg'
    ],
    bags: [
        'images/bags/img13.jpg', 'images/bags/img14.jpg', 'images/bags/img15.jpg','images/bags/img16.jpg', 
        'images/bags/img17.jpg', 'images/bags/img18.jpg', 'images/bags/img19.jpg', 'images/bags/img20.jpg','images/bags/img29.jpg',
        'images/bags/img30.jpg','images/bags/img40.jpg','images/bags/img41.jpg','images/bags/img42.jpg',
        'images/bags/img43.jpg','images/bags/img44.jpg','images/bags/img45.jpg'
    ],
    shoes: [
        'images/shoes/img21.jpg', 'images/shoes/img22.jpg', 'images/shoes/img23.jpg', 'images/shoes/img24.jpg', 
        'images/shoes/img25.jpg', 'images/shoes/img26.jpg', 'images/shoes/img27.jpg', 'images/shoes/img28.jpg','images/shoes/img31.jpg',
        'images/shoes/img32.jpg','images/shoes/img46.jpg','images/shoes/img47.jpg',
        'images/shoes/img48.jpg','images/shoes/img49.jpg','images/shoes/img50.jpg','images/shoes/img51.jpg'
    ]
};
function createProduct(id, category, index, price) {
    if (price <= 0) {
        price = 50 + (index * 7);
    }
    let product = { 
        id: id, 
        name: productNames[category][index % productNames[category].length], 
        price: price.toFixed(2), 
        category: category, 
        img: imgPool[category][index] 
    };
    if (category === 'bags') {
        product.sizes = ['Standart'];
        product.colors = ['#000000', '#FFFFFF', '#8B4513'];
    } else if (category === 'shoes') {
        product.sizes = ['37', '38', '39', '40', '41'];
        product.colors = ['#FFC0CB', '#000000', '#FFFFFF'];
    } else {
        product.sizes = ['XS', 'S', 'M', 'L', 'XL'];
        product.colors = ['#FFC0CB', '#000000', '#FFFFFF'];
    }
    return product;
}
async function fetchProducts() {
    const response = await fetch('https://api.escuelajs.co/api/v1/products?offset=0&limit=50')
        .catch(e => console.error(e));
    if (!response) return;
    const data = await response.json();
    let womenIndex = 0 
    let bagsIndex = 0 
    let shoesIndex = 0 
    let tempProducts = [];
    data.forEach(product => {
        let title = product.title.toLowerCase();
        let category = product.category.name.toLowerCase();
        if ((category.includes('furniture') || title.includes('table')) && bagsIndex < imgPool.bags.length) {
            tempProducts.push(createProduct(product.id, 'bags', bagsIndex++, product.price));
        } else if ((category.includes('shoes') || title.includes('shoe')) && shoesIndex < imgPool.shoes.length) {
            tempProducts.push(createProduct(product.id, 'shoes', shoesIndex++, product.price));
        } else if (womenIndex < imgPool.women.length) {
            tempProducts.push(createProduct(product.id, 'women', womenIndex++, product.price));
        }
    });
    let startId = 1000;
    while (womenIndex < imgPool.women.length) {
            tempProducts.push(createProduct(startId++, 'women', womenIndex++, 0));
        }
    while (bagsIndex < imgPool.bags.length) {
        tempProducts.push(createProduct(startId++, 'bags', bagsIndex++, 0));
    }
    while (shoesIndex < imgPool.shoes.length) {
        tempProducts.push(createProduct(startId++, 'shoes', shoesIndex++, 0));
    }
    allProducts = tempProducts;
}
document.addEventListener('DOMContentLoaded', async () => {
    await fetchProducts();
    renderProducts('home');
    setupEvents();
});