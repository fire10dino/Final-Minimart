// Check if user is logged in
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// Display welcome message
const currentUser = localStorage.getItem('currentUser');

if (currentUser) {
    document.getElementById('welcomeUser').textContent =
        `Welcome, ${currentUser}!`;
}

// Products data
const products = {
    cookies: [
        { id: 'cookies-1', name: 'Lays Chips:1can ~50g', price: 40, image: '' },
        { id: 'cookies-2', name: 'Doritos:~50g', price: 40, image: '' },
        { id: 'cookies-3', name: 'Pringles:~50g', price: 40, image: '' }
    ],

    snacks: [
        { id: 'snacks-1', name: 'Airwaves', price: 50, image: '' },
        { id: 'snacks-2', name: 'Hersheys', price: 50, image: '' }
    ],

    drinks: [
        { id: 'drinks-1', name: 'Coke:~350ml', price: 50, image: '' },
        { id: 'drinks-2', name: 'Sprite:~350ml', price: 50, image: '' },
        { id: 'drinks-3', name: 'Orange Juice:~200ml', price: 50, image: '' },
        { id: 'drinks-4', name: 'Pepsi:~350ml', price: 50, image: '' }
    ],

    donuts: [
        { id: 'donuts-1', name: '(mr.donut) Glazed Donut', price: 50, image: '' },
        { id: 'donuts-2', name: '(mr.donut) Strawberry Donut', price: 50, image: '' },
        { id: 'donuts-3', name: '(mr.donut) Chocolate Donut', price: 50, image: '' },
        { id: 'donuts-4', name: '(mr.donut) Strawberry/Chocolate Donut', price: 50, image: '' }
    ],

    giftcards: [
        { id: 'giftcard-1', name: 'Minecraft Gift Card', price: 800.00, image: '' },
        { id: 'giftcard-2', name: 'Apple Shop Gift Card', price: 500.00, image: '' },
        { id: 'giftcard-3', name: 'Google Play Gift Card', price: 500.00, image: '' }
    ]
};

let cart = [];
let quantities = {};
let currentOrderNumber = '';

// Initialize quantities
Object.values(products).flat().forEach(product => {
    quantities[product.id] = 1;
});

// Generate order number
function generateOrderNumber() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Render products
function renderProducts() {

    Object.keys(products).forEach(category => {

        const grid = document.getElementById(`${category}-grid`);

        if (!grid) return;

        grid.innerHTML = products[category].map(product => `

            <div class="product-card">

                <div class="product-image">
                    ${
                        product.image
                        ? `<img src="${product.image}" alt="${product.name}">`
                        : '<div style="font-size:3em;">📦</div>'
                    }
                </div>

                <div class="product-info">

                    <div class="product-name">${product.name}</div>

                    <div class="product-price">
                        $${product.price.toFixed(2)}
                    </div>

                    <div class="quantity-control">

                        <button
                            class="qty-btn"
                            data-id="${product.id}"
                            data-action="decrease"
                        >
                            -
                        </button>

                        <div
                            class="qty-display"
                            id="qty-${product.id}"
                        >
                            1
                        </div>

                        <button
                            class="qty-btn"
                            data-id="${product.id}"
                            data-action="increase"
                        >
                            +
                        </button>

                    </div>

                    <button
                        class="add-to-cart-btn"
                        data-id="${product.id}"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        `).join('');

    });

}

// Change quantity
function changeQty(productId, change) {

    quantities[productId] =
        Math.max(1, quantities[productId] + change);

    document.getElementById(`qty-${productId}`).textContent =
        quantities[productId];

}

// Add to cart
function addToCart(productId) {

    const product =
        Object.values(products)
        .flat()
        .find(p => p.id === productId);

    if (!product) return;

    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantities[productId]
    });

    quantities[productId] = 1;

    document.getElementById(`qty-${productId}`).textContent = 1;

    updateCartDisplay();

}

// Remove item
function removeFromCart(index) {

    cart.splice(index, 1);

    updateCartDisplay();

}

// Update cart display
function updateCartDisplay() {

    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const totalAmount = document.getElementById('totalAmount');

    const totalItems =
        cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCount.textContent = totalItems;

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<div class="empty-cart-message">Your cart is empty</div>';

        totalAmount.textContent = '$0.00';

        return;
    }

    let total = 0;

    cartItems.innerHTML = cart.map((item, index) => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        return `
            <div class="cart-item">

                <div class="cart-item-info">

                    <div class="cart-item-name">
                        ${item.name}
                    </div>

                    <div class="cart-item-price">
                        $${item.price.toFixed(2)} each
                    </div>

                    <div class="cart-item-qty">
                        Quantity: ${item.quantity}
                    </div>

                </div>

                <button
                    class="remove-btn"
                    data-index="${index}"
                >
                    Remove
                </button>

            </div>
        `;

    }).join('');

    totalAmount.textContent = `$${total.toFixed(2)}`;

}

// Toggle cart
function toggleCart() {

    document.getElementById('cartOverlay')
        .classList.toggle('active');

    document.getElementById('cartSidebar')
        .classList.toggle('active');

}

// Close checkout form
function closeCheckoutForm() {

    document.getElementById('formOverlay')
        .classList.remove('active');

    document.getElementById('checkoutForm')
        .classList.remove('active');

}

// Show order history
function showOrderHistory() {

    const historyContent =
        document.getElementById('historyContent');

    historyContent.innerHTML = `
        <div class="no-history">
            <div class="no-history-icon">📦</div>
            <p>Order history temporarily unavailable.</p>
        </div>
    `;

    document.getElementById('historyOverlay')
        .classList.add('active');

    document.getElementById('historyModal')
        .style.display = 'block';

}

// DOM Loaded
document.addEventListener('DOMContentLoaded', () => {

    renderProducts();

    // Cart buttons
    document.getElementById('cartButton')
        .addEventListener('click', toggleCart);

    document.getElementById('closeCartBtn')
        .addEventListener('click', toggleCart);

    document.getElementById('cartOverlay')
        .addEventListener('click', toggleCart);

    // Checkout button
    document.getElementById('checkoutBtn')
        .addEventListener('click', () => {

            if (cart.length === 0) {

                alert('Your cart is empty!');
                return;

            }

            currentOrderNumber = generateOrderNumber();

            document.getElementById('orderNumber').value =
                currentOrderNumber;

            toggleCart();

            document.getElementById('formOverlay')
                .classList.add('active');

            document.getElementById('checkoutForm')
                .classList.add('active');

        });

    // Cancel checkout
    document.getElementById('cancelBtn')
        .addEventListener('click', closeCheckoutForm);

    document.getElementById('formOverlay')
        .addEventListener('click', closeCheckoutForm);

    // Order history
    document.getElementById('viewHistoryBtn')
        .addEventListener('click', showOrderHistory);

    document.getElementById('closeHistoryBtn')
        .addEventListener('click', () => {

            document.getElementById('historyOverlay')
                .classList.remove('active');

            document.getElementById('historyModal')
                .style.display = 'none';

        });

    // Quantity buttons
    document.addEventListener('click', (e) => {

        if (e.target.classList.contains('qty-btn')) {

            const productId = e.target.dataset.id;
            const action = e.target.dataset.action;

            changeQty(
                productId,
                action === 'increase' ? 1 : -1
            );

        }

    });

    // Add to cart
    document.addEventListener('click', (e) => {

        if (e.target.classList.contains('add-to-cart-btn')) {

            addToCart(e.target.dataset.id);

        }

    });

    // Remove from cart
    document.addEventListener('click', (e) => {

        if (e.target.classList.contains('remove-btn')) {

            removeFromCart(parseInt(e.target.dataset.index));

        }

    });

    // Category navigation
    document.querySelectorAll('.category-link')
        .forEach(btn => {

            btn.addEventListener('click', (e) => {

                const categoryId =
                    e.target.dataset.category;

                if (!categoryId) return;

                const element =
                    document.getElementById(categoryId);

                if (element) {

                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                }

            });

        });

    // Logout
    document.getElementById('logoutBtn')
        .addEventListener('click', () => {

            if (confirm('Are you sure you want to logout?')) {

                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');

                window.location.href = 'login.html';

            }

        });

    // FORM SUBMIT
    document.getElementById('orderForm')
        .addEventListener('submit', () => {

            let orderItemsText = '';
            let total = 0;

            cart.forEach((item, index) => {

                const itemTotal =
                    item.price * item.quantity;

                total += itemTotal;

                orderItemsText +=
                    `${index + 1}. ${item.name} | Qty: ${item.quantity} | $${itemTotal.toFixed(2)}\n`;

            });

            document.getElementById('orderItems').value =
                orderItemsText;

            document.getElementById('totalAmountHidden').value =
                total.toFixed(2);

        });

});
