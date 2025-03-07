// 订单详情页面功能
document.addEventListener('DOMContentLoaded', () => {
    // 获取订单ID
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    
    if (!orderId) {
        window.location.href = 'orders.html';
        return;
    }
    
    // 加载订单详情
    loadOrderDetail(orderId);
    
    // 绑定事件
    bindEvents();
});

// 加载订单详情
async function loadOrderDetail(orderId) {
    try {
        // 从API获取订单详情
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
            throw new Error('获取订单详情失败');
        }
        
        const order = await response.json();
        
        // 更新页面显示
        updateOrderDisplay(order);
        
    } catch (error) {
        console.error('加载订单详情失败:', error);
        showError('加载订单详情失败，请稍后重试');
    }
}

// 更新订单显示
function updateOrderDisplay(order) {
    // 更新订单状态
    updateOrderStatus(order.status);
    
    // 更新订单时间线
    updateOrderTimeline(order.timeline);
    
    // 更新订单商品
    updateOrderItems(order.items);
    
    // 更新收货信息
    updateShippingInfo(order.shipping);
    
    // 更新订单摘要
    updateOrderSummary(order);
    
    // 更新操作按钮
    updateOrderActions(order.status);
}

// 更新订单状态
function updateOrderStatus(status) {
    const statusMap = {
        'pending': {
            icon: 'fa-clock',
            color: '#f1c40f',
            text: '待付款',
            description: '请在30分钟内完成支付'
        },
        'processing': {
            icon: 'fa-cog',
            color: '#3498db',
            text: '处理中',
            description: '我们正在处理您的订单'
        },
        'shipped': {
            icon: 'fa-truck',
            color: '#2ecc71',
            text: '已发货',
            description: '您的订单已发出'
        },
        'delivered': {
            icon: 'fa-check-circle',
            color: '#2ecc71',
            text: '已完成',
            description: '感谢您的购买！'
        },
        'cancelled': {
            icon: 'fa-times-circle',
            color: '#e74c3c',
            text: '已取消',
            description: '订单已取消'
        }
    };
    
    const statusInfo = statusMap[status] || statusMap.pending;
    const statusElement = document.querySelector('.order-status');
    
    statusElement.innerHTML = `
        <i class="fas ${statusInfo.icon} status-icon" style="color: ${statusInfo.color}"></i>
        <div>
            <div class="status-text">${statusInfo.text}</div>
            <div class="status-description">${statusInfo.description}</div>
        </div>
    `;
}

// 更新订单时间线
function updateOrderTimeline(timeline) {
    const timelineContainer = document.querySelector('.order-timeline');
    
    timelineContainer.innerHTML = timeline.map(item => `
        <div class="timeline-item ${item.completed ? 'completed' : 'pending'}">
            <div class="timeline-content">
                <div class="timeline-title">${item.title}</div>
                <div class="timeline-date">${formatDate(item.date)}</div>
            </div>
        </div>
    `).join('');
}

// 更新订单商品
function updateOrderItems(items) {
    const itemsContainer = document.querySelector('.order-items');
    
    itemsContainer.innerHTML = items.map(item => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.name}" class="order-item-image">
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-price">$${item.price.toFixed(2)}</div>
                <div class="order-item-quantity">数量：${item.quantity}</div>
            </div>
        </div>
    `).join('');
}

// 更新收货信息
function updateShippingInfo(shipping) {
    const shippingContainer = document.querySelector('.shipping-info');
    
    shippingContainer.innerHTML = `
        <div class="shipping-detail">
            <p><strong>收货人：</strong>${shipping.name}</p>
            <p><strong>联系电话：</strong>${shipping.phone}</p>
            <p><strong>收货地址：</strong>${shipping.address}</p>
            <p><strong>城市：</strong>${shipping.city}</p>
            <p><strong>邮编：</strong>${shipping.postalCode}</p>
        </div>
    `;
}

// 更新订单摘要
function updateOrderSummary(order) {
    document.querySelector('.subtotal').textContent = `$${order.subtotal.toFixed(2)}`;
    document.querySelector('.shipping').textContent = `$${order.shipping.toFixed(2)}`;
    document.querySelector('.tax').textContent = `$${order.tax.toFixed(2)}`;
    document.querySelector('.total-price').textContent = `$${order.total.toFixed(2)}`;
}

// 更新订单操作按钮
function updateOrderActions(status) {
    const actionsContainer = document.querySelector('.order-actions');
    
    switch (status) {
        case 'pending':
            actionsContainer.innerHTML = `
                <button class="action-btn view-details">立即支付</button>
                <button class="action-btn cancel-order">取消订单</button>
            `;
            break;
        case 'processing':
            actionsContainer.innerHTML = `
                <a href="#" class="action-btn view-details">查看物流</a>
                <button class="action-btn cancel-order">取消订单</button>
            `;
            break;
        case 'shipped':
            actionsContainer.innerHTML = `
                <a href="#" class="action-btn view-details">查看物流</a>
            `;
            break;
        case 'delivered':
            actionsContainer.innerHTML = `
                <a href="#" class="action-btn view-details">查看物流</a>
                <button class="action-btn reorder">再次购买</button>
            `;
            break;
        case 'cancelled':
            actionsContainer.innerHTML = `
                <button class="action-btn reorder">再次购买</button>
            `;
            break;
    }
}

// 绑定事件
function bindEvents() {
    // 取消订单
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('cancel-order')) {
            cancelOrder();
        }
    });
    
    // 再次购买
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('reorder')) {
            reorder();
        }
    });
    
    // 查看物流
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-details')) {
            e.preventDefault();
            viewLogistics();
        }
    });
}

// 取消订单
async function cancelOrder() {
    if (!confirm('确定要取消这个订单吗？')) {
        return;
    }
    
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id');
        
        const response = await fetch(`/api/orders/${orderId}/cancel`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error('取消订单失败');
        }
        
        // 重新加载订单详情
        loadOrderDetail(orderId);
        
        showSuccess('订单已取消');
        
    } catch (error) {
        console.error('取消订单失败:', error);
        showError('取消订单失败，请稍后重试');
    }
}

// 再次购买
async function reorder() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id');
        
        // 获取订单详情
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
            throw new Error('获取订单详情失败');
        }
        
        const order = await response.json();
        
        // 添加到购物车
        const cart = order.items.map(item => ({
            id: item.id,
            quantity: item.quantity
        }));
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // 跳转到购物车页面
        window.location.href = 'cart.html';
        
    } catch (error) {
        console.error('再次购买失败:', error);
        showError('再次购买失败，请稍后重试');
    }
}

// 查看物流
function viewLogistics() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    
    // 跳转到物流页面
    window.location.href = `logistics.html?id=${orderId}`;
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 显示错误信息
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.querySelector('.order-detail-container').prepend(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// 显示成功信息
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.querySelector('.order-detail-container').prepend(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
} 