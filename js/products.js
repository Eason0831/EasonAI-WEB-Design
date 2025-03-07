// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化价格滑块
    initPriceSlider();
    
    // 初始化自定义复选框和单选框样式
    initCustomControls();
    
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // 如果URL中有分类参数，更新分类选择和标题
    if (categoryParam) {
        updateCategorySelection(categoryParam);
        updateCategoryTitle(categoryParam);
    }
    
    // 加载产品数据
    loadProducts();
    
    // 初始化过滤器事件监听
    initFilterEvents();
    
    // 初始化排序和视图切换
    initSortAndView();
});

// 初始化价格滑块
function initPriceSlider() {
    const priceSlider = document.getElementById('price-slider');
    if (!priceSlider) return;
    
    noUiSlider.create(priceSlider, {
        start: [0, 500],
        connect: true,
        step: 10,
        range: {
            'min': 0,
            'max': 500
        }
    });
    
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    
    // 更新价格显示
    priceSlider.noUiSlider.on('update', function(values, handle) {
        if (handle === 0) {
            priceMin.textContent = Math.round(values[0]);
        } else {
            priceMax.textContent = Math.round(values[1]);
        }
    });
    
    // 价格变化时过滤产品
    priceSlider.noUiSlider.on('change', function() {
        filterProducts();
    });
}

// 初始化自定义复选框和单选框样式
function initCustomControls() {
    // 这里可以添加自定义控件的初始化代码
    // 本示例中使用CSS实现，不需要额外的JavaScript
}

// 更新分类选择
function updateCategorySelection(category) {
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    
    // 取消选中"所有产品"
    const allProductsCheckbox = document.querySelector('input[name="category"][value="all"]');
    if (allProductsCheckbox) {
        allProductsCheckbox.checked = false;
    }
    
    // 选中对应分类
    categoryCheckboxes.forEach(checkbox => {
        if (checkbox.value === category) {
            checkbox.checked = true;
        }
    });
}

// 更新分类标题
function updateCategoryTitle(category) {
    const categoryTitle = document.getElementById('category-title');
    if (!categoryTitle) return;
    
    // 设置标题文字
    switch(category) {
        case 'food':
            categoryTitle.textContent = '食品';
            break;
        case 'tobacco':
            categoryTitle.textContent = '烟草';
            break;
        case 'beverage':
            categoryTitle.textContent = '饮料';
            break;
        case 'snacks':
            categoryTitle.textContent = '零食';
            break;
        default:
            categoryTitle.textContent = '所有产品';
    }
    
    // 更新面包屑
    const breadcrumbItem = document.querySelector('.breadcrumb-item.active');
    if (breadcrumbItem) {
        breadcrumbItem.textContent = categoryTitle.textContent;
    }
}

// 加载产品数据
function loadProducts() {
    // 在实际项目中，应该从API获取产品数据
    // 这里使用模拟数据
    const products = getProductsData();
    
    // 显示产品
    renderProducts(products);
    
    // 更新显示数量
    updateProductCount(products.length);
}

// 获取模拟产品数据
function getProductsData() {
    return [
        {
            id: 1,
            name: '意大利特级初榨橄榄油',
            price: 29.99,
            oldPrice: 35.99,
            image: 'https://via.placeholder.com/300x300?text=Product1',
            category: 'food',
            brand: 'brand1',
            rating: 4.5,
            reviews: 42,
            isNew: true,
            date: '2023-06-15'
        },
        {
            id: 2,
            name: '日本高级和牛',
            price: 199.99,
            oldPrice: null,
            image: 'https://via.placeholder.com/300x300?text=Product2',
            category: 'food',
            brand: 'brand2',
            rating: 5,
            reviews: 127,
            isNew: false,
            date: '2023-05-20'
        },
        {
            id: 3,
            name: '古巴雪茄礼盒装',
            price: 89.99,
            oldPrice: 119.99,
            image: 'https://via.placeholder.com/300x300?text=Product3',
            category: 'tobacco',
            brand: 'brand3',
            rating: 4,
            reviews: 38,
            isNew: false,
            date: '2023-04-10'
        },
        {
            id: 4,
            name: '法国顶级红酒珍藏',
            price: 299.99,
            oldPrice: null,
            image: 'https://via.placeholder.com/300x300?text=Product4',
            category: 'beverage',
            brand: 'brand4',
            rating: 4.5,
            reviews: 52,
            isNew: true,
            date: '2023-06-01'
        },
        {
            id: 5,
            name: '比利时手工松露巧克力',
            price: 45.99,
            oldPrice: null,
            image: 'https://via.placeholder.com/300x300?text=Product5',
            category: 'snacks',
            brand: 'brand1',
            rating: 4.7,
            reviews: 64,
            isNew: true,
            date: '2023-06-05'
        },
        {
            id: 6,
            name: '西班牙伊比利亚火腿',
            price: 159.99,
            oldPrice: 189.99,
            image: 'https://via.placeholder.com/300x300?text=Product6',
            category: 'food',
            brand: 'brand3',
            rating: 4.8,
            reviews: 41,
            isNew: false,
            date: '2023-03-15'
        },
        {
            id: 7,
            name: '苏格兰单一麦芽威士忌',
            price: 129.99,
            oldPrice: null,
            image: 'https://via.placeholder.com/300x300?text=Product7',
            category: 'beverage',
            brand: 'brand4',
            rating: 4.6,
            reviews: 78,
            isNew: false,
            date: '2023-02-20'
        },
        {
            id: 8,
            name: '瑞士高山巧克力礼盒',
            price: 55.99,
            oldPrice: 69.99,
            image: 'https://via.placeholder.com/300x300?text=Product8',
            category: 'snacks',
            brand: 'brand2',
            rating: 4.2,
            reviews: 37,
            isNew: false,
            date: '2023-05-10'
        },
        {
            id: 9,
            name: '澳大利亚优质牛排套装',
            price: 149.99,
            oldPrice: null,
            image: 'https://via.placeholder.com/300x300?text=Product9',
            category: 'food',
            brand: 'brand2',
            rating: 4.4,
            reviews: 53,
            isNew: true,
            date: '2023-06-02'
        },
        {
            id: 10,
            name: '阿拉斯加野生三文鱼',
            price: 79.99,
            oldPrice: 99.99,
            image: 'https://via.placeholder.com/300x300?text=Product10',
            category: 'food',
            brand: 'brand1',
            rating: 4.3,
            reviews: 29,
            isNew: false,
            date: '2023-04-25'
        },
        {
            id: 11,
            name: '荷兰进口奶酪礼盒',
            price: 49.99,
            oldPrice: null,
            image: 'https://via.placeholder.com/300x300?text=Product11',
            category: 'food',
            brand: 'brand3',
            rating: 4.1,
            reviews: 22,
            isNew: false,
            date: '2023-05-15'
        },
        {
            id: 12,
            name: '日本高级清酒套装',
            price: 69.99,
            oldPrice: 89.99,
            image: 'https://via.placeholder.com/300x300?text=Product12',
            category: 'beverage',
            brand: 'brand2',
            rating: 4.5,
            reviews: 45,
            isNew: true,
            date: '2023-06-10'
        }
    ];
}

// 渲染产品列表
function renderProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    // 清空容器
    container.innerHTML = '';
    
    // 检查视图模式
    const viewMode = document.querySelector('.view-mode button.active').getAttribute('data-view');
    const isGridView = viewMode === 'grid';
    
    // 遍历产品数据创建产品卡片
    products.forEach(product => {
        const productEl = isGridView ? 
            createProductGridItem(product) : 
            createProductListItem(product);
        
        container.appendChild(productEl);
    });
    
    // 初始化产品交互
    initProductInteractions();
}

// 创建网格视图产品卡片
function createProductGridItem(product) {
    const colEl = document.createElement('div');
    colEl.className = 'col-lg-4 col-md-6 mb-4';
    
    const productBadgeClass = product.isNew ? '' : product.oldPrice ? 'sale' : '';
    
    colEl.innerHTML = `
        <div class="product-card">
            ${product.isNew ? '<div class="product-badge">新品</div>' : 
              product.oldPrice ? '<div class="product-badge sale">促销</div>' : ''}
            <div class="product-thumbnail">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <button class="btn-quick-view" data-product-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-add-to-cart" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn-add-to-wishlist" data-product-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">
                    <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-rating">
                    ${generateRatingStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
            </div>
        </div>
    `;
    
    return colEl;
}

// 创建列表视图产品项
function createProductListItem(product) {
    const colEl = document.createElement('div');
    colEl.className = 'col-12 mb-4';
    
    colEl.innerHTML = `
        <div class="product-list-item">
            ${product.isNew ? '<div class="product-badge">新品</div>' : 
              product.oldPrice ? '<div class="product-badge sale">促销</div>' : ''}
            <div class="row align-items-center">
                <div class="col-md-3">
                    <div class="product-thumbnail">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="product-info">
                        <h3 class="product-title">
                            <a href="product-detail.html?id=${product.id}">${product.name}</a>
                        </h3>
                        <div class="product-rating mb-2">
                            ${generateRatingStars(product.rating)}
                            <span>(${product.reviews})</span>
                        </div>
                        <p class="product-desc">
                            ${getProductDescription(product.id)}
                        </p>
                    </div>
                </div>
                <div class="col-md-3 text-center text-md-end">
                    <div class="product-price mb-3">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="btn btn-primary btn-add-to-cart mb-2" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart me-2"></i>加入购物车
                    </button>
                    <button class="btn btn-outline-secondary btn-quick-view" data-product-id="${product.id}">
                        <i class="fas fa-eye me-2"></i>快速查看
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return colEl;
}

// 获取产品描述（模拟数据）
function getProductDescription(productId) {
    const descriptions = {
        '1': '来自意大利托斯卡纳地区的特级初榨橄榄油，纯净天然，富含多酚和抗氧化剂，口感醇厚，适合生食和烹饪。',
        '2': 'A5级日本和牛，肉质鲜嫩多汁，大理石纹理丰富，入口即化，是高端烤肉和料理的理想选择。',
        '3': '精选古巴顶级雪茄，采用传统手工卷制，口感醇厚，香气持久，高贵典雅的礼盒包装，是送礼的上佳选择。',
        '4': '来自法国波尔多地区的顶级红酒，采用传统酿造工艺，陈年15年以上，口感丰富复杂，余味悠长。',
        '5': '比利时传统工艺制作的松露巧克力，外酥内软，口感丝滑，精选顶级可可豆，甜而不腻，馥郁芬芳。',
        '6': '来自西班牙的顶级伊比利亚火腿，采用传统风干工艺，橡果饲养黑蹄猪，肉质细腻，口感鲜美，富含油脂香气。',
        '7': '苏格兰高地单一麦芽威士忌，陈年12年，琥珀色泽，带有蜂蜜、香草和橡木桶的复杂香气，回味悠长。',
        '8': '瑞士阿尔卑斯山区特产巧克力礼盒，包含多种口味，质地丝滑，入口即化，精美包装，适合送礼。',
        '9': '澳大利亚草饲牛排套装，包含肋眼、菲力和纽约客，肉质鲜嫩，风味十足，是高端烧烤的绝佳选择。',
        '10': '阿拉斯加野生捕捞三文鱼，肉质鲜美，富含欧米茄-3脂肪酸，低温处理，保持最佳口感和营养价值。',
        '11': '荷兰进口奶酪礼盒，包含高达奶酪、埃丹奶酪和蓝纹奶酪，风味独特，质地醇厚，适合各种场合享用。',
        '12': '日本顶级清酒套装，包含纯米大吟酿和特别纯米酒，酒体清澈，香气优雅，甘甜爽口，适合品鉴。'
    };
    
    return descriptions[productId] || '优质精选产品，满足您的高品质生活需求。';
}

// 初始化产品交互
function initProductInteractions() {
    // 获取所有快速查看按钮
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');
    
    // 获取所有加入购物车按钮
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    
    // 获取所有收藏按钮
    const wishlistButtons = document.querySelectorAll('.btn-add-to-wishlist');
    
    // 设置快速查看事件
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            showQuickViewModal(productId);
        });
    });
    
    // 设置加入购物车事件
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            addToCart(productId, 1);
        });
    });
    
    // 设置收藏事件
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            addToWishlist(productId);
            
            // 切换图标
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#e74c3c';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        });
    });
}

// 添加到收藏夹
function addToWishlist(productId) {
    // 从本地存储获取收藏夹数据
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // 检查是否已收藏
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        // 添加到收藏夹
        wishlist.push(productId);
        showToast('产品已添加到收藏夹！');
    } else {
        // 从收藏夹移除
        wishlist.splice(index, 1);
        showToast('产品已从收藏夹移除！');
    }
    
    // 保存到本地存储
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// 更新产品数量显示
function updateProductCount(visibleCount, totalCount) {
    const resultCount = document.getElementById('result-count');
    const totalCountEl = document.getElementById('total-count');
    
    if (resultCount) {
        resultCount.textContent = visibleCount;
    }
    
    if (totalCountEl) {
        totalCountEl.textContent = totalCount || visibleCount;
    }
}

// 初始化过滤器事件监听
function initFilterEvents() {
    // 获取所有过滤器输入元素
    const filterInputs = document.querySelectorAll('.filter-sidebar input');
    
    // 添加change事件监听
    filterInputs.forEach(input => {
        input.addEventListener('change', filterProducts);
    });
    
    // 清除过滤器按钮
    const clearButton = document.getElementById('clear-filters');
    if (clearButton) {
        clearButton.addEventListener('click', clearFilters);
    }
}

// 清除所有过滤器
function clearFilters() {
    // 重置分类
    const allCategoryCheckbox = document.querySelector('input[name="category"][value="all"]');
    if (allCategoryCheckbox) {
        allCategoryCheckbox.checked = true;
    }
    
    document.querySelectorAll('input[name="category"]:not([value="all"])').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 重置品牌
    const allBrandCheckbox = document.querySelector('input[name="brand"][value="all"]');
    if (allBrandCheckbox) {
        allBrandCheckbox.checked = true;
    }
    
    document.querySelectorAll('input[name="brand"]:not([value="all"])').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 重置评分
    const allRatingRadio = document.querySelector('input[name="rating"][value="all"]');
    if (allRatingRadio) {
        allRatingRadio.checked = true;
    }
    
    // 重置上架时间
    const allDateRadio = document.querySelector('input[name="date"][value="all"]');
    if (allDateRadio) {
        allDateRadio.checked = true;
    }
    
    // 重置价格滑块
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider && priceSlider.noUiSlider) {
        priceSlider.noUiSlider.set([0, 500]);
    }
    
    // 重新过滤产品
    filterProducts();
    
    // 更新URL（移除分类参数）
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    window.history.replaceState({}, '', url);
    
    // 更新页面标题
    const categoryTitle = document.getElementById('category-title');
    if (categoryTitle) {
        categoryTitle.textContent = '所有产品';
    }
    
    // 更新面包屑
    const breadcrumbItem = document.querySelector('.breadcrumb-item.active');
    if (breadcrumbItem) {
        breadcrumbItem.textContent = '产品目录';
    }
}

// 过滤产品
function filterProducts() {
    // 获取所有产品
    const allProducts = getProductsData();
    
    // 获取过滤条件
    const filters = {
        categories: getSelectedValues('category'),
        brands: getSelectedValues('brand'),
        rating: getSelectedValue('rating'),
        date: getSelectedValue('date'),
        price: getPriceRange()
    };
    
    // 应用过滤器
    const filteredProducts = allProducts.filter(product => {
        // 检查分类
        if (!filters.categories.includes('all') && !filters.categories.includes(product.category)) {
            return false;
        }
        
        // 检查品牌
        if (!filters.brands.includes('all') && !filters.brands.includes(product.brand)) {
            return false;
        }
        
        // 检查评分
        if (filters.rating !== 'all' && product.rating < parseInt(filters.rating)) {
            return false;
        }
        
        // 检查价格
        if (product.price < filters.price.min || product.price > filters.price.max) {
            return false;
        }
        
        // 检查上架时间
        if (filters.date !== 'all') {
            const today = new Date();
            const productDate = new Date(product.date);
            const diffDays = Math.ceil((today - productDate) / (1000 * 60 * 60 * 24));
            
            if (filters.date === 'new' && diffDays > 7) {
                return false;
            } else if (filters.date === 'week' && diffDays > 7) {
                return false;
            } else if (filters.date === 'month' && diffDays > 30) {
                return false;
            }
        }
        
        // 所有条件都满足
        return true;
    });
    
    // 应用排序
    const sortedProducts = sortProducts(filteredProducts);
    
    // 显示过滤后的产品
    renderProducts(sortedProducts);
    
    // 更新产品数量显示
    updateProductCount(sortedProducts.length, allProducts.length);
}

// 获取选定的过滤值（多选）
function getSelectedValues(name) {
    const values = [];
    const inputs = document.querySelectorAll(`input[name="${name}"]:checked`);
    
    inputs.forEach(input => {
        values.push(input.value);
    });
    
    return values.length > 0 ? values : ['all'];
}

// 获取选定的过滤值（单选）
function getSelectedValue(name) {
    const input = document.querySelector(`input[name="${name}"]:checked`);
    return input ? input.value : 'all';
}

// 获取价格范围
function getPriceRange() {
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider && priceSlider.noUiSlider) {
        const values = priceSlider.noUiSlider.get();
        return {
            min: parseFloat(values[0]),
            max: parseFloat(values[1])
        };
    }
    
    return { min: 0, max: 500 };
}

// 初始化排序和视图切换
function initSortAndView() {
    // 排序选择变化事件
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', filterProducts);
    }
    
    // 视图切换按钮
    const viewButtons = document.querySelectorAll('.view-mode button');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮上的active类
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // 添加active类到当前按钮
            this.classList.add('active');
            
            // 重新渲染产品列表
            filterProducts();
        });
    });
}

// 应用排序
function sortProducts(products) {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return products;
    
    const sortValue = sortSelect.value;
    const sortedProducts = [...products];
    
    switch(sortValue) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'latest':
            sortedProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'popular':
        default:
            sortedProducts.sort((a, b) => b.reviews - a.reviews);
            break;
    }
    
    return sortedProducts;
} 