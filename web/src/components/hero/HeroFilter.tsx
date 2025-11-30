'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Era } from '@/types/models';

type FilterValue = Era | '全部';

interface HeroFilterProps {
  selectedEra: FilterValue;
  onEraChange: (era: FilterValue) => void;
}

const eras: FilterValue[] = ['全部', '革命时期', '建设时期', '改革时期', '新时代'];

export function HeroFilter({ selectedEra, onEraChange }: HeroFilterProps) {
  return (
    <Tabs value={selectedEra} onValueChange={(v) => onEraChange(v as FilterValue)}>
      <TabsList className="w-full flex overflow-x-auto hide-scrollbar">
        {eras.map((era) => (
          <TabsTrigger 
            key={era} 
            value={era}
            className="flex-1 min-w-fit px-4"
          >
            {era}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export default HeroFilter;
