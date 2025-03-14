
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tool } from '@/types/admin';
import { ExternalLink } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <CardContent className="p-0">
        <a 
          href={tool.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block h-full"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center p-4 border-b">
              <div className="flex items-center justify-center w-10 h-10 bg-secondary/30 rounded-md mr-3 text-xl">
                {tool.favicon || '🔧'}
              </div>
              <div>
                <h3 className="font-medium">{tool.name}</h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  <span className="truncate max-w-[200px]">{tool.url.replace(/^https?:\/\//, '')}</span>
                </div>
              </div>
              {tool.has_pro_perk && (
                <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary">
                  Pro
                </Badge>
              )}
            </div>
            <div className="p-4 flex-grow">
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
