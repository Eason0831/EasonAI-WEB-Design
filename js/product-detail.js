// 商品详情页功能
document.addEventListener('DOMContentLoaded', () => {
    // 获取商品ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // 初始化图片轮播
    initImageCarousel();
    
    // 加载商品信息
    loadProductInfo();
    
    // 加载商品详情
    loadProductDetails();
    
    // 加载相关商品
    loadRelatedProducts();
});

// 初始化图片轮播
function initImageCarousel() {
    const carousel = document.querySelector('.product-carousel');
    const images = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    
    let currentIndex = 0;
    
    // 显示当前图片
    function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        images[index].classList.add('active');
        indicators[index].classList.add('active');
    }
    
    // 下一张图片
    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }
    
    // 上一张图片
    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }
    
    // 绑定事件
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    // 点击指示器切换图片
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            showImage(currentIndex);
        });
    });
    
    // 自动轮播
    setInterval(nextImage, 5000);
}

// 加载商品信息
async function loadProductInfo() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        // 从API获取商品信息
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();
        
        // 更新页面内容
        document.querySelector('.product-name').textContent = product.name;
        document.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;
        document.querySelector('.product-rating').innerHTML = `
            <div class="stars">
                ${generateStars(product.rating)}
            </div>
            <span>(${product.reviewCount} 条评价)</span>
        `;
        
        // 更新商品图片
        const carousel = document.querySelector('.product-carousel');
        carousel.innerHTML = `
            <div class="carousel-container">
                ${product.images.map((img, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${img}" alt="${product.name}">
                    </div>
                `).join('')}
            </div>
            <button class="carousel-prev">&lt;</button>
            <button class="carousel-next">&gt;</button>
            <div class="carousel-indicators">
                ${product.images.map((_, index) => `
                    <button class="carousel-indicator ${index === 0 ? 'active' : ''}"></button>
                `).join('')}
            </div>
        `;
        
        // 重新初始化轮播
        initImageCarousel();
        
        // 更新商品描述
        document.querySelector('.product-description').textContent = product.description;
        
        // 更新库存状态
        const stockStatus = document.querySelector('.stock-status');
        if (product.stock > 0) {
            stockStatus.textContent = `库存充足 (${product.stock}件)`;
            stockStatus.classList.add('in-stock');
        } else {
            stockStatus.textContent = '暂时缺货';
            stockStatus.classList.add('out-of-stock');
        }
        
        // 更新商品标签
        const tagsContainer = document.querySelector('.product-tags');
        tagsContainer.innerHTML = product.tags.map(tag => `
            <span class="tag">${tag}</span>
        `).join('');
        
    } catch (error) {
        console.error('加载商品信息失败:', error);
        showError('加载商品信息失败，请稍后重试');
    }
}

// 生成星级评分
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// 加载商品详情
async function loadProductDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        // 从API获取商品详情
        const response = await fetch(`/api/products/${productId}/details`);
        const details = await response.json();
        
        // 更新规格信息
        const specsContainer = document.querySelector('.product-specs');
        specsContainer.innerHTML = `
            <table>
                <tbody>
                    ${Object.entries(details.specifications).map(([key, value]) => `
                        <tr>
                            <th>${key}</th>
                            <td>${value}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        // 更新用户评价
        const reviewsContainer = document.querySelector('.product-reviews');
        reviewsContainer.innerHTML = details.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <img src="${review.userAvatar}" alt="${review.userName}">
                        <span>${review.userName}</span>
                    </div>
                    <div class="review-rating">
                        ${generateStars(review.rating)}
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.content}</p>
                    ${review.images ? `
                        <div class="review-images">
                            ${review.images.map(img => `
                                <img src="${img}" alt="用户评价图片">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="review-footer">
                    <span class="review-date">${formatDate(review.date)}</span>
                    <span class="review-helpful">
                        <i class="far fa-thumbs-up"></i>
                        ${review.helpfulCount} 有帮助
                    </span>
                </div>
            </div>
        `).join('');
        
        // 更新常见问题
        const faqContainer = document.querySelector('.product-faq');
        faqContainer.innerHTML = details.faq.map(item => `
            <div class="faq-item">
                <div class="faq-question">
                    <h3>${item.question}</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');
        
        // 绑定FAQ展开/收起事件
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
        
    } catch (error) {
        console.error('加载商品详情失败:', error);
        showError('加载商品详情失败，请稍后重试');
    }
}

// 加载相关商品
async function loadRelatedProducts() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        // 从API获取相关商品
        const response = await fetch(`/api/products/${productId}/related`);
        const relatedProducts = await response.json();
        
        // 更新相关商品列表
        const relatedContainer = document.querySelector('.related-products');
        relatedContainer.innerHTML = relatedProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.discount ? `
                        <span class="discount-badge">-${product.discount}%</span>
                    ` : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">
                        ${product.discount ? `
                            <span class="original-price">$${product.price.toFixed(2)}</span>
                            <span class="discount-price">$${(product.price * (1 - product.discount/100)).toFixed(2)}</span>
                        ` : `
                            <span>$${product.price.toFixed(2)}</span>
                        `}
                    </div>
                    <div class="product-rating">
                        ${generateStars(product.rating)}
                        <span>(${product.reviewCount})</span>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('加载相关商品失败:', error);
        showError('加载相关商品失败，请稍后重试');
    }
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 显示错误信息
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.querySelector('.product-info').prepend(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// 添加到购物车
function addToCart() {
    const quantity = parseInt(document.querySelector('.quantity-input').value);
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // 获取购物车数据
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 检查商品是否已在购物车中
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity: quantity
        });
    }
    
    // 更新购物车
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 更新购物车图标
    updateCartIcon();
    
    // 显示成功提示
    showSuccess('已添加到购物车');
}

// 更新购物车图标
function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// 显示成功提示
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.querySelector('.product-info').prepend(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// 初始化页面时更新购物车图标
document.addEventListener('DOMContentLoaded', updateCartIcon); 