import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Story, QuestionAnswer } from '../types/game';
import storiesData from '../data/stories.json';
import { cn, calculateGameDuration } from '../lib/utils/helpers';

const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuestionAnswer[]>([
    // 模拟问题数据
    {
      id: 'q1',
      question: '故事中有死亡事件吗？',
      answer: 'yes',
      timestamp: Date.now() - 300000,
      source: 'ai',
      confidence: 0.9,
    },
    {
      id: 'q2',
      question: '凶手是故事中出现的人物吗？',
      answer: 'yes',
      timestamp: Date.now() - 280000,
      source: 'ai',
      confidence: 0.8,
    },
    {
      id: 'q3',
      question: '这与时间旅行有关吗？',
      answer: 'no',
      timestamp: Date.now() - 260000,
      source: 'ai',
      confidence: 0.7,
    },
  ]);
  const [gameSession] = useState({
    startTime: Date.now() - 600000,
    endTime: Date.now(),
    hintsUsed: 1,
    solved: true,
  });

  useEffect(() => {
    const loadStory = async () => {
      setLoading(true);
      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      const foundStory = storiesData.find(s => s.id === id) as Story | undefined;
      if (foundStory) {
        setStory(foundStory);
      } else {
        // 故事未找到，返回首页
        navigate('/');
      }
      setLoading(false);
    };

    loadStory();
  }, [id, navigate]);

  const handlePlayAgain = () => {
    navigate(`/game/${id}`);
  };

  const handleBackToLobby = () => {
    navigate('/');
  };

  const handleShare = () => {
    if (!story) return;

    const shareText = `我刚刚完成了海龟汤游戏 "${story.title}"！\n` +
                     `难度：${story.difficulty === 'easy' ? '简单' : story.difficulty === 'medium' ? '中等' : '困难'}\n` +
                     `提问次数：${questions.length}\n` +
                     `游戏时间：${calculateGameDuration(gameSession.startTime, gameSession.endTime)}\n` +
                     `#AI海龟汤 #推理游戏`;

    if (navigator.share) {
      navigator.share({
        title: 'AI海龟汤游戏',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('结果已复制到剪贴板！');
    }
  };

  const getAnswerColor = (answer: string) => {
    switch (answer) {
      case 'yes': return 'bg-green-100 border-green-300 text-green-800';
      case 'no': return 'bg-red-100 border-red-300 text-red-800';
      case 'partial': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'irrelevant': return 'bg-gray-100 border-gray-300 text-gray-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getAnswerText = (answer: string) => {
    switch (answer) {
      case 'yes': return '是';
      case 'no': return '否';
      case 'partial': return '部分相关';
      case 'irrelevant': return '无关';
      default: return '未知';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载结果中...</p>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">游戏结束</h1>
          <p className="text-gray-600">你已完成游戏 "{story.title}"</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：游戏统计 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">游戏统计</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">游戏时间</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {calculateGameDuration(gameSession.startTime, gameSession.endTime)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">提问次数</p>
                  <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">使用提示</p>
                  <p className="text-2xl font-bold text-gray-900">{gameSession.hintsUsed}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">解决状态</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {gameSession.solved ? '成功解决' : '放弃'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">效率评分</h3>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="ml-3 text-xl font-bold text-gray-900">7.5</span>
                  <span className="ml-1 text-gray-500">/10</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">基于提问次数和用时计算</p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-6 space-y-3">
              <Button variant="primary" fullWidth onClick={handlePlayAgain}>
                再来一局
              </Button>
              <Button variant="outline" fullWidth onClick={handleBackToLobby}>
                返回游戏大厅
              </Button>
              <Button variant="ghost" fullWidth onClick={handleShare}>
                分享结果
              </Button>
            </div>
          </div>

          {/* 右侧：汤底和对话记录 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 汤底揭示 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">汤底真相</h2>
                <p className="text-purple-100">故事的完整解释</p>
              </div>
              <div className="p-6">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 whitespace-pre-line text-lg">{story.bottom}</p>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-yellow-800">推理提示</h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        海龟汤游戏的乐趣在于推理过程。即使知道了答案，也可以思考如何通过更少的问题推理出来。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 对话记录 */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900">对话记录</h2>
                <p className="text-gray-600">回顾你的提问和AI的回答</p>
              </div>

              <div className="p-6">
                {questions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">没有提问记录</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((q, index) => (
                      <div key={q.id} className={cn(
                        'border rounded-lg p-4',
                        index === questions.length - 1 ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                      )}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium text-gray-900">问题 {index + 1}:</span>
                            <span className="ml-2">{q.question}</span>
                          </div>
                          <span className={cn(
                            'px-2 py-1 rounded text-xs font-medium',
                            getAnswerColor(q.answer)
                          )}>
                            {getAnswerText(q.answer)}
                          </span>
                        </div>

                        <div className="text-sm text-gray-500 flex justify-between">
                          <div>
                            来源: {q.source === 'cache' ? '缓存' : q.source === 'rule-engine' ? '规则引擎' : 'AI'}
                            {q.confidence && ` • 置信度: ${(q.confidence * 100).toFixed(1)}%`}
                          </div>
                          <div>
                            {new Date(q.timestamp).toLocaleTimeString('zh-CN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 总结 */}
                {questions.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">提问分析</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {questions.filter(q => q.answer === 'yes').length}
                        </p>
                        <p className="text-sm text-gray-500">是</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {questions.filter(q => q.answer === 'no').length}
                        </p>
                        <p className="text-sm text-gray-500">否</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                          {questions.filter(q => q.answer === 'partial').length}
                        </p>
                        <p className="text-sm text-gray-500">部分相关</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-600">
                          {questions.filter(q => q.answer === 'irrelevant').length}
                        </p>
                        <p className="text-sm text-gray-500">无关</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            想挑战更多海龟汤故事？返回游戏大厅选择其他故事！
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={handleBackToLobby}>
              返回游戏大厅
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ResultPage;