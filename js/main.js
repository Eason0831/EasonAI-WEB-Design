// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化轮播图
    initSwipers();
    
    // 初始化产品快速查看
    initQuickView();
    
    // 初始化购物车功能
    initCart();
    
    // 初始化AI聊天助手
    initChatAssistant();
    
    // 初始化语言切换
    initLanguageSwitch();
});

// 初始化所有Swiper轮播组件
function initSwipers() {
    // 首页主轮播图
    const heroSwiper = new Swiper('.hero-slider .swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.hero-slider .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.hero-slider .swiper-button-next',
            prevEl: '.hero-slider .swiper-button-prev',
        },
    });
    
    // 顾客评价轮播
    const testimonialSwiper = new Swiper('.testimonial-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.testimonial-slider .swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
    });
}

// 初始化产品快速查看功能
function initQuickView() {
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            showQuickViewModal(productId);
        });
    });
}

// 显示产品快速查看模态框
function showQuickViewModal(productId) {
    // 模拟从API获取产品数据
    const productData = getProductData(productId);
    
    // 创建模态框HTML
    const modalHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">产品快速查看</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${productData.image}" alt="${productData.name}" class="img-fluid">
                        </div>
                        <div class="col-md-6">
                            <h3>${productData.name}</h3>
                            <div class="product-rating mb-2">
                                ${generateRatingStars(productData.rating)}
                                <span>(${productData.reviews})</span>
                            </div>
                            <div class="product-price mb-3">
                                <span class="current-price">$${productData.price.toFixed(2)}</span>
                                ${productData.oldPrice ? `<span class="old-price">$${productData.oldPrice.toFixed(2)}</span>` : ''}
                            </div>
                            <p class="mb-4">${productData.shortDescription}</p>
                            <div class="product-quantity mb-3">
                                <label>数量:</label>
                                <div class="quantity-input">
                                    <button class="quantity-down">-</button>
                                    <input type="number" value="1" min="1" max="99">
                                    <button class="quantity-up">+</button>
                                </div>
                            </div>
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary add-to-cart-btn" data-product-id="${productId}">
                                    <i class="fas fa-shopping-cart me-2"></i>加入购物车
                                </button>
                                <a href="product-detail.html?id=${productId}" class="btn btn-outline-primary">
                                    查看详情
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 检查是否已有模态框，如果有则移除
    let quickViewModal = document.getElementById('quickViewModal');
    if (quickViewModal) {
        quickViewModal.remove();
    }
    
    // 创建新模态框
    quickViewModal = document.createElement('div');
    quickViewModal.id = 'quickViewModal';
    quickViewModal.className = 'modal fade';
    quickViewModal.tabIndex = '-1';
    quickViewModal.innerHTML = modalHTML;
    document.body.appendChild(quickViewModal);
    
    // 初始化数量选择器
    quickViewModal.addEventListener('shown.bs.modal', function() {
        initQuantityInput(quickViewModal);
        
        // 添加加入购物车按钮事件
        const addToCartBtn = quickViewModal.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quickViewModal.querySelector('.quantity-input input').value);
            addToCart(productId, quantity);
            const modal = bootstrap.Modal.getInstance(quickViewModal);
            modal.hide();
        });
    });
    
    // 显示模态框
    const modal = new bootstrap.Modal(quickViewModal);
    modal.show();
}

// 初始化数量选择器
function initQuantityInput(container) {
    const quantityInputs = container.querySelectorAll('.quantity-input');
    
    quantityInputs.forEach(wrapper => {
        const input = wrapper.querySelector('input');
        const downBtn = wrapper.querySelector('.quantity-down');
        const upBtn = wrapper.querySelector('.quantity-up');
        
        downBtn.addEventListener('click', function() {
            const currentValue = parseInt(input.value);
            if (currentValue > parseInt(input.min)) {
                input.value = currentValue - 1;
            }
        });
        
        upBtn.addEventListener('click', function() {
            const currentValue = parseInt(input.value);
            if (currentValue < parseInt(input.max)) {
                input.value = currentValue + 1;
            }
        });
        
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            const min = parseInt(this.min);
            const max = parseInt(this.max);
            
            if (isNaN(value) || value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
            }
        });
    });
}

// 生成星级评分HTML
function generateRatingStars(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// 模拟获取产品数据（实际项目中应从API获取）
function getProductData(productId) {
    const products = {
        '1': {
            id: 1,
            name: '意大利特级初榨橄榄油',
            price: 29.99,
            oldPrice: 35.99,
            image: 'https://via.placeholder.com/500x500?text=Product1',
            rating: 4.5,
            reviews: 42,
            shortDescription: '来自意大利托斯卡纳地区的特级初榨橄榄油，纯净天然，富含多酚和抗氧化剂，口感醇厚，适合生食和烹饪。'
        },
        '2': {
            id: 2,
            name: '日本高级和牛',
            price: 199.99,
            oldPrice: null,
            image: 'https://via.placeholder.com/500x500?text=Product2',
            rating: 5,
            reviews: 127,
            shortDescription: 'A5级日本和牛，肉质鲜嫩多汁，大理石纹理丰富，入口即化，是高端烤肉和料理的理想选择。'
        },
        '3': {
            id: 3,
            name: '古巴雪茄礼盒装',
            price: 89.99,
            oldPrice: 119.99,
            image: 'https://via.placeholder.com/500x500?text=Product3',
            rating: 4,
            reviews: 38,
            shortDescription: '精选古巴顶级雪茄，采用传统手工卷制，口感醇厚，香气持久，高贵典雅的礼盒包装，是送礼的上佳选择。'
        },
        '4': {
            id: 4,
            name: '法国顶级红酒珍藏',
            price: 299.99,
            oldPrice: null,
            image: 'https://via.placeholder.com/500x500?text=Product4',
            rating: 4.5,
            reviews: 52,
            shortDescription: '来自法国波尔多地区的顶级红酒，采用传统酿造工艺，陈年15年以上，口感丰富复杂，余味悠长。'
        }
    };
    
    return products[productId] || products['1'];
}

// 初始化购物车功能
function initCart() {
    // 获取所有加入购物车按钮
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            addToCart(productId, 1);
        });
    });
    
    // 更新购物车数量显示
    updateCartBadge();
}

// 添加商品到购物车
function addToCart(productId, quantity) {
    // 从本地存储获取购物车
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 检查商品是否已在购物车中
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // 如果已存在，增加数量
        cart[existingItemIndex].quantity += quantity;
    } else {
        // 如果不存在，添加新商品
        const productData = getProductData(productId);
        cart.push({
            id: productId,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            quantity: quantity
        });
    }
    
    // 保存到本地存储
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 更新购物车图标数量
    updateCartBadge();
    
    // 显示成功消息
    showToast('商品已成功加入购物车！');
}

// 更新购物车图标上的数量
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartBadge = document.querySelector('.fa-shopping-cart + .badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// 显示提示消息
function showToast(message) {
    // 检查是否已有toast容器
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // 创建toast元素
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">提示</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // 初始化并显示toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    // 自动移除toast元素
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

// 初始化AI聊天助手
function initChatAssistant() {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatMinimizeBtn = document.getElementById('chat-minimize-btn');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    
    // 切换聊天窗口显示状态
    chatToggleBtn.addEventListener('click', function() {
        if (chatWindow.style.display === 'flex') {
            chatWindow.style.display = 'none';
        } else {
            chatWindow.style.display = 'flex';
            chatInput.focus();
            
            // 移除通知徽章
            const badge = this.querySelector('.notification-badge');
            if (badge) {
                badge.style.display = 'none';
            }
        }
    });
    
    // 最小化聊天窗口
    chatMinimizeBtn.addEventListener('click', function() {
        chatWindow.style.display = 'none';
    });
    
    // 发送消息
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        // 添加用户消息
        addMessage(message, 'user');
        
        // 清空输入框
        chatInput.value = '';
        
        // 模拟AI回复
        setTimeout(() => {
            const aiResponse = generateAIResponse(message);
            addMessage(aiResponse, 'ai');
        }, 1000);
    }
    
    // 点击发送按钮发送消息
    chatSendBtn.addEventListener('click', sendMessage);
    
    // 按回车键发送消息
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // 添加消息到聊天窗口
    function addMessage(text, sender) {
        const messageHTML = `
            <div class="message ${sender}-message">
                <div class="message-avatar">
                    <img src="https://via.placeholder.com/40x40?text=${sender === 'ai' ? 'AI' : 'You'}" alt="${sender === 'ai' ? 'AI助手' : '您'}">
                </div>
                <div class="message-content">
                    <p>${text}</p>
                </div>
            </div>
        `;
        
        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 模拟AI回复（实际项目中应使用后端AI接口）
    function generateAIResponse(message) {
        // 简单的关键词匹配回复
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('你好') || lowerMsg.includes('嗨') || lowerMsg.includes('hi')) {
            return '您好！有什么可以帮到您的吗？';
        } else if (lowerMsg.includes('价格') || lowerMsg.includes('多少钱')) {
            return '我们有各种价位的产品，您可以在产品页面查看具体价格，或者告诉我您想了解哪类产品的价格范围？';
        } else if (lowerMsg.includes('配送') || lowerMsg.includes('送货')) {
            return '我们在温哥华市区提供当日送达服务，其他地区通常1-3个工作日送达。订单满$100免运费！';
        } else if (lowerMsg.includes('退货') || lowerMsg.includes('退款')) {
            return '我们提供30天无理由退货服务。未开封的商品可全额退款，已开封的商品根据具体情况处理。您可以在"我的订单"中申请退货。';
        } else if (lowerMsg.includes('推荐') || lowerMsg.includes('建议')) {
            return '根据客户喜好，我推荐您尝试我们的日本和牛和意大利进口橄榄油，这是我们的明星产品，顾客评价非常高！';
        } else {
            return '感谢您的咨询！您的问题很重要，我需要更多信息来帮助您。您能否提供更多细节，或者您可以直接联系我们的客服电话：+1 (604) 123-4567。';
        }
    }
}

// 初始化语言切换
function initLanguageSwitch() {
    const languageLinks = document.querySelectorAll('.language-switch a');
    
    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const language = this.getAttribute('data-lang');
            
            // 切换激活状态
            languageLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // 实际项目中，这里应该触发语言切换逻辑
            // changeLanguage(language);
            
            // 模拟语言切换效果
            showToast(`已切换到${language === 'zh' ? '中文' : 'English'}版本`);
        });
    });
} 