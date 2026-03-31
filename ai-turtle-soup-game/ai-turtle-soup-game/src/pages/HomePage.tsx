import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Story } from '../types/game';
import storiesData from '../data/stories.json';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载延迟
    const timer = setTimeout(() => {
      setStories(storiesData as Story[]);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredStories = stories.filter(story =>
    filter === 'all' || story.difficulty === filter
  );

  const handleStorySelect = (storyId: string) => {
    navigate(`/game/${storyId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mystery': return 'bg-purple-100 text-purple-800';
      case 'scifi': return 'bg-blue-100 text-blue-800';
      case 'everyday': return 'bg-gray-100 text-gray-800';
      case 'historical': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载故事中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">AI海龟汤游戏</h1>
        <p className="text-gray-600">选择一款海龟汤故事，开始你的推理之旅。向AI提问，找出故事背后的真相！</p>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">故事列表</h2>
              <p className="text-gray-600">共 {stories.length} 个故事，{filteredStories.length} 个符合筛选</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                全部
              </Button>
              <Button
                variant={filter === 'easy' ? 'primary' : 'outline'}
                onClick={() => setFilter('easy')}
                size="sm"
              >
                简单
              </Button>
              <Button
                variant={filter === 'medium' ? 'primary' : 'outline'}
                onClick={() => setFilter('medium')}
                size="sm"
              >
                中等
              </Button>
              <Button
                variant={filter === 'hard' ? 'primary' : 'outline'}
                onClick={() => setFilter('hard')}
                size="sm"
              >
                困难
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{story.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(story.difficulty)}`}>
                    {story.difficulty === 'easy' ? '简单' :
                     story.difficulty === 'medium' ? '中等' : '困难'}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{story.surface}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(story.category)}`}>
                    {story.category === 'mystery' ? '悬疑' :
                     story.category === 'scifi' ? '科幻' :
                     story.category === 'everyday' ? '日常' : '历史'}
                  </span>
                  {story.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{story.estimatedTime} 分钟</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{story.rating?.toFixed(1) || '5.0'}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => handleStorySelect(story.id)}
                >
                  开始游戏
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">没有找到匹配的故事</h3>
            <p className="text-gray-500">尝试调整筛选条件，或选择其他难度</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setFilter('all')}
            >
              显示全部故事
            </Button>
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-200">
        <div className="text-center text-gray-500 text-sm">
          <p>AI海龟汤游戏 - 锻炼你的逻辑推理能力</p>
          <p className="mt-2">游戏规则：向AI提问，AI只能回答"是"、"否"或"无关"，通过推理找出故事真相</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;