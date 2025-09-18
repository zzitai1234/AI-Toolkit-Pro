# AI编程小助手前端

一个基于Vue3的AI编程助手聊天应用，帮助用户解答编程学习和求职面试相关的问题。

## 功能特性

- 🎯 聊天室界面，支持实时对话
- 🤖 AI助手回答编程相关问题
- 💬 用户消息显示在右侧，AI回复显示在左侧
- 🔄 基于SSE（Server-Sent Events）的实时通信
- 📱 响应式设计，适配不同屏幕尺寸
- 🎨 现代化的UI设计

## 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite 4
- **HTTP客户端**: Axios
- **通信方式**: Server-Sent Events (SSE)

## 项目结构

```
src/
├── components/
│   └── ChatRoom.vue      # 聊天室主组件
├── App.vue               # 根组件
├── main.js              # 应用入口
└── style.css            # 全局样式
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 3. 确保后端服务运行

确保SpringBoot后端服务在 `http://localhost:8081` 运行，并提供以下接口：

- `GET /api/ai/chat?memoryId={id}&message={message}` - SSE聊天接口

## 使用说明

1. 打开应用后会自动生成一个聊天室ID
2. 在输入框中输入您的问题
3. 按回车键或点击发送按钮发送消息
4. AI助手会通过SSE实时回复您的问题

## 构建生产版本

```bash
npm run build
```

## 注意事项

- 需要Node.js 18+版本
- 确保后端服务正常运行
- 支持跨域请求，如遇问题请检查后端CORS配置