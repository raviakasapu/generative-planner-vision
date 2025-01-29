import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Play, BarChart, Table } from "lucide-react";
import { useDataTable } from '@/hooks/useDataTable';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  actions?: string[];
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const { data: spreadsheetData } = useDataTable();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatActionResponse = (result: any): string => {
    if (!result) return 'Action completed successfully';
    
    if (result.data) {
      return `Found ${result.data.length} records matching your criteria`;
    }
    
    if (result.trends) {
      return `Analysis complete: ${result.trends.join(', ')}`;
    }
    
    if (result.chartData) {
      return `Chart data prepared with ${result.chartData.length} data points`;
    }
    
    return JSON.stringify(result);
  };

  const handleActionButton = async (action: string, messageText: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-data-actions', {
        body: { 
          action_type: action, 
          message: messageText,
          spreadsheet_data: spreadsheetData 
        }
      });

      if (error) throw error;

      toast({
        title: "Action Completed",
        description: `Successfully processed ${action} action`,
      });

      setMessages(prev => [...prev, {
        text: formatActionResponse(data.result),
        isUser: false,
        timestamp: new Date(),
        actions: []
      }]);

    } catch (error) {
      console.error('Error executing action:', error);
      toast({
        title: "Error",
        description: "Failed to process action. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-planning', {
        body: {
          message: input,
          context: {
            available_data: spreadsheetData?.length || 0,
            data_sample: spreadsheetData?.slice(0, 5) || []
          }
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { 
        text: data.response, 
        isUser: false, 
        timestamp: new Date(),
        actions: data.suggested_actions 
      }]);
      
      toast({
        title: "Response received",
        description: "The AI has processed your request.",
      });
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="p-4 font-medium border-b">AI Assistant</div>
      <ScrollArea ref={scrollAreaRef} className="flex-grow p-4">
        {messages.map((msg, i) => (
          <div key={i} className="mb-4">
            <div
              className={`p-3 rounded-lg ${
                msg.isUser
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted"
              } max-w-[80%] ${msg.isUser ? "ml-auto" : "mr-auto"}`}
            >
              {msg.text}
              <div className="text-xs opacity-50 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
            {!msg.isUser && msg.actions && msg.actions.length > 0 && (
              <div className="mt-2 flex gap-2">
                {msg.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleActionButton(action, msg.text)}
                    className="flex items-center gap-2"
                  >
                    {action === 'show_data' && <Table className="h-4 w-4" />}
                    {action === 'show_chart' && <BarChart className="h-4 w-4" />}
                    {action === 'run_analysis' && <Play className="h-4 w-4" />}
                    {action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </ScrollArea>
      <div className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
        </Button>
      </div>
    </Card>
  );
};

export default ChatInterface;