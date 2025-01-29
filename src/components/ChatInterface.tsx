import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Play, BarChart, Table } from "lucide-react";

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

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleActionButton = (action: string) => {
    switch (action) {
      case 'show_data':
        toast({
          title: "Show Data",
          description: "Displaying data table...",
        });
        break;
      case 'show_chart':
        toast({
          title: "Show Chart",
          description: "Displaying visualization...",
        });
        break;
      case 'run_analysis':
        toast({
          title: "Run Analysis",
          description: "Running analysis...",
        });
        break;
      default:
        console.log(`Unhandled action: ${action}`);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: {
          messages: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
          })).concat([{
            role: 'user',
            content: input
          }])
        }
      });

      if (error) throw error;

      const aiResponse = data.choices[0].message.content;
      
      // Add some example actions based on keywords in the response
      const actions = [];
      if (aiResponse.toLowerCase().includes('data')) actions.push('show_data');
      if (aiResponse.toLowerCase().includes('chart') || aiResponse.toLowerCase().includes('graph')) actions.push('show_chart');
      if (aiResponse.toLowerCase().includes('analysis')) actions.push('run_analysis');

      setMessages(prev => [...prev, { 
        text: aiResponse, 
        isUser: false, 
        timestamp: new Date(),
        actions 
      }]);
      
      toast({
        title: "Response received",
        description: "The AI has processed your request.",
      });
    } catch (error) {
      console.error('Error calling OpenAI:', error);
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
                    onClick={() => handleActionButton(action)}
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