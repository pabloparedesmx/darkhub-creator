
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Book, Users, DollarSign, ShoppingCart, PlusCircle, Trash, Pencil, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Category } from '@/types/admin';
import { Link } from 'react-router-dom';

interface AdminSidebarProps {
  categories: Category[];
  newCategory: string;
  setNewCategory: (value: string) => void;
  handleAddCategory: () => void;
  handleDeleteCategory: (id: string) => void;
  handleUpdateCategory?: (id: string, name: string) => void;
  isLoading: boolean;
}

const AdminSidebar = ({
  categories,
  newCategory,
  setNewCategory,
  handleAddCategory,
  handleDeleteCategory,
  handleUpdateCategory,
  isLoading
}: AdminSidebarProps) => {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState<string>('');

  const startEditing = (id: string, name: string) => {
    setEditingCategoryId(id);
    setEditingCategoryName(name);
  };

  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const saveEditing = (id: string) => {
    if (handleUpdateCategory && editingCategoryName.trim()) {
      handleUpdateCategory(id, editingCategoryName);
    }
    setEditingCategoryId(null);
  };

  return (
    <div className="md:col-span-3">
      <Card className="bg-secondary/30 backdrop-blur-sm mb-6 dark:bg-[#0c1626] dark:border-cyan-500/20 rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col items-center pt-4 pb-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-4 dark:bg-cyan-500/10 dark:border-cyan-500/40">
              <Users className="w-12 h-12 text-primary dark:text-cyan-400" />
            </div>
            <h2 className="text-xl font-semibold mb-1 dark:text-cyan-50">Admin Panel</h2>
            <p className="text-muted-foreground text-sm dark:text-cyan-100/60">Manage your content</p>
          </div>
          
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start dark:text-cyan-100 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-400" asChild>
              <Link to="/courses">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-cyan-100 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-400">
              <Book className="mr-2 h-5 w-5" />
              Content
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-cyan-100 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-400">
              <Users className="mr-2 h-5 w-5" />
              Users
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-cyan-100 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-400">
              <DollarSign className="mr-2 h-5 w-5" />
              Subscriptions
            </Button>
            <Button variant="ghost" className="w-full justify-start dark:text-cyan-100 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-400">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Orders
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-secondary/30 backdrop-blur-sm dark:bg-[#0c1626] dark:border-cyan-500/20 rounded-xl">
        <CardContent>
          <div className="flex justify-between items-center py-2">
            <span className="text-xl font-semibold dark:text-cyan-50">Categories</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="dark:text-cyan-400 dark:hover:bg-cyan-500/10">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-[#0c1626] dark:border-cyan-500/20 rounded-xl">
                <DialogHeader>
                  <DialogTitle className="dark:text-cyan-50">Add Category</DialogTitle>
                  <DialogDescription className="dark:text-cyan-100/60">
                    Create a new category for organizing content
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="categoryName" className="dark:text-cyan-50">Category Name</label>
                    <Input 
                      id="categoryName" 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value)} 
                      placeholder="e.g. AI Tools, Marketing, etc."
                      className="dark:border-cyan-500/30 dark:bg-[#071323] rounded-lg"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddCategory} variant="cyan" className="rounded-lg">Add Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            <div className="space-y-2 mt-2">
              {categories.map(category => (
                <div key={category.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-secondary/50 dark:hover:bg-cyan-500/10">
                  {editingCategoryId === category.id ? (
                    <div className="flex items-center space-x-2 w-full">
                      <Input 
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        className="text-sm h-8 dark:border-cyan-500/30 dark:bg-[#071323] rounded-lg"
                        autoFocus
                      />
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => saveEditing(category.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={cancelEditing}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-sm font-medium dark:text-cyan-50">{category.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground dark:text-cyan-400/60">({category.count})</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => startEditing(category.id, category.name)}
                          className="h-8 w-8 p-0 dark:text-cyan-400 dark:hover:bg-cyan-500/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="h-8 w-8 p-0 text-destructive dark:hover:bg-red-500/10"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSidebar;
