'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { GraphView, GraphNode, GraphEdge } from '@/components/knowledge';
import { dataManager } from '@/services/dataManager';

export default function KnowledgeGraphPage() {
  const [viewMode, setViewMode] = useState<'timeline' | 'graph'>('timeline');
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<GraphNode | null>(null);
  
  const cards = dataManager.getCards();
  const heroes = dataManager.getHeroes();

  // 按年份分组事件
  const timelineEvents = cards.map(card => ({
    id: card.id,
    title: card.front_title,
    content: card.back_content,
    keywords: card.back_keywords,
    era: card.category,
  }));

  // 构建图谱数据
  const { graphNodes, graphEdges } = useMemo(() => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    
    // 添加英雄节点
    heroes.forEach(hero => {
      nodes.push({
        id: `hero-${hero.id}`,
        label: hero.name,
        type: 'hero',
      });
    });
    
    // 添加事件节点（从卡片中提取）
    cards.slice(0, 8).forEach(card => {
      nodes.push({
        id: `event-${card.id}`,
        label: card.front_title,
        type: 'event',
      });
    });
    
    // 添加一些概念节点
    const concepts = ['共产主义', '革命精神', '为人民服务', '艰苦奋斗'];
    concepts.forEach((concept, index) => {
      nodes.push({
        id: `concept-${index}`,
        label: concept,
        type: 'concept',
      });
    });
    
    // 创建边（关联关系）
    // 英雄与事件的关联
    heroes.forEach((hero, index) => {
      if (cards[index]) {
        edges.push({
          source: `hero-${hero.id}`,
          target: `event-${cards[index].id}`,
          label: '参与',
        });
      }
    });
    
    // 英雄与概念的关联
    heroes.forEach((hero, index) => {
      edges.push({
        source: `hero-${hero.id}`,
        target: `concept-${index % concepts.length}`,
        label: '践行',
      });
    });
    
    // 事件之间的关联
    for (let i = 0; i < Math.min(cards.length - 1, 5); i++) {
      edges.push({
        source: `event-${cards[i].id}`,
        target: `event-${cards[i + 1].id}`,
        label: '影响',
      });
    }
    
    return { graphNodes: nodes, graphEdges: edges };
  }, [heroes, cards]);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNodeInfo(node);
  };

  return (
    <>
      <Header title="知识图谱" />
      
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'timeline' | 'graph')}>
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="timeline">时间线</TabsTrigger>
            <TabsTrigger value="graph">关系图</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-0">
            <div className="relative">
              {/* 时间线 */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-red-200" />
              
              <div className="space-y-6">
                {timelineEvents.map((event, index) => (
                  <div 
                    key={event.id}
                    className="relative pl-10 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* 时间点 */}
                    <div className="absolute left-2 w-5 h-5 rounded-full bg-red-500 border-4 border-white shadow" />
                    
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-neutral-900">{event.title}</h3>
                        <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                          {event.era}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 line-clamp-3">
                        {event.content}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {event.keywords.slice(0, 3).map((keyword, i) => (
                          <span 
                            key={i}
                            className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="graph" className="mt-0">
            <div className="space-y-4">
              <GraphView
                nodes={graphNodes}
                edges={graphEdges}
                onNodeClick={handleNodeClick}
              />
              
              {selectedNodeInfo && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">{selectedNodeInfo.label}</h3>
                  <p className="text-sm text-neutral-600">
                    类型：{
                      selectedNodeInfo.type === 'hero' ? '英雄人物' :
                      selectedNodeInfo.type === 'event' ? '历史事件' :
                      selectedNodeInfo.type === 'place' ? '地点' : '概念'
                    }
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">
                    点击图谱中的节点查看关联关系，拖拽可平移视图，使用右上角按钮缩放。
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
