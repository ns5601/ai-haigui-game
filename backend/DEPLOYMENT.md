# Railway 部署指南

## 1. 准备工作

### 1.1 获取DeepSeek API密钥
1. 访问 [DeepSeek平台](https://platform.deepseek.com/)
2. 注册/登录账户
3. 在API密钥页面创建新的API密钥
4. 复制API密钥

### 1.2 安装Railway CLI（可选）
```bash
npm i -g @railway/cli
```

## 2. 部署步骤

### 方法A：使用Railway Web界面（推荐）
1. 访问 [Railway.app](https://railway.app/)
2. 点击"New Project"
3. 选择"Deploy from GitHub repo"
4. 选择您的仓库和`backend`目录
5. Railway会自动检测配置并开始部署
6. 设置环境变量：
   - `DEEPSEEK_API_KEY`: 您的DeepSeek API密钥
   - `PORT`: 会自动设置，无需修改
7. 等待部署完成

### 方法B：使用Railway CLI
```bash
# 登录Railway
railway login

# 初始化项目
railway init

# 链接到现有项目或创建新项目
railway link

# 设置环境变量
railway variables set DEEPSEEK_API_KEY=your_actual_key_here

# 部署
railway up
```

## 3. 环境变量配置

### 必需的环境变量
- `DEEPSEEK_API_KEY`: DeepSeek API密钥

### 可选的环境变量
- `PORT`: 服务器端口（默认3000，Railway会自动分配）
- `NODE_ENV`: 环境模式（production/development）
- `CORS_ORIGIN`: CORS允许的域名（默认允许所有）

## 4. 验证部署

部署完成后，访问以下端点验证服务是否正常运行：

### 4.1 健康检查
```bash
curl https://your-railway-project.up.railway.app/api/test
```
**预期响应**:
```json
{
  "message": "Server is working!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "status": "success"
}
```

### 4.2 聊天API测试
```bash
curl -X POST https://your-railway-project.up.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "这是一个测试问题吗？",
    "storyId": "test-story",
    "context": {
      "storySurface": "测试故事开头"
    },
    "language": "zh"
  }'
```

## 5. 故障排除

### 常见问题

#### 5.1 部署失败：依赖安装错误
**症状**: 构建日志显示npm install失败
**解决方案**:
- 检查`package.json`中的依赖版本兼容性
- 确保Node.js版本兼容（推荐18+）
- 查看Railway日志获取详细错误信息

#### 5.2 API调用失败：401错误
**症状**: 聊天API返回401错误
**解决方案**:
- 检查`DEEPSEEK_API_KEY`环境变量是否正确设置
- 验证API密钥是否有足够的额度
- 在Railway控制台重新设置环境变量

#### 5.3 CORS错误
**症状**: 前端无法访问API，控制台显示CORS错误
**解决方案**:
- 检查前端请求的域名
- 在生产环境中设置具体的`CORS_ORIGIN`环境变量
- 或修改后端代码中的CORS配置

#### 5.4 服务无法启动
**症状**: 部署成功但服务无法运行
**解决方案**:
- 检查Railway日志：`railway logs`
- 验证端口配置（使用`process.env.PORT`）
- 确保入口文件为`index.js`

## 6. 监控和维护

### 6.1 查看日志
```bash
# 使用Railway CLI
railway logs

# 或通过Web界面查看
```

### 6.2 查看服务状态
```bash
railway status
```

### 6.3 重启服务
```bash
railway restart
```

### 6.4 更新环境变量
```bash
railway variables set KEY=VALUE
```

### 6.5 查看部署历史
在Railway Web界面的"Deployments"选项卡查看

## 7. 安全建议

1. **不要提交`.env`文件到Git**
   - 使用`.env.example`作为模板
   - 将`.env`添加到`.gitignore`

2. **保护API密钥**
   - 定期轮换API密钥
   - 使用环境变量存储密钥

3. **启用HTTPS**
   - Railway自动提供HTTPS
   - 前端应使用HTTPS连接

4. **设置适当的CORS策略**
   - 在生产环境中限制允许的域名
   - 避免使用`origin: '*'`

5. **监控API使用**
   - 定期检查DeepSeek API使用情况
   - 设置使用量告警

## 8. 性能优化

### 8.1 内存管理
- Railway提供自动缩放
- 监控内存使用情况
- 优化代码减少内存占用

### 8.2 响应时间
- 实现请求缓存
- 优化数据库查询（如果使用）
- 启用压缩

### 8.3 可用性
- 设置健康检查端点
- 实现错误重试机制
- 监控服务可用性

## 9. 更新部署

### 9.1 代码更新
1. 提交更改到GitHub
2. Railway会自动重新部署
3. 或在Railway控制台手动触发部署

### 9.2 依赖更新
1. 更新`package.json`中的依赖版本
2. 提交更改
3. Railway会自动重新安装依赖

### 9.3 配置更新
1. 更新`railway.toml`配置
2. 提交更改
3. Railway会应用新配置

## 10. 联系支持

如果遇到无法解决的问题：

1. **Railway支持**: 通过Railway Web界面联系
2. **DeepSeek支持**: 访问DeepSeek平台帮助中心
3. **项目问题**: 检查GitHub Issues或创建新Issue

---

**部署成功标志**:
- ✅ 健康检查端点返回成功
- ✅ 聊天API能正常响应
- ✅ Railway控制台显示"Deployed"状态
- ✅ 无错误日志
- ✅ 前端能成功连接后端API