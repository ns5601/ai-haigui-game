const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Express server is running. Use /api/test to test.');
});

// Chat endpoint - compatible with frontend API
app.post('/api/chat', async (req, res) => {
  try {
    const { question, storyId, context, language } = req.body;

    // Validate required fields
    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid required field: question must be a string'
      });
    }

    // Log request for debugging
    console.log('Chat request:', {
      question,
      storyId,
      language,
      context: context ? 'present' : 'missing'
    });

    // Check API key for real AI calls
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const useRealAI = apiKey && apiKey !== 'your_deepseek_api_key_here';

    if (useRealAI) {
      // Real AI call with DeepSeek
      const prompt = `你正在主持一个"海龟汤"（turtle soup）推理游戏。玩家需要通过提问来推理出故事真相。你只知道故事开头（汤面），不知道解决方案（汤底）。只能基于汤面中的明确信息或合理推断回答。

重要规则：
- 你只能基于故事开头（汤面）中的信息回答，不能透露解决方案（汤底）
- 如果汤面中没有明确提及，但可以合理推断，可以回答"yes"或"no"
- 如果问题直接询问汤底内容，回答"irrelevant"或"partial"，引导玩家问基于汤面的问题

故事开头（汤面）：${context?.storySurface || '无'}

玩家问题：${question}

请用以下JSON格式返回：
{
  "answer": "yes|no|partial|irrelevant",
  "confidence": 0.0到1.0之间的数字,
  "reasoning": "简要解释你的分类理由"
}`;

      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a game master for a mystery game. Classify questions into answer categories.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.3,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;

      try {
        const parsed = JSON.parse(aiResponse);
        // Validate response format
        if (['yes', 'no', 'partial', 'irrelevant'].includes(parsed.answer) &&
            typeof parsed.confidence === 'number') {
          return res.json({
            answer: parsed.answer,
            confidence: Math.max(0, Math.min(1, parsed.confidence)), // Clamp to 0-1
            reasoning: parsed.reasoning || '',
            suggestion: ''
          });
        }
      } catch (parseError) {
        console.warn('Failed to parse AI response as JSON, using fallback');
      }
    }

    // Mock AI response (fallback when no API key or parsing fails)
    const questionLower = question.toLowerCase();
    let answer = 'irrelevant';
    let confidence = 0.8;

    // Simple rule-based classification
    if (questionLower.includes('是') || questionLower.includes('对吗') || questionLower.includes('是不是')) {
      answer = Math.random() > 0.5 ? 'yes' : 'no';
    } else if (questionLower.includes('可能') || questionLower.includes('或许')) {
      answer = 'partial';
      confidence = 0.6;
    } else if (questionLower.length < 3) {
      answer = 'irrelevant';
      confidence = 0.9;
    }

    // Use context if available
    if (context && context.confirmedFacts) {
      const confirmedFacts = context.confirmedFacts || [];
      if (confirmedFacts.some(fact => questionLower.includes(fact.toLowerCase()))) {
        answer = 'yes';
        confidence = 0.9;
      }
    }

    // Generate suggestion based on answer type
    let suggestion = '';
    if (answer === 'partial') {
      suggestion = '这个问题部分相关，但不够具体。';
    } else if (answer === 'irrelevant') {
      suggestion = '这个问题与当前谜题无关。';
    }

    // Return formatted response
    res.json({
      answer,
      confidence,
      reasoning: '基于规则引擎的分类',
      suggestion
    });

  } catch (error) {
    console.error('Chat endpoint error:', error.message);

    // Handle different error types
    if (error.response) {
      // API error response
      res.status(error.response.status).json({
        error: 'AI API error',
        message: error.response.data?.error?.message || error.message,
        status: error.response.status
      });
    } else if (error.request) {
      // No response received - return mock response
      console.warn('AI service unavailable, returning mock response');
      res.json({
        answer: 'irrelevant',
        confidence: 0.5,
        reasoning: 'AI服务不可用',
        suggestion: '请检查网络连接'
      });
    } else {
      // Other errors
      console.error('Internal server error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});