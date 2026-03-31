# AI海龟汤游戏 - 开发指南

## 项目概述

### 产品愿景
创建一个智能、互动性强的在线海龟汤游戏平台，让玩家能够随时随地与AI进行推理游戏，享受逻辑推理的乐趣。通过先进的AI技术，提供传统海龟汤游戏的数字化体验，降低游戏门槛，扩大受众群体。

### 游戏机制
海龟汤游戏分为：
- **汤面**：故事开头或谜面
- **汤底**：故事真相或谜底
- **游戏流程**：玩家通过提问推理真相，AI只能回答"是"、"否"、"无关"三种类型

### 核心价值
1. **智能化游戏体验**：AI作为游戏主持人，提供一致、公正的游戏体验
2. **丰富的游戏内容**：支持多样化海龟汤故事，持续更新游戏库
3. **学习与娱乐结合**：锻炼逻辑思维、推理能力和问题解决能力
4. **便捷的游戏方式**：无需真人主持，随时随地可玩

## 技术架构

### 技术栈
| 组件 | 技术选择 | 理由 |
|------|----------|------|
| **前端框架** | React 18 + TypeScript + Vite | 现代React生态，类型安全，快速构建 |
| **样式方案** | Tailwind CSS + shadcn/ui | 实用优先的CSS框架，组件库统一风格 |
| **状态管理** | Zustand | 轻量级状态管理，性能优于Context |
| **路由方案** | React Router (App Router风格) | 现代路由方案，支持嵌套路由 |
| **本地存储** | IndexedDB + LocalStorage | 离线优先，支持复杂数据存储 |
| **后端服务** | Vercel Edge Functions | 无服务器架构，降低运维复杂度 |
| **数据库** | Supabase PostgreSQL | 免费层可用，集成认证和实时功能 |
| **AI服务** | DeepSeek / Claude API | 中文理解能力强，成本可控 |

### 项目结构
```
ai-turtle-soup-game/
├── src/
│   ├── app/                    # App Router页面
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页/游戏大厅
│   │   ├── game/[id]/         # 游戏页面 (动态路由)
│   │   └── result/[id]/       # 结果页面
│   ├── components/
│   │   ├── ui/                # 基础UI组件 (shadcn/ui)
│   │   ├── game/              # 游戏相关组件
│   │   └── layout/            # 布局组件
│   ├── lib/                   # 业务逻辑库
│   │   ├── ai/                # AI相关逻辑
│   │   ├── storage/           # 存储管理
│   │   ├── game/              # 游戏逻辑
│   │   └── utils/             # 工具函数
│   ├── types/                 # TypeScript类型定义
│   ├── data/                  # 静态数据
│   ├── stores/               # Zustand状态存储
│   └── public/               # 静态资源
├── docs/                     # 文档
└── 配置文件
```

## 数据模型

### Story (海龟汤故事)
```typescript
interface Story {
  id: string;
  title: string;
  surface: string;           // 汤面 (故事开头)
  bottom: string;           // 汤底 (解决方案，客户端加密存储)
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;         // 分类: 'mystery', 'scifi', 'everyday', 'historical'
  tags: string[];
  estimatedTime: number;    // 预估完成时间 (分钟)
  hints: string[];          // 渐进式提示
}
```

### GameSession (游戏会话)
```typescript
interface GameSession {
  id: string;
  storyId: string;
  status: 'active' | 'completed' | 'abandoned' | 'paused';
  startTime: number;
  endTime?: number;
  questions: QuestionAnswer[]; // 问题-回答对
  hintsUsed: number;          // 使用提示次数
  solutionRevealed: boolean;  // 是否查看了汤底
  solved: boolean;            // 是否成功解决
  score?: number;             // 游戏得分
  localSaveId?: string;       // IndexedDB存储ID
  cloudSyncId?: string;       // 云同步ID (如果已同步)
}
```

### QuestionAnswer (问题回答)
```typescript
interface QuestionAnswer {
  id: string;
  question: string;
  answer: 'yes' | 'no' | 'irrelevant' | 'partial' | 'pending' | 'error';
  timestamp: number;
  processingTime?: number;    // AI处理时间 (ms)
  source?: 'ai' | 'rule-engine' | 'cache'; // 回答来源
}
```

### UserPreferences (用户偏好)
```typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  soundEnabled: boolean;
  hintsEnabled: boolean;     // 是否启用提示系统
  autoSave: boolean;         // 自动保存游戏进度
  difficultyPreference: 'easy' | 'medium' | 'hard' | 'adaptive';
  reduceAnimations: boolean; // 减少动画
  fontSize: 'small' | 'medium' | 'large';
  dataSaver: boolean;        // 数据节省模式 (减少AI调用)
}
```

## 核心功能流程

### 1. 游戏大厅 → 选择故事 → 游戏页面
- 显示故事列表，支持按难度筛选
- 点击卡片进入游戏页面
- 加载故事数据，初始化游戏会话

### 2. 提问回答流程
```
玩家输入问题 → 本地验证 → 检查缓存 →
→ 本地规则引擎处理（简单问题）
→ AI API调用（复杂问题）→ 解析回答 →
更新游戏状态 → 保存到本地存储 → 显示回答
```

### 3. 游戏结束流程
- 玩家选择"查看汤底"
- 验证游戏状态，显示完整汤底
- 计算游戏统计数据
- 保存游戏记录，显示结果页面

## 开发规范

### 代码风格
- **组件命名**：PascalCase (如 `GameCard.tsx`)
- **函数命名**：camelCase (如 `handleSubmit`)
- **常量命名**：UPPER_SNAKE_CASE (如 `API_ENDPOINT`)
- **类型定义**：以 `T` 开头 (如 `TStory`)
- **文件组织**：按功能模块组织，避免过深的嵌套

### 组件设计原则
1. **单一职责**：每个组件只负责一个明确的功能
2. **可复用性**：通用组件放在 `components/ui/` 目录
3. **Props接口**：明确组件Props类型，使用TypeScript接口
4. **状态管理**：组件内部状态优先使用useState，跨组件状态使用Zustand

### 样式规范
- **整体风格**：神秘悬疑，深蓝色调为主 (使用 `slate-900`)
- **强调色**：金色点缀 (使用 `amber-400`)
- **圆角**：统一使用 `rounded-lg`
- **阴影**：使用 `shadow-lg` 增强层次感
- **响应式**：优先移动端设计，使用Tailwind响应式工具类

### 开发注意事项
1. **保持代码简洁**：避免过度设计，优先实现核心功能
2. **组件可复用性**：设计通用组件，避免重复代码
3. **移动端优先**：确保所有功能在移动设备上正常工作
4. **渐进增强**：基础功能广泛兼容，高级功能现代浏览器
5. **性能优化**：关注加载速度和运行时性能
6. **安全第一**：API密钥使用环境变量，敏感数据加密存储
7. **文档完整性**：代码要有清晰注释，更新相关文档

## AI集成指南

### 安全架构
1. **不发送完整汤底**：使用故事ID + 服务端映射
2. **汤底哈希验证**：客户端计算哈希，服务端验证
3. **上下文限制**：只发送必要信息，不暴露完整故事细节
4. **回答类型限制**：严格限制AI输出格式为"是"、"否"、"无关"

### 安全Prompt模板
```typescript
const SAFE_PROMPT_TEMPLATE = `
你是一个海龟汤游戏的主持人，只能回答"是"、"否"、"部分相关"或"无关"。

游戏规则：
1. 玩家会提出关于故事真相的问题
2. 你只能根据故事真相回答
3. 不要透露任何故事细节
4. 不要解释你的推理过程
5. 只输出一个词：是、否、部分相关、或无关

故事信息：
- 故事主题：{theme}
- 难度级别：{difficulty}
- 故事开头：{surface}

当前问题：{question}

请回答（仅一个词）：
`;

// 注意：AI回答的中文需要映射到QuestionAnswer.answer的英文枚举值
// "是" → 'yes', "否" → 'no', "部分相关" → 'partial', "无关" → 'irrelevant'
```

### 本地规则引擎（离线后备）
```typescript
class RuleEngine {
  evaluate(question: string, context: GameContext): AnswerType {
    // 基于关键词的简单规则匹配
    const lowerQuestion = question.toLowerCase();
    // 实现关键词匹配逻辑
    return 'irrelevant'; // 默认回答
  }
}
```

## 版本控制与协作

### Git工作流
1. **分支策略**
   - `main`分支：生产环境代码，受保护分支
   - `develop`分支：开发集成分支
   - 功能分支：`feature/功能名称` (如 `feature/game-lobby`)
   - 修复分支：`fix/问题描述` (如 `fix/ai-response-error`)
   - 发布分支：`release/版本号` (如 `release/v1.0.0`)

2. **提交规范**
   - 使用语义化提交消息：
     ```
     feat: 添加游戏大厅页面
     fix: 修复AI回答缓存问题
     docs: 更新开发指南文档
     style: 调整按钮样式
     refactor: 重构游戏状态管理
     test: 添加游戏流程测试
     chore: 更新依赖包版本
     ```

3. **代码审查**
   - 所有PR需要至少一名开发者审查
   - 关注代码质量、安全性和性能
   - 确保测试覆盖核心功能
   - 保持代码风格一致性

### 协作工具
- **项目管理**：GitHub Projects / Trello
- **沟通工具**：Slack / Discord
- **文档协作**：GitHub Wiki / 项目docs目录
- **设计资源**：Figma设计稿链接（如有）

## 开发环境设置

### 1. 环境准备
```bash
# 安装Node.js (18.x或更高版本)
node --version

# 安装pnpm (推荐)
npm install -g pnpm
```

### 2. 项目初始化
```bash
# 创建项目
pnpm create vite ai-turtle-soup-game --template react-ts

# 进入项目目录
cd ai-turtle-soup-game

# 安装依赖
pnpm install

# 安装Tailwind CSS
pnpm add -D tailwindcss postcss autoprefixer
pnpx tailwindcss init -p

# 安装其他核心依赖
pnpm add react-router-dom zustand
pnpm add -D @types/react @types/react-dom typescript
```

### 3. 环境变量配置
创建 `.env.local` 文件：
```env
VITE_APP_TITLE=AI海龟汤游戏
VITE_API_ENDPOINT=https://api.example.com
VITE_AI_API_KEY=your_ai_api_key_here  # 不要提交到版本控制
```

### 4. 开发脚本
```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 运行测试
pnpm test

# 代码检查
pnpm lint
```

## 测试要求

### 功能测试
- [ ] **游戏流程测试**：完整走通游戏大厅→游戏页面→汤底页面流程
- [ ] **AI回答测试**：验证AI回答准确率，回答类型限制
- [ ] **离线功能测试**：测试本地规则引擎和缓存机制
- [ ] **响应式测试**：确保各种屏幕尺寸显示正常

### 性能测试
- [ ] **加载性能**：首屏加载时间 < 2秒
- [ ] **AI响应时间**：AI回答响应时间 < 3秒
- [ ] **内存使用**：监控内存使用，避免内存泄漏

### 兼容性测试
- [ ] **浏览器兼容**：Chrome、Firefox、Safari、Edge最新版本
- [ ] **移动端兼容**：iOS Safari、Android Chrome主流版本
- [ ] **PWA支持**：测试离线功能和安装到桌面

## 部署指南

### 生产环境架构
```
用户浏览器 → Cloudflare CDN → Vercel Edge → Supabase → AI API
```

### 部署步骤
1. **代码推送**：将代码推送到GitHub仓库
2. **Vercel部署**：连接GitHub仓库，自动部署到Vercel
3. **Supabase设置**：创建Supabase项目，初始化数据库
4. **环境变量配置**：在Vercel控制台设置生产环境变量
5. **域名配置**：绑定自定义域名，配置SSL证书

### 监控和维护
1. **错误监控**：集成Sentry监控前端错误
2. **性能监控**：使用Vercel Analytics监控性能指标
3. **成本监控**：监控AI API调用量和云服务费用
4. **定期更新**：保持依赖包更新，应用安全补丁
5. **日志管理**：关键操作记录日志，便于问题排查
6. **备份策略**：定期备份数据库，测试恢复流程

### 故障排除指南
#### 常见问题及解决方案
1. **AI服务不可用**
   - 检查API密钥是否正确
   - 验证网络连接和防火墙设置
   - 切换备用AI服务提供商

2. **数据库连接失败**
   - 检查Supabase连接配置
   - 验证数据库表结构和权限
   - 检查网络连接和SSL证书

3. **前端性能问题**
   - 使用Chrome DevTools分析性能瓶颈
   - 检查代码分割和懒加载配置
   - 优化图片和静态资源加载

4. **用户数据不同步**
   - 检查IndexedDB存储状态
   - 验证网络连接和同步机制
   - 实施数据冲突解决策略

## 安全注意事项

### API安全
- **API密钥管理**：AI API Key必须使用环境变量，严禁硬编码
- **HTTPS加密**：所有API调用必须使用HTTPS
- **输入验证**：服务器和客户端双重输入验证
- **频率限制**：实施API调用频率限制，防止滥用

### 数据安全
- **客户端加密**：敏感数据（如汤底）客户端加密存储
- **传输加密**：所有数据传输使用HTTPS
- **权限控制**：严格的API权限验证和访问控制
- **隐私保护**：支持匿名游玩，最小化数据收集

### 代码安全
- **依赖审计**：定期审计依赖包安全漏洞
- **代码审查**：严格执行代码审查流程
- **安全测试**：定期进行安全测试和渗透测试

## 开发优先级

### P0 (MVP必备)
1. 基础游戏大厅：故事列表显示和选择
2. 核心游戏页面：汤面显示、提问输入、AI回答、对话历史
3. 基础汤底页面：真相揭示和对话回顾
4. 本地规则引擎：离线支持和简单问题处理

### P1 (核心体验)
1. AI集成：DeepSeek/Claude API集成
2. 响应式设计：移动端优化
3. 本地存储：游戏进度保存和恢复
4. 基础测试：核心功能测试套件

### P2 (完整功能)
1. 用户系统：注册登录、游戏统计
2. 云同步：Supabase集成，跨设备同步
3. 高级功能：提示系统、成就系统、社交分享
4. 性能优化：代码分割、缓存优化、预加载

## 常见问题

### Q: 如何添加新的海龟汤故事？
A: 编辑 `src/data/stories.json` 文件，遵循Story数据模型。故事汤底需要客户端加密存储。

### Q: AI回答不准确怎么办？
A: 1) 优化Prompt模板；2) 增加上下文信息；3) 实施本地规则引擎后备；4) 收集用户反馈改进。

### Q: 如何测试离线功能？
A: 使用浏览器开发者工具模拟离线状态，或实际断开网络连接测试。

### Q: 项目如何扩展多语言支持？
A: 使用i18n库（如react-i18next），将文本内容提取到翻译文件，支持语言切换。

## 联系方式与资源

- **项目文档**：本项目docs目录下的所有文档
- **技术设计**：参考Tech_Design.md获取详细技术方案
- **产品需求**：参考PRD.md获取产品需求和用户故事
- **问题反馈**：通过GitHub Issues报告问题或提出建议