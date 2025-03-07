// 订单成功页面功能
document.addEventListener('DOMContentLoaded', () => {
    // 获取订单ID
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    
    if (!orderId) {
        window.location.href = 'index.html';
        return;
    }
    
    // 加载订单信息
    loadOrderInfo(orderId);
    
    // 绑定事件
    bindEvents();
});

// 加载订单信息
async function loadOrderInfo(orderId) {
    try {
        // 从API获取订单信息
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
            throw new Error('获取订单信息失败');
        }
        
        const order = await response.json();
        
        // 更新页面显示
        updateOrderDisplay(order);
        
    } catch (error) {
        console.error('加载订单信息失败:', error);
        showError('加载订单信息失败，请稍后重试');
    }
}

// 更新订单显示
function updateOrderDisplay(order) {
    // 更新订单号
    const orderNumberElements = document.querySelectorAll('.order-number');
    orderNumberElements.forEach(element => {
        element.textContent = order.id;
    });
    
    // 更新支付方式
    const paymentMethodElement = document.querySelector('.payment-method');
    const paymentMethodMap = {
        'credit': '信用卡',
        'debit': '借记卡',
        'alipay': '支付宝',
        'wechat': '微信支付'
    };
    paymentMethodElement.textContent = paymentMethodMap[order.paymentMethod] || order.paymentMethod;
    
    // 更新订单金额
    const orderAmountElement = document.querySelector('.order-amount');
    orderAmountElement.textContent = `$${order.total.toFixed(2)}`;
    
    // 更新预计送达时间
    const deliveryDateElement = document.querySelector('.delivery-date');
    const deliveryDate = new Date(order.createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 预计3天后送达
    deliveryDateElement.textContent = formatDate(deliveryDate);
    
    // 更新查看订单按钮链接
    const viewOrderButton = document.querySelector('.view-order');
    viewOrderButton.href = `orders.html?id=${order.id}`;
}

// 格式化日期
function formatDate(date) {
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 绑定事件
function bindEvents() {
    // 查看订单按钮
    const viewOrderButton = document.querySelector('.view-order');
    viewOrderButton.addEventListener('click', (e) => {
        e.preventDefault();
        const orderId = document.querySelector('.order-number').textContent;
        window.location.href = `orders.html?id=${orderId}`;
    });
    
    // 继续购物按钮
    const continueShoppingButton = document.querySelector('.continue-shopping');
    continueShoppingButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'products.html';
    });
}

// 显示错误信息
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.querySelector('.success-container').prepend(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
} 