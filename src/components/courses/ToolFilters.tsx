import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tool } from '@/types/admin';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
interface ToolFiltersProps {
  selectedTools: string[];
  setSelectedTools: React.Dispatch<React.SetStateAction<string[]>>;
}
const ToolFilters = ({
  selectedTools,
  setSelectedTools
}: ToolFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('tools').select('*').order('name');
        if (error) throw error;

        // Process tool names to remove prefix
        const processedTools = data.map(tool => {
          if (tool.name && tool.name.startsWith('Herramienta: ')) {
            return {
              ...tool,
              name: tool.name.replace('Herramienta: ', '')
            };
          }
          return tool;
        });
        setTools(processedTools as Tool[]);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTools();
  }, []);
  const filteredTools = tools.filter(tool => tool.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleToolToggle = (toolId: string) => {
    setSelectedTools(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  };
  const clearToolFilters = () => {
    setSelectedTools([]);
  };

  // Function to render favicon (either as emoji or image)
  const renderFavicon = (favicon: string) => {
    // Check if the favicon is a URL (starts with http:// or https:// or has image extensions)
    const isUrl = /^(https?:\/\/|www\.)|(\.(png|jpg|jpeg|svg|webp|ico)$)/i.test(favicon);
    if (isUrl) {
      return <Avatar className="h-5 w-5 mr-1">
          <img src={favicon} alt="Tool icon" className="h-full w-full object-contain" />
          <AvatarFallback>🔧</AvatarFallback>
        </Avatar>;
    }

    // If not a URL, render as emoji
    return <span className="mr-1">{favicon}</span>;
  };
  if (isLoading) {
    return <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center w-full text-left mb-2">
          <span className="text-sm font-medium">Tools</span>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="animate-pulse space-y-2 mt-2">
          <div className="h-5 bg-muted rounded w-3/4"></div>
          <div className="h-5 bg-muted rounded w-2/3"></div>
          <div className="h-5 bg-muted rounded w-1/2"></div>
        </div>
      </div>;
  }
  if (tools.length === 0) {
    return null;
  }
  return <div className="border-t border-border pt-4">
      <button className="flex justify-between items-center w-full text-left mb-2" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-sm font-medium">Herramientas</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && <div className="space-y-2 mt-2">
          {selectedTools.length > 0 && <Button variant="ghost" size="sm" onClick={clearToolFilters} className="h-7 px-2 text-xs">
              Clear tools
            </Button>}
          
          {tools.length > 5 && <div className="relative mb-3">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tools..." className="pl-8 py-1 h-8 text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>}
          
          {filteredTools.length === 0 ? <p className="text-xs text-muted-foreground py-1">No tools match your search</p> : filteredTools.map(tool => <div key={tool.id} className="flex items-center space-x-2">
                <Checkbox id={`tool-${tool.id}`} checked={selectedTools.includes(tool.id)} onCheckedChange={() => handleToolToggle(tool.id)} />
                <label htmlFor={`tool-${tool.id}`} className="text-sm cursor-pointer flex items-center">
                  {tool.favicon && renderFavicon(tool.favicon)}
                  {tool.name}
                </label>
              </div>)}
        </div>}
    </div>;
};
export default ToolFilters;