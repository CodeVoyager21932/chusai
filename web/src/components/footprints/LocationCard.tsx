'use client';

import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface Location {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  distance?: number; // 距离（米）
}

interface LocationCardProps {
  location: Location;
  onNavigate?: (location: Location) => void;
}

export function LocationCard({ location, onNavigate }: LocationCardProps) {
  const formatDistance = (meters?: number) => {
    if (!meters) return '';
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate(location);
    } else {
      // 默认打开高德地图导航
      const url = `https://uri.amap.com/marker?position=${location.longitude},${location.latitude}&name=${encodeURIComponent(location.name)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{location.name}</h3>
              <Badge variant="outline" className="flex-shrink-0">
                {location.category}
              </Badge>
            </div>
            
            <p className="text-sm text-neutral-600 line-clamp-2 mb-2">
              {location.description}
            </p>
            
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{location.address}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {location.distance !== undefined && (
              <span className="text-sm font-medium text-red-600">
                {formatDistance(location.distance)}
              </span>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNavigate}
              className="gap-1"
            >
              <Navigation className="w-3 h-3" />
              导航
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
