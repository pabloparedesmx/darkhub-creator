
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, PlusCircle, Pencil, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PromptWithCategory } from '@/types/prompt';
import { Category } from '@/types/admin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { format } from 'date-fns';

interface PromptManagementProps {
  prompts: PromptWithCategory[];
  categories: Category[];
  isLoading: boolean;
  refetchPrompts: () => void;
}

const PromptManagement: React.FC<PromptManagementProps> = ({ 
  prompts, 
  categories, 
  isLoading, 
  refetchPrompts 
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptWithCategory | null>(null);
  
  const [promptData, setPromptData] = useState({
    name: '',
    content: '',
    category_id: ''
  });
  
  // Filter prompts based on search term
  const filteredPrompts = prompts.filter(prompt => 
    prompt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const resetForm = () => {
    setPromptData({
      name: '',
      content: '',
      category_id: ''
    });
    setSelectedPrompt(null);
  };
  
  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (prompt: PromptWithCategory) => {
    setSelectedPrompt(prompt);
    setPromptData({
      name: prompt.name,
      content: prompt.content,
      category_id: prompt.category_id || ''
    });
    setIsDialogOpen(true);
  };
  
  const handleSavePrompt = async () => {
    try {
      if (!promptData.name || !promptData.content || !promptData.category_id) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos",
          variant: "destructive",
        });
        return;
      }
      
      if (selectedPrompt) {
        // Update existing prompt
        const { error } = await supabase
          .from('prompts')
          .update({
            name: promptData.name,
            content: promptData.content,
            category_id: promptData.category_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedPrompt.id);
        
        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Prompt actualizado correctamente",
        });
      } else {
        // Create new prompt
        const { error } = await supabase
          .from('prompts')
          .insert({
            name: promptData.name,
            content: promptData.content,
            category_id: promptData.category_id
          });
        
        if (error) throw error;
        
        toast({
          title: "Éxito",
          description: "Prompt creado correctamente",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      refetchPrompts();
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el prompt",
        variant: "destructive",
      });
    }
  };
  
  const handleDeletePrompt = async (id: string) => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Prompt eliminado correctamente",
      });
      
      refetchPrompts();
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el prompt",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Buscar prompts..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={openCreateDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Prompt
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedPrompt ? 'Editar' : 'Crear'} Prompt</DialogTitle>
            <DialogDescription>
              Completa los campos para {selectedPrompt ? 'actualizar' : 'crear'} el prompt
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="prompt-name">Nombre</Label>
              <Input 
                id="prompt-name" 
                placeholder="Nombre del prompt" 
                value={promptData.name}
                onChange={(e) => setPromptData({...promptData, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="prompt-category">Categoría</Label>
              <Select 
                value={promptData.category_id} 
                onValueChange={(value) => setPromptData({...promptData, category_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="prompt-content">Contenido</Label>
              <div className="min-h-[400px]">
                <RichTextEditor 
                  value={promptData.content}
                  onChange={(content) => setPromptData({...promptData, content})}
                  height={400}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePrompt}>
              {selectedPrompt ? 'Actualizar' : 'Crear'} Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Fecha de creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPrompts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  No se encontraron prompts
                </TableCell>
              </TableRow>
            ) : (
              filteredPrompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell className="font-medium">{prompt.name}</TableCell>
                  <TableCell>{prompt.categories?.name || 'Sin categoría'}</TableCell>
                  <TableCell>{format(new Date(prompt.created_at), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(prompt)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePrompt(prompt.id)}
                        disabled={isDeleting}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PromptManagement;
