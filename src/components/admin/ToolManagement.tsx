import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, PlusCircle, Pencil, Trash } from 'lucide-react';
import { Tool } from '@/types/admin';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ToolManagementProps {
  tools: Tool[];
  isLoading: boolean;
  handleAddTool: (tool: Omit<Tool, 'id' | 'created_at' | 'updated_at'>) => void;
  handleUpdateTool: (id: string, tool: Partial<Tool>) => void;
  handleDeleteTool: (id: string) => void;
}

const ToolManagement = ({
  tools,
  isLoading,
  handleAddTool,
  handleUpdateTool,
  handleDeleteTool,
}: ToolManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [newTool, setNewTool] = useState({
    name: '',
    url: '',
    description: '',
    favicon: '',
    has_pro_perk: false,
  });

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetNewTool = () => {
    setNewTool({
      name: '',
      url: '',
      description: '',
      favicon: '',
      has_pro_perk: false,
    });
  };

  const handleEdit = (tool: Tool) => {
    setSelectedTool(tool);
    setIsEditDialogOpen(true);
  };

  const submitAddTool = () => {
    if (!newTool.name || !newTool.url || !newTool.description) {
      return; // Prevent submission if required fields are empty
    }
    
    handleAddTool(newTool);
    resetNewTool();
    setIsAddDialogOpen(false);
  };

  const submitUpdateTool = () => {
    if (!selectedTool) return;
    
    handleUpdateTool(selectedTool.id, selectedTool);
    setSelectedTool(null);
    setIsEditDialogOpen(false);
  };
  
  // Function to render favicon (either as emoji or image)
  const renderFavicon = (favicon: string) => {
    // Check if the favicon is a URL (starts with http:// or https:// or has image extensions)
    const isUrl = /^(https?:\/\/|www\.)|(\.(png|jpg|jpeg|svg|webp|ico)$)/i.test(favicon);
    
    if (isUrl) {
      return (
        <Avatar className="h-8 w-8">
          <img src={favicon} alt="Tool icon" className="h-full w-full object-contain" />
          <AvatarFallback>🔧</AvatarFallback>
        </Avatar>
      );
    }
    
    // If not a URL, render as emoji
    return <span className="text-xl">{favicon || '🔧'}</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search tools..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Tool</DialogTitle>
              <DialogDescription>
                Create a new tool for your platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="toolName">Tool Name*</label>
                <Input 
                  id="toolName" 
                  value={newTool.name} 
                  onChange={(e) => setNewTool({...newTool, name: e.target.value})} 
                  placeholder="e.g. ChatGPT"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="toolUrl">URL*</label>
                <Input 
                  id="toolUrl" 
                  value={newTool.url} 
                  onChange={(e) => setNewTool({...newTool, url: e.target.value})} 
                  placeholder="e.g. https://chat.openai.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="toolDescription">Description*</label>
                <Textarea 
                  id="toolDescription" 
                  value={newTool.description} 
                  onChange={(e) => setNewTool({...newTool, description: e.target.value})} 
                  placeholder="Brief description of the tool"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="toolFavicon">Favicon Image URL or Emoji</label>
                <Input 
                  id="toolFavicon" 
                  value={newTool.favicon} 
                  onChange={(e) => setNewTool({...newTool, favicon: e.target.value})} 
                  placeholder="e.g. https://example.com/favicon.ico or 🤖"
                />
                <p className="text-xs text-muted-foreground">
                  Enter an emoji or full URL to an image (PNG, JPG, SVG, ICO)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="toolProPerk" 
                  checked={newTool.has_pro_perk}
                  onCheckedChange={(checked) => setNewTool({...newTool, has_pro_perk: !!checked})}
                />
                <label htmlFor="toolProPerk" className="text-sm">
                  Pro Content
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={submitAddTool}>Add Tool</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-background border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Pro</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No tools match your search." : "No tools found. Add your first tool to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tool.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{tool.description}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {tool.url}
                      </a>
                    </TableCell>
                    <TableCell>{tool.has_pro_perk ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(tool)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteTool(tool.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Edit Tool Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tool</DialogTitle>
            <DialogDescription>
              Update the tool details.
            </DialogDescription>
          </DialogHeader>
          {selectedTool && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="editToolName">Tool Name*</label>
                <Input 
                  id="editToolName" 
                  value={selectedTool.name} 
                  onChange={(e) => setSelectedTool({...selectedTool, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="editToolUrl">URL*</label>
                <Input 
                  id="editToolUrl" 
                  value={selectedTool.url} 
                  onChange={(e) => setSelectedTool({...selectedTool, url: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="editToolDescription">Description*</label>
                <Textarea 
                  id="editToolDescription" 
                  value={selectedTool.description} 
                  onChange={(e) => setSelectedTool({...selectedTool, description: e.target.value})} 
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="editToolFavicon">Favicon Image URL or Emoji</label>
                <Input 
                  id="editToolFavicon" 
                  value={selectedTool.favicon} 
                  onChange={(e) => setSelectedTool({...selectedTool, favicon: e.target.value})} 
                />
                <p className="text-xs text-muted-foreground">
                  Enter an emoji or full URL to an image (PNG, JPG, SVG, ICO)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="editToolProPerk" 
                  checked={selectedTool.has_pro_perk}
                  onCheckedChange={(checked) => setSelectedTool({...selectedTool, has_pro_perk: !!checked})}
                />
                <label htmlFor="editToolProPerk" className="text-sm">
                  Pro Content
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitUpdateTool}>Update Tool</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ToolManagement;
