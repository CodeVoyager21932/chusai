'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUIStore } from '@/stores/uiStore';
import { searchHeroes } from '@/services/dataManager';
import { Hero } from '@/types/models';
import { cn } from '@/lib/utils';

// 热门搜索标签
const hotSearchTags = ['雷锋', '焦裕禄', '黄继光', '赵一曼', '长征'];

export function GlobalSearch() {
  const router = useRouter();
  const { showSearch, setShowSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Hero[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 防抖搜索
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const searchResults = searchHeroes(query);
      setResults(searchResults);
      setIsSearching(false);
    }, 500); // 500ms 防抖

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (hero: Hero) => {
    setShowSearch(false);
    setQuery('');
    router.push(`/hero/${hero.id}`);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
  };

  const handleClose = () => {
    setShowSearch(false);
    setQuery('');
    setResults([]);
  };

  return (
    <Dialog open={showSearch} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-neutral-500" />
            搜索
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 搜索输入框 */}
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索英雄人物..."
              className="pr-10"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 热门搜索 */}
          {!query && (
            <div>
              <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                <TrendingUp className="w-4 h-4" />
                热门搜索
              </div>
              <div className="flex flex-wrap gap-2">
                {hotSearchTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm text-neutral-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 搜索结果 */}
          {query && (
            <div className="max-h-64 overflow-y-auto">
              {isSearching ? (
                <div className="text-center py-8 text-neutral-500">
                  搜索中...
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((hero) => (
                    <button
                      key={hero.id}
                      onClick={() => handleSelect(hero)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-red-600">
                          {hero.name[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-neutral-900 truncate">
                          {hero.name}
                        </h4>
                        <p className="text-sm text-neutral-500 truncate">
                          {hero.title}
                        </p>
                      </div>
                      <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                        {hero.era}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-500">未找到相关结果</p>
                  <p className="text-sm text-neutral-400 mt-1">
                    试试其他关键词
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GlobalSearch;
