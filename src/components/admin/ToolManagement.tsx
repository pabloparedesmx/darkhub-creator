
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, PlusCircle, Edit, Trash, ExternalLink } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tool } from '@/types/admin';
import { DialogFooter } from '@/components/ui/dialog';

interface ToolManagementProps {
  tools: Tool[];
  isLoading: boolean;
  newTool: {
    name: string;
    url: string;
    description: string;
    favicon: string;
    has_pro_perk: boolean;
  };
  setNewTool: (tool: any) => void;
  isEditing: boolean;
  handleAddTool: () => void;
  handleUpdateTool: () => void;
  handleEditTool: (tool: Tool) => void;
  handleDeleteTool: (id: string) => void;
}

const ToolManagement = ({
  tools,
  isLoading,
  newTool,
  setNewTool,
  isEditing,
  handleAddTool,
  handleUpdateTool,
  handleEditTool,
  handleDeleteTool
}: ToolManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search tools..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Tool' : 'Add New Tool'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update the tool details' : 'Create a new tool in your platform'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              
              <div className="space-y-2">
                <label htmlFor="toolDescription">Description*</label>
                <Input
                  id="toolDescription" 
                  value={newTool.description} 
                  onChange={(e) => setNewTool({...newTool, description: e.target.value})} 
                  placeholder="Brief description of the tool"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="toolFavicon">Favicon (emoji)</label>
                  <Input 
                    id="toolFavicon" 
                    value={newTool.favicon} 
                    onChange={(e) => setNewTool({...newTool, favicon: e.target.value})} 
                    placeholder="e.g. 🤖"
                  />
                </div>
                <div className="flex items-center space-x-2 h-full pt-8">
                  <Checkbox 
                    id="hasProPerk" 
                    checked={newTool.has_pro_perk}
                    onCheckedChange={(checked) => setNewTool({...newTool, has_pro_perk: !!checked})}
                  />
                  <label
                    htmlFor="hasProPerk"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Pro Perk
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              {isEditing ? (
                <Button onClick={() => {
                  handleUpdateTool();
                  setIsDialogOpen(false);
                }}>Update Tool</Button>
              ) : (
                <Button onClick={() => {
                  handleAddTool();
                  setIsDialogOpen(false);
                }}>Add Tool</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Pro Perk</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No tools found. Add your first tool to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <span className="mr-2 text-xl">{tool.favicon || '🔧'}</span>
                        {tool.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={tool.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-muted-foreground hover:text-foreground"
                      >
                        <span className="truncate max-w-[200px]">{tool.url.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <span className="truncate block max-w-[300px]">{tool.description}</span>
                    </TableCell>
                    <TableCell>{tool.has_pro_perk ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            handleEditTool(tool);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteTool(tool.id)}
                          className="text-destructive"
                        >
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
    </div>
  );
};

export default ToolManagement;
