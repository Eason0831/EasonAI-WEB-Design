// 物流信息页面功能
document.addEventListener('DOMContentLoaded', () => {
    // 获取订单ID
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    
    if (!orderId) {
        window.location.href = 'orders.html';
        return;
    }
    
    // 加载物流信息
    loadLogisticsInfo(orderId);
    
    // 绑定事件
    bindEvents();
});

// 加载物流信息
async function loadLogisticsInfo(orderId) {
    try {
        // 从API获取物流信息
        const response = await fetch(`/api/orders/${orderId}/logistics`);
        if (!response.ok) {
            throw new Error('获取物流信息失败');
        }
        
        const logistics = await response.json();
        
        // 更新页面显示
        updateLogisticsDisplay(logistics);
        
    } catch (error) {
        console.error('加载物流信息失败:', error);
        showError('加载物流信息失败，请稍后重试');
    }
}

// 更新物流显示
function updateLogisticsDisplay(logistics) {
    // 更新物流基本信息
    document.querySelector('.tracking-number').textContent = logistics.trackingNumber;
    document.querySelector('.carrier').textContent = logistics.carrier;
    document.querySelector('.current-status').textContent = logistics.currentStatus;
    
    // 更新物流时间线
    updateLogisticsTimeline(logistics.timeline);
    
    // 更新收货信息
    updateShippingInfo(logistics.shipping);
    
    // 更新返回按钮链接
    const backButton = document.querySelector('.back-to-order');
    backButton.href = `order-detail.html?id=${logistics.orderId}`;
}

// 更新物流时间线
function updateLogisticsTimeline(timeline) {
    const timelineContainer = document.querySelector('.logistics-timeline');
    
    timelineContainer.innerHTML = timeline.map(item => `
        <div class="timeline-item ${item.completed ? 'completed' : 'pending'}">
            <div class="timeline-content">
                <div class="timeline-title">${item.title}</div>
                <div class="timeline-date">${formatDate(item.date)}</div>
                ${item.location ? `
                    <div class="timeline-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${item.location}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// 更新收货信息
function updateShippingInfo(shipping) {
    document.querySelector('.shipping-address').textContent = `
        ${shipping.address}
        ${shipping.city}
        ${shipping.postalCode}
    `;
    document.querySelector('.shipping-name').textContent = shipping.name;
    document.querySelector('.shipping-phone').textContent = shipping.phone;
    document.querySelector('.shipping-notes').textContent = shipping.notes || '无';
}

// 绑定事件
function bindEvents() {
    // 返回按钮
    const backButton = document.querySelector('.back-to-order');
    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id');
        window.location.href = `order-detail.html?id=${orderId}`;
    });
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
    
    document.querySelector('.logistics-container').prepend(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
} 