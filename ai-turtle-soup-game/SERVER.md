# 后端服务器

这是一个用于 AI 海龟汤游戏的 Express 后端服务器，提供 AI 聊天 API 接口。

## 功能特性

- **RESTful API**：提供 `/api/chat` 接口处理 AI 对话
- **请求日志**：完整的请求/响应日志记录
- **错误处理**：结构化错误响应和全局错误处理
- **API 文档**：Swagger UI 集成 (`/api-docs`)
- **安全防护**：Helmet 安全头部、CORS、速率限制
- **健康检查**：`/health` 端点监控服务状态

## 环境配置

1. 复制环境变量文件：
   ```bash
   cp .env.example .env
   ```

2. 根据需要调整 `.env` 文件中的配置

## 安装依赖

```bash
npm install
```

## 运行开发服务器

### 仅运行后端服务器：
```bash
npm run dev:server
```

### 同时运行前端和后端（推荐）：
```bash
npm run dev:all
```

### 单独运行命令：
```bash
# 前端开发服务器
npm run dev

# 后端开发服务器
npm run start:dev
```

## 生产构建

```bash
# 构建前端
npm run build

# 构建后端
npm run build:server

# 启动生产服务器
npm start
```

## API 文档

启动服务器后，访问以下地址查看 API 文档：

- Swagger UI: http://localhost:3000/api-docs
- 健康检查: http://localhost:3000/health

## API 接口

### POST /api/chat

处理 AI 对话请求。

**请求体：**
```json
{
  "question": "故事中有死亡事件吗？",
  "storyId": "story_001",
  "context": {
    "confirmedFacts": ["有死亡事件"],
    "avoidedClues": ["与时间旅行无关"],
    "previousQuestions": ["故事中有死亡事件吗？"],
    "storyTheme": "mystery",
    "difficulty": "medium"
  },
  "language": "zh-CN"
}
```

**响应：**
```json
{
  "answer": "yes",
  "confidence": 0.85,
  "processingTime": 150,
  "source": "ai",
  "requestId": "req_123456"
}
```

## 错误处理

所有错误都返回标准 JSON 格式：

```json
{
  "error": "BadRequest",
  "message": "Missing required fields",
  "requestId": "req_123456",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/chat",
  "method": "POST"
}
```

## 日志

日志文件存储在 `logs/` 目录：
- `logs/error.log`：错误日志
- `logs/combined.log`：所有日志

## 项目结构

```
server/
├── index.ts              # 主服务器文件
├── utils/
│   └── errors.ts        # 错误处理工具
└── logs/                # 日志目录（自动创建）
```

## 配置说明

### 环境变量

- `PORT`：服务器端口（默认：3000）
- `NODE_ENV`：环境模式（development/production）
- `LOG_LEVEL`：日志级别（debug/info/warn/error）
- `CORS_ORIGIN`：允许的源（默认：前端开发服务器）
- `RATE_LIMIT_MAX_REQUESTS`：速率限制（默认：100次/15分钟）

## 开发说明

1. 后端服务器默认运行在 `http://localhost:3000`
2. 前端开发服务器配置了代理，将 `/api` 请求转发到后端
3. 修改后端代码后会自动重启（nodemon）
4. API 文档会根据 JSDoc 注释自动更新