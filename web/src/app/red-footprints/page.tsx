'use client';

import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 模拟红色地标数据
const redLocations = [
  {
    id: 'loc_001',
    name: '南湖红船',
    address: '浙江省嘉兴市南湖区',
    description: '中国共产党第一次全国代表大会会址',
    distance: '1200km',
    lat: 30.7522,
    lng: 120.7602,
  },
  {
    id: 'loc_002',
    name: '井冈山革命博物馆',
    address: '江西省吉安市井冈山市',
    description: '中国第一个农村革命根据地',
    distance: '800km',
    lat: 26.5867,
    lng: 114.2892,
  },
  {
    id: 'loc_003',
    name: '延安革命纪念馆',
    address: '陕西省延安市宝塔区',
    description: '中国革命的圣地',
    distance: '600km',
    lat: 36.5853,
    lng: 109.4898,
  },
  {
    id: 'loc_004',
    name: '遵义会议会址',
    address: '贵州省遵义市红花岗区',
    description: '党的历史上生死攸关的转折点',
    distance: '1500km',
    lat: 27.7256,
    lng: 106.9273,
  },
];

export default function RedFootprintsPage() {
  const handleNavigate = (location: typeof redLocations[0]) => {
    // 打开外部地图应用
    const url = `https://uri.amap.com/marker?position=${location.lng},${location.lat}&name=${encodeURIComponent(location.name)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Header title="红色足迹" />
      
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        {/* 地图占位 */}
        <Card className="aspect-video bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <p className="text-neutral-600">地图功能开发中</p>
            <p className="text-sm text-neutral-400">敬请期待</p>
          </div>
        </Card>

        {/* 地点列表 */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">红色地标</h3>
          <div className="space-y-3">
            {redLocations.map((location, index) => (
              <Card 
                key={location.id}
                className="p-4 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-900">{location.name}</h4>
                    <p className="text-sm text-neutral-500 truncate">{location.address}</p>
                    <p className="text-xs text-neutral-400 mt-1">{location.description}</p>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-neutral-500 mb-2">{location.distance}</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleNavigate(location)}
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      导航
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
