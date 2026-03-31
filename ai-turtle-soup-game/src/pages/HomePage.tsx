import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import GameCard from '../components/game/GameCard';
import { PageLoader } from '../components/ui/loading-spinner';
import type { Story } from '../types/game';
import storiesData from '../data/stories';

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


  if (loading) {
    return <PageLoader text="加载故事中..." />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* 星空背景 */}
      <div className="starry-night-bg">
        <div className="mist-overlay"></div>
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 starry-night-content rounded-2xl p-6 md:p-8 backdrop-blur-sm">
        <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">AI海龟汤游戏</h1>
        <p className="text-slate-300">选择一款海龟汤故事，开始你的推理之旅。向AI提问，找出故事背后的真相！</p>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white">故事列表</h2>
              <p className="text-slate-300">共 {stories.length} 个故事，{filteredStories.length} 个符合筛选</p>
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
            <GameCard
              key={story.id}
              story={story}
              onSelect={handleStorySelect}
            />
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">没有找到匹配的故事</h3>
            <p className="text-slate-400">尝试调整筛选条件，或选择其他难度</p>
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

      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-700">
        <div className="text-center text-slate-400 text-sm">
          <p>AI海龟汤游戏 - 锻炼你的逻辑推理能力</p>
          <p className="mt-2">游戏规则：向AI提问，AI只能回答"是"、"否"或"无关"，通过推理找出故事真相</p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default HomePage;