import React from 'react';
import { Button } from '../ui/button';
import type { Story } from '../../types/game';
import { cn } from '../../lib/utils/helpers';

export interface GameCardProps {
  story: Story;
  onSelect: (storyId: string) => void;
  className?: string;
}

const GameCard: React.FC<GameCardProps> = ({ story, onSelect, className }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'hard': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mystery': return 'bg-purple-900/60 text-purple-200 border border-purple-700/50';
      case 'scifi': return 'bg-blue-900/60 text-blue-200 border border-blue-700/50';
      case 'everyday': return 'bg-slate-800/60 text-slate-200 border border-slate-700/50';
      case 'historical': return 'bg-amber-900/60 text-amber-200 border border-amber-700/50';
      default: return 'bg-slate-800/60 text-slate-200 border border-slate-700/50';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return difficulty;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'mystery': return '悬疑';
      case 'scifi': return '科幻';
      case 'everyday': return '日常';
      case 'historical': return '历史';
      default: return category;
    }
  };

  return (
    <div
      className={cn(
        'bg-slate-900/90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden',
        'border border-amber-400/20 hover:border-amber-400/40',
        'hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] card-hover',
        'flex flex-col h-full',
        className
      )}
    >
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{story.title}</h3>
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-medium',
            getDifficultyColor(story.difficulty)
          )}>
            {getDifficultyText(story.difficulty)}
          </span>
        </div>

        <p className="text-slate-300 mb-4 line-clamp-3">{story.surface}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            getCategoryColor(story.category)
          )}>
            {getCategoryText(story.category)}
          </span>
          {story.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 rounded text-xs font-medium bg-slate-800/60 text-slate-300 border border-slate-700/50"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-slate-400 mb-6">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{story.estimatedTime} 分钟</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{story.rating?.toFixed(1) || '5.0'}</span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <Button
          variant="primary"
          fullWidth
          onClick={() => onSelect(story.id)}
          className="bg-amber-400 hover:bg-amber-500 text-white font-medium"
        >
          开始游戏
        </Button>
      </div>
    </div>
  );
};

export default GameCard;