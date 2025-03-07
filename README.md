# EasonAI温哥华食品烟草商城

一个简单美观的电子商务网站，专注于食品和烟草产品的销售。该网站采用现代化的设计风格，提供流畅的用户体验和智能的购物助手。

## 功能特点

- 🛍️ 商品展示
  - 分类浏览
  - 搜索功能
  - 商品详情
  - 价格筛选
  - 评分系统

- 🛒 购物功能
  - 购物车管理
  - 订单处理
  - 支付集成
  - 物流跟踪

- 👥 用户服务
  - 多语言支持
  - AI 购物助手
  - 在线客服
  - 订单管理

- 📱 响应式设计
  - 移动端适配
  - 平板适配
  - 桌面端优化

## 技术栈

- 前端
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Font Awesome 图标
  - Google Maps API

- 资源
  - CDN 加速
  - 图片优化
  - 缓存策略

## 项目结构

```
vancouver-store/
├── index.html              # 首页
├── products.html           # 商品列表页
├── product-detail.html     # 商品详情页
├── cart.html              # 购物车页面
├── checkout.html          # 结算页面
├── order-success.html     # 订单成功页面
├── orders.html            # 订单列表页面
├── order-detail.html      # 订单详情页面
├── logistics.html         # 物流信息页面
├── about.html             # 关于我们页面
├── contact.html           # 联系我们页面
├── css/
│   └── style.css         # 主样式文件
├── js/
│   ├── main.js           # 主要脚本文件
│   ├── products.js       # 商品相关脚本
│   ├── cart.js           # 购物车脚本
│   ├── checkout.js       # 结算脚本
│   ├── orders.js         # 订单相关脚本
│   └── logistics.js      # 物流相关脚本
└── images/               # 图片资源目录
```

## 运行说明

1. 克隆项目
```bash
git clone https://github.com/Eason0831/EasonAI-WEB-Design.git
```

2. 进入项目目录
```bash
cd vancouver-store
```

3. 使用本地服务器运行项目
```bash
# 使用 Python 的简单 HTTP 服务器
python -m http.server 8000

# 或使用 Node.js 的 http-server
npx http-server
```

4. 在浏览器中访问
```
http://localhost:8000
```

## 开发说明

- 所有页面都采用响应式设计，适配各种设备
- 使用 CDN 加载外部资源，提高加载速度
- 采用模块化的 JavaScript 代码组织
- 统一的样式主题和交互体验

## 注意事项

- 需要配置 Google Maps API 密钥才能使用地图功能
- 需要配置支付网关才能使用支付功能
- 需要配置后端 API 才能使用完整功能
- 图片资源需要替换为实际商品图片

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

- 邮箱：wrz8611551@gmail.com
- 电话：+1 (778) 955-1699
- 地址：EasonAI王奕杰
- 微信：easonw831
