'use client';

import { LocationCard, Location } from './LocationCard';

interface LocationListProps {
  locations: Location[];
  onNavigate?: (location: Location) => void;
}

export function LocationList({ locations, onNavigate }: LocationListProps) {
  // 按距离排序
  const sortedLocations = [...locations].sort((a, b) => {
    if (a.distance === undefined) return 1;
    if (b.distance === undefined) return -1;
    return a.distance - b.distance;
  });

  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">暂无红色地点数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedLocations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
