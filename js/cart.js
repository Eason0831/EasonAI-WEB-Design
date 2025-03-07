// 购物车功能
document.addEventListener('DOMContentLoaded', () => {
    // 加载购物车数据
    loadCartItems();
    
    // 绑定事件
    bindEvents();
});

// 加载购物车数据
async function loadCartItems() {
    try {
        // 从本地存储获取购物车数据
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            showEmptyCart();
            return;
        }
        
        // 获取商品详细信息
        const cartItems = await Promise.all(
            cart.map(async item => {
                const response = await fetch(`/api/products/${item.id}`);
                const product = await response.json();
                return {
                    ...product,
                    quantity: item.quantity
                };
            })
        );
        
        // 渲染购物车列表
        renderCartItems(cartItems);
        
        // 更新价格
        updatePrices(cartItems);
        
    } catch (error) {
        console.error('加载购物车失败:', error);
        showError('加载购物车失败，请稍后重试');
    }
}

// 显示空购物车
function showEmptyCart() {
    document.querySelector('.cart-empty').style.display = 'block';
    document.querySelector('.cart-items-list').style.display = 'none';
    document.querySelector('.cart-summary-details').style.display = 'none';
    document.querySelector('.cart-actions').style.display = 'none';
}

// 渲染购物车列表
function renderCartItems(items) {
    const container = document.querySelector('.cart-items-list');
    container.innerHTML = items.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                <button class="quantity-btn increase">+</button>
            </div>
            <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="cart-item-remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // 显示购物车内容
    document.querySelector('.cart-empty').style.display = 'none';
    document.querySelector('.cart-items-list').style.display = 'block';
    document.querySelector('.cart-summary-details').style.display = 'block';
    document.querySelector('.cart-actions').style.display = 'flex';
}

// 更新价格
function updatePrices(items) {
    // 计算商品小计
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 计算运费（订单满100免运费）
    const shipping = subtotal >= 100 ? 0 : 10;
    
    // 计算税费（12%）
    const tax = subtotal * 0.12;
    
    // 计算总计
    const total = subtotal + shipping + tax;
    
    // 更新显示
    document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.shipping').textContent = `$${shipping.toFixed(2)}`;
    document.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.total-price').textContent = `$${total.toFixed(2)}`;
    document.querySelector('.cart-total-price').textContent = `$${total.toFixed(2)}`;
}

// 绑定事件
function bindEvents() {
    // 数量增减按钮
    document.querySelector('.cart-items-list').addEventListener('click', (e) => {
        const item = e.target.closest('.cart-item');
        if (!item) return;
        
        const id = item.dataset.id;
        const input = item.querySelector('.quantity-input');
        const currentValue = parseInt(input.value);
        
        if (e.target.classList.contains('increase')) {
            input.value = currentValue + 1;
            updateItemQuantity(id, currentValue + 1);
        } else if (e.target.classList.contains('decrease')) {
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateItemQuantity(id, currentValue - 1);
            }
        }
    });
    
    // 数量输入框
    document.querySelector('.cart-items-list').addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const item = e.target.closest('.cart-item');
            const id = item.dataset.id;
            const newValue = parseInt(e.target.value);
            
            if (newValue > 0) {
                updateItemQuantity(id, newValue);
            }
        }
    });
    
    // 删除商品
    document.querySelector('.cart-items-list').addEventListener('click', (e) => {
        if (e.target.closest('.cart-item-remove')) {
            const item = e.target.closest('.cart-item');
            const id = item.dataset.id;
            removeItem(id);
        }
    });
    
    // 清空购物车
    document.querySelector('.clear-cart').addEventListener('click', () => {
        if (confirm('确定要清空购物车吗？')) {
            localStorage.removeItem('cart');
            loadCartItems();
        }
    });
    
    // 结算按钮
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            showError('购物车是空的');
            return;
        }
        
        // 跳转到结算页面
        window.location.href = 'checkout.html';
    });
}

// 更新商品数量
function updateItemQuantity(id, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === id);
    
    if (index !== -1) {
        cart[index].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
    }
}

// 删除商品
function removeItem(id) {
    if (confirm('确定要删除这个商品吗？')) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
    }
}

// 显示错误信息
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.querySelector('.cart-container').prepend(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
} 