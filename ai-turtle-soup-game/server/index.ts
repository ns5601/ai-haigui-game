import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Winston 日志配置
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
      ),
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// 确保日志目录存在
import fs from 'fs';
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// 自定义请求日志中间件
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // 记录请求开始
  logger.info('Request started', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // 响应完成后记录
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length'),
    });
  });

  next();
};

// 错误处理中间件
const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
  });

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    requestId: req.headers['x-request-id'] || 'unknown',
  });
};

// Swagger 配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI海龟汤游戏 API',
      version: '1.0.0',
      description: 'AI海龟汤游戏后端API文档',
      contact: {
        name: '开发团队',
        email: 'dev@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: '开发服务器',
      },
    ],
    components: {
      schemas: {
        AIRequest: {
          type: 'object',
          required: ['question', 'storyId', 'context'],
          properties: {
            question: {
              type: 'string',
              description: '玩家提出的问题',
              example: '故事中有死亡事件吗？',
            },
            storyId: {
              type: 'string',
              description: '故事ID',
              example: 'story_001',
            },
            context: {
              type: 'object',
              description: '游戏上下文',
              properties: {
                confirmedFacts: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '已确认的事实列表',
                  example: ['有死亡事件', '凶手是男性'],
                },
                avoidedClues: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '已排除的线索列表',
                  example: ['与时间旅行无关'],
                },
                previousQuestions: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '之前的问题列表',
                  example: ['故事中有死亡事件吗？', '凶手是男性吗？'],
                },
                storyTheme: {
                  type: 'string',
                  description: '故事主题',
                  example: 'mystery',
                },
                difficulty: {
                  type: 'string',
                  enum: ['easy', 'medium', 'hard'],
                  description: '故事难度',
                  example: 'medium',
                },
              },
            },
            language: {
              type: 'string',
              description: '语言代码',
              default: 'zh-CN',
              example: 'zh-CN',
            },
          },
        },
        AIResponse: {
          type: 'object',
          required: ['answer', 'confidence'],
          properties: {
            answer: {
              type: 'string',
              enum: ['yes', 'no', 'irrelevant', 'partial'],
              description: 'AI回答',
              example: 'yes',
            },
            confidence: {
              type: 'number',
              minimum: 0,
              maximum: 1,
              description: '置信度',
              example: 0.85,
            },
            processingTime: {
              type: 'number',
              description: '处理时间（毫秒）',
              example: 150,
            },
            source: {
              type: 'string',
              enum: ['ai', 'rule-engine', 'cache'],
              description: '回答来源',
              example: 'ai',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: '错误类型',
              example: 'Bad Request',
            },
            message: {
              type: 'string',
              description: '错误信息',
              example: 'Invalid request parameters',
            },
            requestId: {
              type: 'string',
              description: '请求ID',
              example: 'req_123456',
            },
          },
        },
      },
    },
  },
  apis: ['./server/routes/*.ts', './server/index.ts'], // 扫描路由文件
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// 中间件配置
app.use(helmet()); // 安全头部
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志
app.use(requestLogger);
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP限制100个请求
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// 请求ID中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('x-request-id', req.headers['x-request-id']);
  next();
});

// 健康检查端点
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// API路由
app.post('/api/chat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, storyId, context, language } = req.body;

    // 输入验证
    if (!question || !storyId || !context) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: question, storyId, context',
        requestId: req.headers['x-request-id'],
      });
    }

    if (typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Question must be a non-empty string',
        requestId: req.headers['x-request-id'],
      });
    }

    // 记录请求详情
    logger.info('AI chat request', {
      requestId: req.headers['x-request-id'],
      storyId,
      question,
      language,
      contextKeys: Object.keys(context),
    });

    // 模拟AI处理（实际项目会调用真实的AI服务）
    const startTime = Date.now();

    // 这里可以集成真实的AI服务，如 OpenAI、DeepSeek 等
    // 现在使用模拟响应
    const mockAnswer = getMockAIResponse(question, context);
    const processingTime = Date.now() - startTime;

    // 记录响应
    logger.info('AI chat response', {
      requestId: req.headers['x-request-id'],
      processingTime,
      answer: mockAnswer.answer,
      confidence: mockAnswer.confidence,
    });

    // 返回标准响应
    return res.json({
      answer: mockAnswer.answer,
      confidence: mockAnswer.confidence,
      processingTime,
      source: 'ai',
      requestId: req.headers['x-request-id'],
    });

  } catch (error) {
    return next(error);
  }
});

// 模拟AI响应函数（实际项目应替换为真实AI调用）
function getMockAIResponse(question: string, context: any): { answer: string; confidence: number } {
  const questionLower = question.toLowerCase();

  // 简单的规则引擎
  if (questionLower.includes('是') || questionLower.includes('对吗') || questionLower.includes('是不是')) {
    return Math.random() > 0.5
      ? { answer: 'yes', confidence: 0.8 + Math.random() * 0.2 }
      : { answer: 'no', confidence: 0.8 + Math.random() * 0.2 };
  }

  if (questionLower.includes('可能') || questionLower.includes('或许')) {
    return { answer: 'partial', confidence: 0.6 + Math.random() * 0.2 };
  }

  if (context?.confirmedFacts?.some((fact: string) => questionLower.includes(fact.toLowerCase()))) {
    return { answer: 'yes', confidence: 0.9 };
  }

  // 默认返回无关
  return { answer: 'irrelevant', confidence: 0.7 + Math.random() * 0.3 };
}

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404处理
app.use((req: Request, res: Response) => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.url,
    ip: req.ip,
  });

  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
    requestId: req.headers['x-request-id'],
  });
});

// 全局错误处理
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
  logger.info(`Health check at http://localhost:${PORT}/health`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;