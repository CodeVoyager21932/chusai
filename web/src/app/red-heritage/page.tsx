'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CollectionGrid } from '@/components/heritage/CollectionGrid';
import { GachaDrawer } from '@/components/heritage/GachaDrawer';

export default function RedHeritagePage() {
  const [activeTab, setActiveTab] = useState('collection');

  return (
    <>
      <Header title="红色珍藏" />
      
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="collection">我的收藏</TabsTrigger>
            <TabsTrigger value="gacha">抽取信物</TabsTrigger>
          </TabsList>

          <TabsContent value="collection" className="mt-0">
            <CollectionGrid />
          </TabsContent>

          <TabsContent value="gacha" className="mt-0">
            <GachaDrawer />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
