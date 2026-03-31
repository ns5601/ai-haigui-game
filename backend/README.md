# AI对话后端服务

Node.js + Express后端服务，提供AI对话接口。

## 功能

- ✅ 基础Express服务器
- ✅ CORS配置（允许前端访问）
- ✅ 测试接口 GET `/api/test`
- ✅ AI对话接口 POST `/api/chat`

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env`：
```bash
cp .env.example .env
```

编辑 `.env` 文件，设置您的DeepSeek API密钥：
```
DEEPSEEK_API_KEY=your_actual_api_key_here
```

### 3. 启动服务器
```bash
npm start          # 生产环境
npm run dev       # 开发环境（热重载）
```

服务器将在 http://localhost:3000 启动。

## API接口

### GET `/api/test`
测试服务器是否正常运行。

**响应示例：**
```json
{
  "message": "Server is working!",
  "timestamp": "2026-03-24T01:56:59.186Z",
  "status": "success"
}
```

### POST `/api/chat`
AI对话接口。

**请求体：**
```json
{
  "question": "故事的主要内容是什么？",
  "story": {
    "id": 1,
    "title": "故事标题",
    "content": "故事内容...",
    "characters": ["角色1", "角色2"]
  }
}
```

**响应示例（成功）：**
```json
{
  "success": true,
  "answer": "根据故事内容，...",
  "question": "故事的主要内容是什么？",
  "story_id": 1
}
```

**响应示例（错误）：**
```json
{
  "error": "Missing required fields: question and story are required"
}
```

## 错误处理

接口包含完整的错误处理：

1. **参数验证** - 确保`question`和`story`字段存在
2. **API密钥检查** - 验证DeepSeek API密钥已配置
3. **API调用错误** - 处理DeepSeek API的各种错误响应
4. **网络错误** - 处理服务不可用情况

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DEEPSEEK_API_KEY` | DeepSeek API密钥 | 无（必须设置） |
| `PORT` | 服务器端口 | 3000 |
| `CORS_ORIGIN` | CORS允许的来源 | `*`（允许所有） |

## 开发

### 项目结构
```
backend/
├── index.js          # 主服务器文件
├── package.json      # 依赖配置
├── .env              # 环境变量（不提交到版本控制）
├── .env.example      # 环境变量示例
└── README.md         # 本文档
```

### 脚本
- `npm start` - 启动生产服务器
- `npm run dev` - 启动开发服务器（使用nodemon热重载）
- `npm test` - 运行测试（暂无）

## 注意事项

1. **API密钥安全**：确保`.env`文件不提交到版本控制系统
2. **CORS配置**：生产环境建议设置具体的`CORS_ORIGIN`
3. **错误日志**：服务器错误会输出到控制台
4. **API限制**：注意DeepSeek API的调用频率和配额限制