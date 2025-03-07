// 结算页面功能
document.addEventListener('DOMContentLoaded', () => {
    // 加载订单信息
    loadOrderInfo();
    
    // 绑定事件
    bindEvents();
    
    // 验证表单
    validateForm();
});

// 加载订单信息
async function loadOrderInfo() {
    try {
        // 从本地存储获取购物车数据
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }
        
        // 获取商品详细信息
        const orderItems = await Promise.all(
            cart.map(async item => {
                const response = await fetch(`/api/products/${item.id}`);
                const product = await response.json();
                return {
                    ...product,
                    quantity: item.quantity
                };
            })
        );
        
        // 渲染订单商品列表
        renderOrderItems(orderItems);
        
        // 更新价格
        updatePrices(orderItems);
        
    } catch (error) {
        console.error('加载订单信息失败:', error);
        showError('加载订单信息失败，请稍后重试');
    }
}

// 渲染订单商品列表
function renderOrderItems(items) {
    const container = document.querySelector('.order-items');
    container.innerHTML = items.map(item => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.name}" class="order-item-image">
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-price">$${item.price.toFixed(2)}</div>
                <div class="order-item-quantity">数量: ${item.quantity}</div>
            </div>
        </div>
    `).join('');
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
}

// 绑定事件
function bindEvents() {
    // 支付方式选择
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            method.classList.add('selected');
            validateForm();
        });
    });
    
    // 表单输入验证
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('input', validateForm);
    });
    
    // 提交订单
    const submitBtn = document.querySelector('.place-order-btn');
    submitBtn.addEventListener('click', submitOrder);
}

// 验证表单
function validateForm() {
    const formInputs = document.querySelectorAll('.form-input[required]');
    const paymentMethod = document.querySelector('.payment-method.selected');
    const submitBtn = document.querySelector('.place-order-btn');
    
    let isValid = true;
    
    // 验证必填字段
    formInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    // 验证支付方式
    if (!paymentMethod) {
        isValid = false;
    }
    
    // 更新提交按钮状态
    submitBtn.disabled = !isValid;
}

// 提交订单
async function submitOrder() {
    try {
        const submitBtn = document.querySelector('.place-order-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = '提交中...';
        
        // 获取表单数据
        const formData = {
            name: document.querySelector('input[type="text"]').value,
            phone: document.querySelector('input[type="tel"]').value,
            address: document.querySelector('input[type="text"]:nth-of-type(3)').value,
            city: document.querySelector('input[type="text"]:nth-of-type(4)').value,
            postalCode: document.querySelector('input[type="text"]:nth-of-type(5)').value,
            paymentMethod: document.querySelector('.payment-method.selected').dataset.method,
            note: document.querySelector('textarea').value,
            items: JSON.parse(localStorage.getItem('cart')) || []
        };
        
        // 提交订单到服务器
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('提交订单失败');
        }
        
        const result = await response.json();
        
        // 清空购物车
        localStorage.removeItem('cart');
        
        // 跳转到订单成功页面
        window.location.href = `order-success.html?id=${result.orderId}`;
        
    } catch (error) {
        console.error('提交订单失败:', error);
        showError('提交订单失败，请稍后重试');
        
        // 恢复提交按钮状态
        const submitBtn = document.querySelector('.place-order-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = '提交订单';
    }
}

// 显示错误信息
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.querySelector('.checkout-container').prepend(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
} 