import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Story, QuestionAnswer, AnswerType } from '../types/game';
import { AIService } from '../lib/ai/client';
import storiesData from '../data/stories.json';
import { cn, generateId } from '../lib/utils/helpers';

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuestionAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameSession, setGameSession] = useState({
    startTime: Date.now(),
    hintsUsed: 0,
    solved: false,
  });
  const [aiService] = useState(() => new AIService(true));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadStory = async () => {
      setLoading(true);
      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      const foundStory = storiesData.find(s => s.id === id) as Story | undefined;
      if (foundStory) {
        setStory(foundStory);
        // 初始化游戏会话
        setGameSession(prev => ({
          ...prev,
          startTime: Date.now(),
        }));
      } else {
        // 故事未找到，返回首页
        navigate('/');
      }
      setLoading(false);
    };

    loadStory();
  }, [id, navigate]);

  useEffect(() => {
    // 滚动到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [questions]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim() || isProcessing || !story) return;

    const questionText = currentQuestion.trim();
    setCurrentQuestion('');
    setIsProcessing(true);

    // 添加待处理的问题
    const pendingQuestion: QuestionAnswer = {
      id: generateId('q'),
      question: questionText,
      answer: 'pending',
      timestamp: Date.now(),
      source: 'ai',
    };

    setQuestions(prev => [...prev, pendingQuestion]);

    try {
      // 调用AI服务
      const response = await aiService.getAnswer({
        question: questionText,
        storyId: story.id,
        context: {
          confirmedFacts: questions.filter(q => q.answer === 'yes').map(q => q.question),
          avoidedClues: questions.filter(q => q.answer === 'no').map(q => q.question),
          previousQuestions: questions.map(q => q.question),
          storyTheme: story.category,
          difficulty: story.difficulty,
        },
        language: 'zh-CN',
      });

      // 更新问题回答
      setQuestions(prev =>
        prev.map(q =>
          q.id === pendingQuestion.id
            ? {
                ...q,
                answer: response.answer,
                processingTime: response.processingTime,
                confidence: response.confidence,
                source: response.source,
                cached: response.cached,
              }
            : q
        )
      );
    } catch (error) {
      console.error('获取AI回答失败:', error);
      // 更新为错误状态
      setQuestions(prev =>
        prev.map(q =>
          q.id === pendingQuestion.id
            ? { ...q, answer: 'error', processingTime: 0 }
            : q
        )
      );
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  };

  const handleRevealSolution = () => {
    if (!story) return;
    navigate(`/result/${story.id}`);
  };

  const handleGiveUp = () => {
    if (!story) return;
    if (window.confirm('确定要放弃当前游戏吗？你将无法继续提问。')) {
      navigate(`/result/${story.id}`);
    }
  };

  const handleUseHint = () => {
    if (!story) return;
    const hintIndex = gameSession.hintsUsed;
    if (hintIndex < story.hints.length) {
      const hint = story.hints[hintIndex];
      alert(`提示 ${hintIndex + 1}: ${hint}`);
      setGameSession(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
    } else {
      alert('没有更多提示了！');
    }
  };

  const getAnswerColor = (answer: AnswerType) => {
    switch (answer) {
      case 'yes': return 'bg-green-100 border-green-300 text-green-800';
      case 'no': return 'bg-red-100 border-red-300 text-red-800';
      case 'partial': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'irrelevant': return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'pending': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'error': return 'bg-gray-100 border-gray-300 text-gray-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getAnswerText = (answer: AnswerType) => {
    switch (answer) {
      case 'yes': return '是';
      case 'no': return '否';
      case 'partial': return '部分相关';
      case 'irrelevant': return '无关';
      case 'pending': return '思考中...';
      case 'error': return '回答失败';
      default: return '未知';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载游戏中...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">故事未找到</h2>
          <Button variant="primary" onClick={() => navigate('/')}>
            返回游戏大厅
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{story.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  story.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  story.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                )}>
                  {story.difficulty === 'easy' ? '简单' :
                   story.difficulty === 'medium' ? '中等' : '困难'}
                </span>
                <span className="text-sm text-gray-500">• 已提问 {questions.length} 次</span>
                <span className="text-sm text-gray-500">• 提示使用 {gameSession.hintsUsed}/{story.hints.length}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleUseHint}>
                提示 ({gameSession.hintsUsed}/{story.hints.length})
              </Button>
              <Button variant="outline" size="sm" onClick={handleGiveUp}>
                放弃
              </Button>
              <Button variant="primary" size="sm" onClick={handleRevealSolution}>
                查看汤底
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：故事面板 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">汤面故事</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{story.surface}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">游戏规则</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">1</span>
                    向AI提问，AI只能回答"是"、"否"、"部分相关"或"无关"
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">2</span>
                    通过推理找出故事真相，点击"查看汤底"验证
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">3</span>
                    可以使用提示获取线索（每个故事有{story.hints.length}个提示）
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">游戏统计</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">提问次数</p>
                    <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">使用提示</p>
                    <p className="text-2xl font-bold text-gray-900">{gameSession.hintsUsed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">已回答</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {questions.filter(q => q.answer !== 'pending' && q.answer !== 'error').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">游戏时间</p>
                    <p className="text-2xl font-bold text-gray-9">{Math.floor((Date.now() - gameSession.startTime) / 60000)}分钟</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：聊天界面 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-[calc(100vh-200px)]">
              {/* 消息区域 */}
              <div className="flex-1 overflow-y-auto p-6">
                {questions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">开始提问</h3>
                    <p className="text-gray-500">在下方输入你的问题，AI将根据故事真相回答</p>
                    <div className="mt-6 max-w-md mx-auto text-left">
                      <h4 className="font-medium text-gray-800 mb-2">示例问题：</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 故事中有死亡事件吗？</li>
                        <li>• 凶手是故事中出现的人物吗？</li>
                        <li>• 这与时间旅行有关吗？</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((q) => (
                      <div key={q.id} className="space-y-2">
                        {/* 玩家问题 */}
                        <div className="flex justify-end">
                          <div className="max-w-[80%]">
                            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3">
                              <p>{q.question}</p>
                            </div>
                            <div className="text-xs text-gray-500 text-right mt-1">
                              {new Date(q.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>

                        {/* AI回答 */}
                        <div className="flex justify-start">
                          <div className="max-w-[80%]">
                            <div className={cn(
                              'rounded-2xl rounded-tl-none px-4 py-3 border',
                              getAnswerColor(q.answer)
                            )}>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{getAnswerText(q.answer)}</span>
                                {q.processingTime && (
                                  <span className="text-xs opacity-70">
                                    {q.processingTime}ms
                                  </span>
                                )}
                              </div>
                              {q.confidence !== undefined && q.answer !== 'pending' && q.answer !== 'error' && (
                                <div className="mt-2">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-600 h-1.5 rounded-full"
                                      style={{ width: `${q.confidence * 100}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    置信度: {(q.confidence * 100).toFixed(1)}%
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {q.source === 'cache' && '（来自缓存）'}
                              {q.source === 'rule-engine' && '（来自规则引擎）'}
                              {q.source === 'ai' && '（来自AI）'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* 输入区域 */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSubmitQuestion}>
                  <div className="flex gap-2">
                    <textarea
                      ref={inputRef}
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                      placeholder="输入你的问题...（例如：故事中有死亡事件吗？）"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={2}
                      disabled={isProcessing}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitQuestion(e);
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!currentQuestion.trim() || isProcessing}
                      isLoading={isProcessing}
                      className="self-end"
                    >
                      发送
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">
                      {currentQuestion.length > 0 ? `${currentQuestion.length} 字符` : '按 Enter 发送，Shift+Enter 换行'}
                    </div>
                    <div className="text-xs text-gray-500">
                      已回答问题: {questions.filter(q => q.answer !== 'pending' && q.answer !== 'error').length}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GamePage;