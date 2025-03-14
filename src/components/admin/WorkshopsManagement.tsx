
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, Pencil, Trash, Calendar } from 'lucide-react';
import { Workshop } from '@/types/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface WorkshopsManagementProps {
  workshops: Workshop[];
  isLoading: boolean;
  onRefresh: () => void;
}

const WorkshopsManagement = ({ workshops, isLoading, onRefresh }: WorkshopsManagementProps) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [newWorkshop, setNewWorkshop] = useState({
    title: '',
    description: '',
    expert_name: '',
    expert_profile_image: '',
    date: '',
    registration_url: '',
    is_recorded: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checkboxTarget = e.target as HTMLInputElement;
      setNewWorkshop({
        ...newWorkshop,
        [name]: checkboxTarget.checked
      });
    } else {
      setNewWorkshop({
        ...newWorkshop,
        [name]: value
      });
    }
  };

  const handleAddWorkshop = async () => {
    try {
      const { title, description, expert_name, expert_profile_image, date, registration_url, is_recorded } = newWorkshop;
      
      if (!title || !expert_name || !date || !registration_url) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        });
        return;
      }
      
      const { error } = await supabase
        .from('workshops')
        .insert([{
          title,
          description: description || null,
          expert_name,
          expert_profile_image: expert_profile_image || null,
          date,
          registration_url,
          is_recorded
        }]);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Workshop added successfully'
      });
      
      setIsAddDialogOpen(false);
      setNewWorkshop({
        title: '',
        description: '',
        expert_name: '',
        expert_profile_image: '',
        date: '',
        registration_url: '',
        is_recorded: false
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Error adding workshop:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add workshop',
        variant: 'destructive'
      });
    }
  };

  const handleEditClick = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setNewWorkshop({
      title: workshop.title,
      description: workshop.description || '',
      expert_name: workshop.expert_name,
      expert_profile_image: workshop.expert_profile_image || '',
      date: workshop.date.slice(0, 16), // Format for datetime-local input
      registration_url: workshop.registration_url,
      is_recorded: workshop.is_recorded
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateWorkshop = async () => {
    if (!selectedWorkshop) return;
    
    try {
      const { title, description, expert_name, expert_profile_image, date, registration_url, is_recorded } = newWorkshop;
      
      if (!title || !expert_name || !date || !registration_url) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        });
        return;
      }
      
      const { error } = await supabase
        .from('workshops')
        .update({
          title,
          description: description || null,
          expert_name,
          expert_profile_image: expert_profile_image || null,
          date,
          registration_url,
          is_recorded
        })
        .eq('id', selectedWorkshop.id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Workshop updated successfully'
      });
      
      setIsEditDialogOpen(false);
      setSelectedWorkshop(null);
      
      onRefresh();
    } catch (error: any) {
      console.error('Error updating workshop:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update workshop',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteWorkshop = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return;
    
    try {
      const { error } = await supabase
        .from('workshops')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Workshop deleted successfully'
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Error deleting workshop:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete workshop',
        variant: 'destructive'
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search workshops..." className="pl-10" />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Workshop
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {workshops.map(workshop => (
            <Card key={workshop.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-1">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10 mr-3">
                        {workshop.expert_profile_image ? (
                          <AvatarImage src={workshop.expert_profile_image} alt={workshop.expert_name} />
                        ) : (
                          <AvatarFallback>{getInitials(workshop.expert_name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{workshop.title}</h3>
                        <p className="text-sm text-muted-foreground">by {workshop.expert_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {format(parseISO(workshop.date), 'MMM d, yyyy - h:mm a')} {workshop.timezone}
                      </span>
                    </div>
                    
                    {workshop.is_recorded && (
                      <div className="inline-block bg-secondary px-2 py-1 rounded-full text-xs font-medium mb-3">
                        Recorded
                      </div>
                    )}
                    
                    {workshop.description && (
                      <p className="text-sm text-muted-foreground mt-2">{workshop.description}</p>
                    )}
                  </div>
                  
                  <div className="bg-muted p-6 flex flex-row md:flex-col items-center justify-center gap-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditClick(workshop)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDeleteWorkshop(workshop.id)}>
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {workshops.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No workshops found. Add your first workshop to get started.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Add Workshop Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Workshop</DialogTitle>
            <DialogDescription>
              Create a new workshop for users to join
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Workshop Title</Label>
              <Input
                id="title"
                name="title"
                value={newWorkshop.title}
                onChange={handleInputChange}
                placeholder="Introduction to AI Tools"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={newWorkshop.description}
                onChange={handleInputChange}
                placeholder="A workshop about..."
              />
            </div>
            
            <div>
              <Label htmlFor="expert_name">Expert Name</Label>
              <Input
                id="expert_name"
                name="expert_name"
                value={newWorkshop.expert_name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="expert_profile_image">Expert Profile Image URL</Label>
              <Input
                id="expert_profile_image"
                name="expert_profile_image"
                value={newWorkshop.expert_profile_image}
                onChange={handleInputChange}
                placeholder="https://example.com/profile.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="date">Workshop Date</Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={newWorkshop.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="registration_url">Registration URL</Label>
              <Input
                id="registration_url"
                name="registration_url"
                value={newWorkshop.registration_url}
                onChange={handleInputChange}
                placeholder="https://example.com/register"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="is_recorded"
                name="is_recorded"
                type="checkbox"
                checked={newWorkshop.is_recorded}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_recorded">This is a recorded workshop</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddWorkshop}>Add Workshop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Workshop Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Workshop</DialogTitle>
            <DialogDescription>
              Update workshop details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Workshop Title</Label>
              <Input
                id="edit-title"
                name="title"
                value={newWorkshop.title}
                onChange={handleInputChange}
                placeholder="Introduction to AI Tools"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                name="description"
                value={newWorkshop.description}
                onChange={handleInputChange}
                placeholder="A workshop about..."
              />
            </div>
            
            <div>
              <Label htmlFor="edit-expert_name">Expert Name</Label>
              <Input
                id="edit-expert_name"
                name="expert_name"
                value={newWorkshop.expert_name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-expert_profile_image">Expert Profile Image URL</Label>
              <Input
                id="edit-expert_profile_image"
                name="expert_profile_image"
                value={newWorkshop.expert_profile_image}
                onChange={handleInputChange}
                placeholder="https://example.com/profile.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-date">Workshop Date</Label>
              <Input
                id="edit-date"
                name="date"
                type="datetime-local"
                value={newWorkshop.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-registration_url">Registration URL</Label>
              <Input
                id="edit-registration_url"
                name="registration_url"
                value={newWorkshop.registration_url}
                onChange={handleInputChange}
                placeholder="https://example.com/register"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="edit-is_recorded"
                name="is_recorded"
                type="checkbox"
                checked={newWorkshop.is_recorded}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="edit-is_recorded">This is a recorded workshop</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateWorkshop}>Update Workshop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkshopsManagement;
