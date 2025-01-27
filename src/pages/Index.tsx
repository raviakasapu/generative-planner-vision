import React from 'react';
import Spreadsheet from '@/components/Spreadsheet';
import ChatInterface from '@/components/ChatInterface';
import BusinessLogic from '@/components/BusinessLogic';
import MasterData from '@/components/MasterData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Enterprise Planning System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Spreadsheet />
        </div>
        <div>
          <ChatInterface />
        </div>
      </div>
      
      <div className="mt-6">
        <Tabs defaultValue="business-logic">
          <TabsList>
            <TabsTrigger value="business-logic">Business Logic</TabsTrigger>
            <TabsTrigger value="master-data">Master Data</TabsTrigger>
          </TabsList>
          <TabsContent value="business-logic">
            <BusinessLogic />
          </TabsContent>
          <TabsContent value="master-data">
            <MasterData />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;