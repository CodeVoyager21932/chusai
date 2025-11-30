'use client';

import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface GraphNode {
  id: string;
  label: string;
  type: 'hero' | 'event' | 'place' | 'concept';
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
}

interface GraphViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick?: (node: GraphNode) => void;
}

const nodeColors = {
  hero: { bg: 'fill-red-100', border: 'stroke-red-500', text: 'text-red-700' },
  event: { bg: 'fill-blue-100', border: 'stroke-blue-500', text: 'text-blue-700' },
  place: { bg: 'fill-green-100', border: 'stroke-green-500', text: 'text-green-700' },
  concept: { bg: 'fill-amber-100', border: 'stroke-amber-500', text: 'text-amber-700' },
};

export function GraphView({ nodes, edges, onNodeClick }: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // 计算节点位置（简单的力导向布局模拟）
  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(new Map());

  useEffect(() => {
    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // 简单的圆形布局
    const newPositions = new Map<string, { x: number; y: number }>();
    const radius = Math.min(width, height) * 0.35;
    
    nodes.forEach((node, index) => {
      if (node.x !== undefined && node.y !== undefined) {
        newPositions.set(node.id, { x: node.x, y: node.y });
      } else {
        const angle = (2 * Math.PI * index) / nodes.length - Math.PI / 2;
        newPositions.set(node.id, {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        });
      }
    });
    
    setPositions(newPositions);
  }, [nodes]);

  const handleZoomIn = () => setScale(s => Math.min(s * 1.2, 3));
  const handleZoomOut = () => setScale(s => Math.max(s / 1.2, 0.5));
  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'svg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node.id === selectedNode ? null : node.id);
    onNodeClick?.(node);
  };

  const getNodePosition = (nodeId: string) => {
    return positions.get(nodeId) || { x: 400, y: 300 };
  };

  return (
    <div className="relative w-full h-[500px] bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden">
      {/* 控制按钮 */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* 图例 */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span>英雄人物</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span>历史事件</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span>地点</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span>概念</span>
        </div>
      </div>

      {/* SVG 图谱 */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          style={{
            transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
            transformOrigin: 'center',
          }}
        >
          {/* 边 */}
          <g>
            {edges.map((edge, index) => {
              const sourcePos = getNodePosition(edge.source);
              const targetPos = getNodePosition(edge.target);
              const isHighlighted = selectedNode === edge.source || selectedNode === edge.target;
              
              return (
                <g key={`edge-${index}`}>
                  <line
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    className={cn(
                      'transition-all duration-200',
                      isHighlighted ? 'stroke-red-400 stroke-2' : 'stroke-neutral-300 stroke-1'
                    )}
                  />
                  {edge.label && (
                    <text
                      x={(sourcePos.x + targetPos.x) / 2}
                      y={(sourcePos.y + targetPos.y) / 2 - 5}
                      className="fill-neutral-500 text-[10px]"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* 节点 */}
          <g>
            {nodes.map((node) => {
              const pos = getNodePosition(node.id);
              const colors = nodeColors[node.type];
              const isSelected = selectedNode === node.id;
              const isConnected = selectedNode && edges.some(
                e => (e.source === selectedNode && e.target === node.id) ||
                     (e.target === selectedNode && e.source === node.id)
              );
              
              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onClick={() => handleNodeClick(node)}
                  style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                >
                  {/* 节点圆圈 */}
                  <circle
                    cx={0}
                    cy={0}
                    r={isSelected ? 35 : 30}
                    className={cn(
                      colors.bg,
                      colors.border,
                      'stroke-2 transition-all duration-200',
                      isSelected && 'stroke-[3px]',
                      !selectedNode || isSelected || isConnected ? 'opacity-100' : 'opacity-40'
                    )}
                  />
                  
                  {/* 节点标签 */}
                  <text
                    x={0}
                    y={4}
                    textAnchor="middle"
                    className={cn(
                      'text-xs font-medium pointer-events-none',
                      colors.text,
                      !selectedNode || isSelected || isConnected ? 'opacity-100' : 'opacity-40'
                    )}
                  >
                    {node.label.length > 6 ? node.label.slice(0, 6) + '...' : node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 选中节点信息 */}
      {selectedNode && (
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-[200px]">
          <p className="font-medium text-sm">
            {nodes.find(n => n.id === selectedNode)?.label}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            点击其他节点查看关联
          </p>
        </div>
      )}
    </div>
  );
}
