// 订单列表页面功能
document.addEventListener('DOMContentLoaded', () => {
    // 加载订单列表
    loadOrders();
    
    // 绑定事件
    bindEvents();
});

// 加载订单列表
async function loadOrders(status = 'all') {
    try {
        // 从API获取订单列表
        const response = await fetch(`/api/orders?status=${status}`);
        if (!response.ok) {
            throw new Error('获取订单列表失败');
        }
        
        const orders = await response.json();
        
        // 渲染订单列表
        renderOrders(orders);
        
    } catch (error) {
        console.error('加载订单列表失败:', error);
        showError('加载订单列表失败，请稍后重试');
    }
}

// 渲染订单列表
function renderOrders(orders) {
    const container = document.querySelector('.orders-list');
    const noOrdersElement = document.querySelector('.no-orders');
    
    if (orders.length === 0) {
        container.style.display = 'none';
        noOrdersElement.style.display = 'block';
        return;
    }
    
    container.style.display = 'flex';
    noOrdersElement.style.display = 'none';
    
    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <span class="order-number">订单号：${order.id}</span>
                    <span class="order-date">下单时间：${formatDate(order.createdAt)}</span>
                </div>
                <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
            </div>
            
            <div class="order-content">
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" class="order-item-image">
                            <div class="order-item-info">
                                <div class="order-item-name">${item.name}</div>
                                <div class="order-item-price">$${item.price.toFixed(2)}</div>
                                <div class="order-item-quantity">数量：${item.quantity}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="order-summary">
                <div class="order-total">
                    总计：$${order.total.toFixed(2)}
                </div>
                <div class="order-actions">
                    <a href="order-detail.html?id=${order.id}" class="action-btn view-details">查看详情</a>
                    ${getOrderActions(order.status)}
                </div>
            </div>
        </div>
    `).join('');
}

// 获取订单状态文本
function getStatusText(status) {
    const statusMap = {
        'pending': '待付款',
        'processing': '处理中',
        'shipped': '已发货',
        'delivered': '已完成',
        'cancelled': '已取消'
    };
    return statusMap[status] || status;
}

// 获取订单操作按钮
function getOrderActions(status) {
    switch (status) {
        case 'pending':
            return `
                <button class="action-btn cancel-order" onclick="cancelOrder(this)">取消订单</button>
            `;
        case 'delivered':
            return `
                <button class="action-btn reorder" onclick="reorder(this)">再次购买</button>
            `;
        default:
            return '';
    }
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

// 绑定事件
function bindEvents() {
    // 订单状态筛选
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadOrders(button.dataset.status);
        });
    });
}

// 取消订单
async function cancelOrder(button) {
    if (!confirm('确定要取消这个订单吗？')) {
        return;
    }
    
    try {
        const orderCard = button.closest('.order-card');
        const orderId = orderCard.querySelector('.order-number').textContent.split('：')[1];
        
        const response = await fetch(`/api/orders/${orderId}/cancel`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error('取消订单失败');
        }
        
        // 更新订单状态
        const statusElement = orderCard.querySelector('.order-status');
        statusElement.className = 'order-status status-cancelled';
        statusElement.textContent = '已取消';
        
        // 移除操作按钮
        const actionsContainer = orderCard.querySelector('.order-actions');
        actionsContainer.innerHTML = `
            <a href="order-detail.html?id=${orderId}" class="action-btn view-details">查看详情</a>
        `;
        
        showSuccess('订单已取消');
        
    } catch (error) {
        console.error('取消订单失败:', error);
        showError('取消订单失败，请稍后重试');
    }
}

// 再次购买
async function reorder(button) {
    try {
        const orderCard = button.closest('.order-card');
        const orderId = orderCard.querySelector('.order-number').textContent.split('：')[1];
        
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

// 显示错误信息
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.querySelector('.orders-container').prepend(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// 显示成功信息
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.querySelector('.orders-container').prepend(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
} 