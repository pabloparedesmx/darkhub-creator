
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Book, Users, DollarSign, ShoppingCart } from 'lucide-react';

const AdminSidebar = () => {
  return (
    <div className="md:col-span-3">
      <Card className="bg-secondary/30 backdrop-blur-sm mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col items-center pt-4 pb-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-1">Admin Panel</h2>
            <p className="text-muted-foreground text-sm">Manage your content</p>
          </div>
          
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Book className="mr-2 h-5 w-5" />
              Content
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-5 w-5" />
              Users
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <DollarSign className="mr-2 h-5 w-5" />
              Subscriptions
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSidebar;
