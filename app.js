// ==========================================
// TELEGRAM BOT CONFIGURATION
// ==========================================
// IMPORTANT: Replace these with your actual values!
const TELEGRAM_BOT_TOKEN = '8524327610:AAHD2cdidv2rucVyWpE89Lpo_J40CbMQQuo'; // Get from @BotFather
const TELEGRAM_CHAT_ID = '1829694539';     // Get from @userinfobot

// ==========================================
// TELEGRAM INTEGRATION
// ==========================================

async function sendOrderToTelegram(orderData) {
    const {
        orderId,
        name,
        phone,
        address,
        wilaya,
        shipping,
        deliveryType,
        items,
        subtotal,
        total
    } = orderData;

    // Format delivery type
    const deliveryText = deliveryType === 'home' ? '🏠 Home Delivery (للمنزل)' : '🏢 Office Pickup (للمكتب)';

    // Format items list WITH OPTIONS
    let itemsList = '';
    items.forEach(item => {
        const qty = item.qty || 1;
        const itemTotal = (item.price * qty).toFixed(2);

        // Add size and color if they exist
        let optionsText = '';
        if (item.size) optionsText += ` | Size: ${item.size}`;
        if (item.color) optionsText += ` | Color: ${item.color}`;

        itemsList += `• ${item.name}${optionsText} x ${qty} - ${itemTotal} DZD\n`;
    });

    // Create the message
    const message = `
🛍️ *NEW ORDER RECEIVED*

📋 *Order ID:* \`${orderId}\`

👤 *Customer Information:*
• Name: ${name}
• Phone: ${phone}
• Address: ${address}
• Wilaya: ${wilaya}

📦 *Order Details:*
${itemsList}

💰 *Payment Summary:*
• Subtotal: ${subtotal.toFixed(2)} DZD
• Shipping: ${shipping.toFixed(2)} DZD
• *Total: ${total.toFixed(2)} DZD*

🚚 *Delivery:* ${deliveryText}
💵 *Payment:* Cash on Delivery (COD)

⏰ *Time:* ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Algiers' })}
  `.trim();

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        console.log('📤 Attempting to send to Telegram...');
        console.log('URL:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const responseText = await response.text();
        console.log('📡 Telegram API response status:', response.status);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('❌ Failed to parse Telegram response as JSON:', e);
            console.error('Raw response:', responseText);
            return false;
        }

        if (!response.ok || !data.ok) {
            console.error('❌ Telegram API error:', data);

            // Specific error handling
            if (data.error_code === 400) {
                console.error('❌ Bad Request: Check your message format or chat_id');
            } else if (data.error_code === 401) {
                console.error('❌ Unauthorized: Invalid bot token');
            } else if (data.error_code === 403) {
                console.error('❌ Forbidden: Bot is not added to the chat or chat_id is wrong');
            } else if (data.error_code === 429) {
                console.error('❌ Rate limited: Too many requests');
            }

            return false;
        }

        console.log('✅ Order sent to Telegram successfully!');
        console.log('Message ID:', data.result.message_id);
        return true;
    } catch (error) {
        console.error('❌ Network error sending to Telegram:', error);
        return false;
    }
}

// Test function - Run in console: testTelegramBot()
async function testTelegramBot() {
    console.log('🧪 Testing Telegram bot...');
    console.log('Bot Token (first 10 chars):', TELEGRAM_BOT_TOKEN.substring(0, 10) + '...');
    console.log('Chat ID:', TELEGRAM_CHAT_ID);

    const testOrder = {
        orderId: 'TEST-' + Date.now(),
        name: 'Test Customer',
        phone: '0555123456',
        address: '123 Test Street, Test Commune',
        wilaya: 'Algiers',
        shipping: 650,
        deliveryType: 'home',
        items: [
            { name: 'Classic Denim Jacket', qty: 2, price: 7999, size: 'L', color: 'Blue' },
            { name: 'Vintage Graphic Tee', qty: 1, price: 2400, size: 'M', color: 'Black' }
        ],
        subtotal: 18398,
        total: 19048
    };

    console.log('📤 Sending test order to Telegram...');

    const result = await sendOrderToTelegram(testOrder);

    if (result) {
        console.log('✅ SUCCESS! Check your Telegram for the test message.');
    } else {
        console.error('❌ FAILED! Check the errors above.');
        console.log('💡 Troubleshooting steps:');
        console.log('1. Check if bot token is correct');
        console.log('2. Check if chat_id is correct (must be your user ID or group ID)');
        console.log('3. Make sure you started the bot with /start');
        console.log('4. Check if bot is added to the chat/group');
    }

    return result;
}

// ============ PRODUCT FUNCTIONS ============

async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (error) {
        console.error('Error fetching products', error);
        return [];
    }
    return data || [];
}

function formatPrice(p) {
    return Number(p).toFixed(2);
}

// Unified renderProducts function that navigates to product-detail.html
function renderProducts(products) {
    const container = document.getElementById('products');
    if (!container) return;

    container.innerHTML = '';

    products.forEach(p => {
        const card = document.createElement('article');
        card.className = 'product-card bg-white overflow-hidden flex flex-col cursor-pointer';
        card.onclick = () => window.location.href = `product-detail.html?id=${p.id}`;

        card.innerHTML = `
            <div class="block overflow-hidden bg-gray-100 h-80">
                <img src="${p.image_url || 'https://via.placeholder.com/400x300'}" 
                     alt="${p.name}" 
                     class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
            </div>
            <div class="p-6 flex flex-col flex-1">
                <h3 class="text-lg tracking-wide mb-2" style="font-family: 'Playfair Display', serif;">
                    ${p.name}
                </h3>
                <p class="text-sm text-gray-600 flex-1 leading-relaxed">${p.description || ''}</p>
                <div class="mt-6 flex items-center justify-between">
                    <div class="text-lg font-semibold">${formatPrice(p.price)} DZ</div>
                    <button class="px-4 py-2 bg-gray-900 text-white text-sm tracking-wider hover:bg-black transition" 
                            data-id="${p.id}">
                        ADD TO CART
                    </button>
                </div>
            </div>
        `;

        // Add to cart button - stop propagation so it doesn't navigate
        const btn = card.querySelector('button');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(p);
        });

        container.appendChild(card);
    });
}

// Simple cart in localStorage
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart:vintage')) || [];
    } catch { return []; }
}

function saveCart(cart) {
    localStorage.setItem('cart:vintage', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product, options = {}) {
    const cart = getCart();

    // Look for existing item with same ID AND same options
    const existingIndex = cart.findIndex(i =>
        i.id === product.id &&
        i.size === (options.size || product.size || '') &&
        i.color === (options.color || product.color || '')
    );

    if (existingIndex >= 0) {
        // Update quantity if same product with same options
        cart[existingIndex].qty += (options.qty || product.qty || 1);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: options.qty || product.qty || 1,
            size: options.size || product.size || '',
            color: options.color || product.color || '',
            image_url: product.image_url
        });
    }
    saveCart(cart);
    alert('Added to cart!');
}

function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (!countEl) {
        // Cart count element doesn't exist on this page, that's ok
        return;
    }

    const cart = getCart();
    const totalQty = cart.reduce((s, i) => s + (i.qty || 0), 0);
    countEl.textContent = totalQty;
}

function renderCart() {
    const cart = getCart();
    const itemsEl = document.getElementById('cartItems');

    // If cart items element doesn't exist on this page, just return
    if (!itemsEl) {
        return;
    }

    itemsEl.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        itemsEl.innerHTML = '<p class="text-center py-8 text-gray-600">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.qty;
            const el = document.createElement('div');
            el.className = 'flex items-center gap-4 border-b pb-6';

            // Add size and color info if they exist
            const optionsText = [];
            if (item.size) optionsText.push(`Size: ${item.size}`);
            if (item.color) optionsText.push(`Color: ${item.color}`);
            const optionsHTML = optionsText.length > 0 ?
                `<div class="text-sm text-gray-500 mt-1">${optionsText.join(', ')}</div>` : '';

            el.innerHTML = `
                <img src="${item.image_url || 'https://via.placeholder.com/80'}" class="w-24 h-24 object-cover">
                <div class="flex-1">
                    <div class="font-semibold text-lg" style="font-family: 'Playfair Display', serif;">${item.name}</div>
                    ${optionsHTML}
                    <div class="text-gray-600 mt-1">${formatPrice(item.price)} DZ</div>
                </div>
                <div class="flex items-center gap-3">
                    <button class="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-100" 
                            data-action="dec" 
                            data-id="${item.id}" 
                            data-size="${item.size || ''}" 
                            data-color="${item.color || ''}">−</button>
                    <span class="w-8 text-center">${item.qty}</span>
                    <button class="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-100" 
                            data-action="inc" 
                            data-id="${item.id}" 
                            data-size="${item.size || ''}" 
                            data-color="${item.color || ''}">+</button>
                </div>
            `;
            itemsEl.appendChild(el);
        });
    }

    // Update cart total if element exists
    const cartTotalEl = document.getElementById('cartTotal');
    if (cartTotalEl) {
        cartTotalEl.textContent = formatPrice(total);
    }
}

function openCart() {
    // Check if cart modal exists before trying to show it
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) {
        return;
    }

    renderCart();
    cartModal.classList.remove('hidden');
    cartModal.classList.add('flex');
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;

    cartModal.classList.add('hidden');
    cartModal.classList.remove('flex');
}

function clearCart() {
    localStorage.removeItem('cart:vintage');
    updateCartCount();

    // Only render cart if we're on a page with cart
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        renderCart();
    }
}

function changeQty(id, delta, size = '', color = '') {
    const cart = getCart();
    const item = cart.find(i =>
        i.id === Number(id) &&
        i.size === size &&
        i.color === color
    );
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        const idx = cart.findIndex(i =>
            i.id === Number(id) &&
            i.size === size &&
            i.color === color
        );
        if (idx >= 0) cart.splice(idx, 1);
    }
    saveCart(cart);

    // Only render cart if we're on a page with cart
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        renderCart();
    } else {
        // Just update count if cart isn't visible
        updateCartCount();
    }
}

async function tryAuth(email) {
    const authMsg = document.getElementById('authMsg');
    if (!authMsg) return;

    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
        authMsg.textContent = 'Error sending link: ' + error.message;
    } else {
        authMsg.textContent = 'Magic link sent — check your email.';
    }
}

// Wire up UI
window.addEventListener('DOMContentLoaded', async () => {
    updateCartCount();

    // Only fetch products if on index page
    if (document.getElementById('products')) {
        const products = await fetchProducts();
        renderProducts(products);
    }

    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCart');
    const clearCartBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartItems = document.getElementById('cartItems');

    // Only add event listeners if elements exist
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (clearCartBtn) clearCartBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            clearCart();
        }
    });
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });

    if (cartItems) {
        cartItems.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            const id = e.target.getAttribute('data-id');
            const size = e.target.getAttribute('data-size') || '';
            const color = e.target.getAttribute('data-color') || '';
            if (!action || !id) return;
            if (action === 'inc') changeQty(id, 1, size, color);
            if (action === 'dec') changeQty(id, -1, size, color);
        });
    }

    window.saveCart = saveCart;
});

async function handleCheckout() {
    const cart = getCart();
    if (!cart || cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const total = cart.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);

    const orderPayload = {
        user_id: null,
        total: total,
        status: 'pending'
    };

    const { data: orderData, error: orderError } = await supabase.from('orders').insert([orderPayload]).select().single();
    if (orderError || !orderData) {
        console.error('Error creating order', orderError);
        alert('Could not create order. See console for details.');
        return;
    }

    const items = cart.map(i => ({
        order_id: orderData.id,
        product_id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.qty,
        size: i.size || null,
        color: i.color || null
    }));

    const { data: itemsData, error: itemsError } = await supabase.from('order_items').insert(items);
    if (itemsError) {
        console.error('Error inserting order items', itemsError);
        alert('Order was created but adding items failed. Check console.');
        return;
    }

    clearCart();
    closeCart();
    alert(`Order placed — id: ${orderData.id}`);
}

// submitCheckout: used by checkout.html to create an order including shipping and basic customer info
async function submitCheckout({ name, phone, address, wilaya, shipping, deliveryType }) {
    try {
        const cart = getCart();
        if (!cart || cart.length === 0) {
            return { success: false, message: 'Your cart is empty.' };
        }

        if (!name || !phone || !address || !wilaya) {
            return { success: false, message: 'Please provide all required information.' };
        }

        const subtotal = cart.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);
        const shippingCost = Number(shipping || 0);
        const total = subtotal + shippingCost;

        console.log('📝 Creating order...');
        console.log('Cart items:', cart);
        console.log('Customer:', { name, phone, address, wilaya });

        // SIMPLIFIED VERSION: Use only columns that definitely exist
        const orderPayload = {
            user_id: null,
            customer_name: name,
            customer_phone: phone,
            customer_address: address,
            wilaya: wilaya,
            shipping_cost: shippingCost,
            subtotal: subtotal,
            total: total,
            status: 'pending'
        };

        console.log('📦 Order payload:', orderPayload);

        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([orderPayload])
            .select()
            .single();

        if (orderError || !orderData) {
            console.error('❌ Error creating order:', orderError);

            // Try minimal version
            const minimalPayload = {
                customer_name: name,
                customer_phone: phone,
                total: total,
                status: 'pending'
            };

            const { data: minimalData, error: minimalError } = await supabase
                .from('orders')
                .insert([minimalPayload])
                .select()
                .single();

            if (minimalError || !minimalData) {
                console.error('❌ Minimal insert also failed:', minimalError);
                // Generate order ID manually and just use Telegram
                const manualOrderId = 'ORD-' + Date.now();

                const telegramOrderData = {
                    orderId: manualOrderId,
                    name,
                    phone,
                    address,
                    wilaya,
                    shipping: shippingCost,
                    deliveryType: deliveryType || 'home',
                    items: cart,
                    subtotal,
                    total
                };

                console.log('📤 Sending order to Telegram (no database)...');
                const telegramSent = await sendOrderToTelegram(telegramOrderData);

                // Save to localStorage
                const ordersHistory = JSON.parse(localStorage.getItem('orders_history') || '[]');
                ordersHistory.push({
                    ...telegramOrderData,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('orders_history', JSON.stringify(ordersHistory));

                clearCart();

                return {
                    success: true,
                    orderId: manualOrderId,
                    shippingCost,
                    telegramSent: telegramSent,
                    message: `Order #${manualOrderId} placed! (Saved locally) Total: ${total.toFixed(2)} DZ`
                };
            }

            const telegramOrderData = {
                orderId: minimalData.id,
                name,
                phone,
                address,
                wilaya,
                shipping: shippingCost,
                deliveryType: deliveryType || 'home',
                items: cart,
                subtotal,
                total
            };

            console.log('📤 Sending order to Telegram...');
            const telegramSent = await sendOrderToTelegram(telegramOrderData);

            if (!telegramSent) {
                // Save order details locally
                localStorage.setItem('last_order_backup', JSON.stringify({
                    ...telegramOrderData,
                    timestamp: new Date().toISOString()
                }));
            }

            clearCart();

            return {
                success: true,
                orderId: minimalData.id,
                shippingCost,
                telegramSent: telegramSent || false,
                message: `Order #${minimalData.id} placed successfully! Total: ${total.toFixed(2)} DZ`
            };
        }

        console.log('✅ Order created successfully. Order ID:', orderData.id);

        // ⭐ SEND TO TELEGRAM ⭐ - Now includes options
        const telegramOrderData = {
            orderId: orderData.id,
            name,
            phone,
            address,
            wilaya,
            shipping: shippingCost,
            deliveryType: deliveryType || 'home',
            items: cart, // This now includes size and color
            subtotal,
            total
        };

        console.log('📤 Sending order to Telegram...', telegramOrderData);
        const telegramSent = await sendOrderToTelegram(telegramOrderData);

        if (!telegramSent) {
            console.warn('⚠️ Failed to send to Telegram, but order was saved to database');
            // Save order details locally as backup
            localStorage.setItem('last_order_backup', JSON.stringify({
                ...telegramOrderData,
                timestamp: new Date().toISOString()
            }));
        } else {
            console.log('✅ Telegram notification sent successfully');
        }

        // Clear cart
        clearCart();

        return {
            success: true,
            orderId: orderData.id,
            shippingCost,
            telegramSent: telegramSent,
            message: `Order #${orderData.id} placed successfully! Total: ${total.toFixed(2)} DZ`
        };
    } catch (err) {
        console.error('❌ Unexpected error in submitCheckout:', err);
        return { success: false, message: 'An unexpected error occurred: ' + err.message };
    }
}

// helper: fetch a single product by id
async function fetchProductById(id) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
    if (error) {
        console.error('Error fetching product', error);
        return null;
    }
    return data;
}

// render a product detail view into #productDetail (used by product.html if you have a separate detail page)
function renderProductDetail(p) {
    const container = document.getElementById('productDetail');
    if (!container) return;
    if (!p) {
        container.innerHTML = '<div class="text-gray-600">Product not found.</div>';
        return;
    }
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start py-12">
            <div class="overflow-hidden">
                <img src="${p.image_url || 'https://via.placeholder.com/600x800'}" alt="${p.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex flex-col">
                <h1 class="text-5xl mb-4 tracking-tight" style="font-family: 'Playfair Display', serif; font-weight: 700;">${p.name}</h1>
                <div class="text-2xl mb-8" style="font-family: 'Playfair Display', serif;">${formatPrice(p.price)} DZ</div>
                <p class="text-base leading-relaxed mb-8 text-gray-700" style="font-family: 'Lora', serif;">${p.description || ''}</p>
                <div class="flex flex-col gap-4">
                    <button id="addSingle" class="px-8 py-4 bg-gray-900 text-white text-sm tracking-widest hover:bg-black transition">ADD TO CART</button>
                    <a href="index.html" class="text-sm tracking-widest text-gray-600 hover:text-gray-900 transition">BACK TO SHOP</a>
                </div>
            </div>
        </div>
        `;

    const addSingleBtn = document.getElementById('addSingle');
    if (addSingleBtn) {
        addSingleBtn.addEventListener('click', () => {
            addToCart(p);
            alert('Added to cart');
        });
    }
}

// admin CRUD functions
async function adminCreateProduct(payload) {
    const { data, error } = await supabase.from('products').insert([payload]).select().single();
    if (error) {
        console.error('Error creating product', error);
        alert('Error: ' + error.message);
        return null;
    }
    alert('Product created successfully');
    return data;
}

async function adminUpdateProduct(id, payload) {
    const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single();
    if (error) {
        console.error('Error updating product', error);
        alert('Error: ' + error.message);
        return null;
    }
    alert('Product updated successfully');
    return data;
}

async function adminDeleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
        console.error('Error deleting product', error);
        alert('Error: ' + error.message);
        return;
    }
    alert('Product deleted successfully');
}

// Generate sample products dynamically
async function generateSampleProducts() {
    const sampleProducts = [
        {
            name: 'Classic Denim Jacket',
            description: 'Timeless denim jacket, unisex fit. Perfect for any season.',
            price: 79.99,
            image_url: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop'
        },
        {
            name: 'Striped Cotton Shirt',
            description: 'Lightweight, breathable cotton shirt with classic stripes.',
            price: 39.50,
            image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop'
        },
        {
            name: 'Pleated Midi Skirt',
            description: 'Elegant midi skirt with pleats. Great for work or casual wear.',
            price: 49.00,
            image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop'
        },
        {
            name: 'Wool Overcoat',
            description: 'Premium wool overcoat perfect for cold winters. Timeless style.',
            price: 149.00,
            image_url: 'https://images.unsplash.com/photo-1539533057440-7cf90b2bbb28?w=500&h=500&fit=crop'
        },
        {
            name: 'Leather Ankle Boots',
            description: 'Comfortable leather ankle boots with premium craftsmanship.',
            price: 129.99,
            image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop'
        },
        {
            name: 'Vintage Graphic Tee',
            description: 'Soft cotton tee with unique vintage-inspired print.',
            price: 24.00,
            image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'
        }
    ];

    const { data, error } = await supabase.from('products').insert(sampleProducts);
    if (error) {
        console.error('Error generating samples', error);
        alert('Error: ' + error.message);
        return;
    }
    alert('Sample products created successfully!');
}

// Get product ID from URL query parameter
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Initialize product detail page
async function initProductDetail() {
    const productId = getProductIdFromUrl();
    if (!productId) {
        console.error('No product ID found in URL');
        return;
    }

    const product = await fetchProductById(productId);
    if (product) {
        renderProductDetail(product);
    } else {
        const container = document.getElementById('productDetail');
        if (container) {
            container.innerHTML = '<div class="text-center py-12 text-gray-600">Product not found.</div>';
        }
    }
}

console.log('✅ app.js loaded with Telegram integration');
console.log('📱 Test Telegram: run testTelegramBot() in console');