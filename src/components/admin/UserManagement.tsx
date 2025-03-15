
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Check, X } from 'lucide-react';
import { UserProfile } from '@/types/admin';

interface UserManagementProps {
  users: UserProfile[];
  userSearchTerm: string;
  setUserSearchTerm: (value: string) => void;
  handleUpdateUserRole: (userId: string, currentRole: 'user' | 'admin') => Promise<void>;
  isUserLoading: boolean;
}

const UserManagement = ({
  users,
  userSearchTerm,
  setUserSearchTerm,
  handleUpdateUserRole,
  isUserLoading
}: UserManagementProps) => {
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage your platform users and their roles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              className="pl-10" 
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isUserLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-12 bg-muted/50 p-4 text-sm font-medium">
              <div className="col-span-4">User</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Subscription</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            
            {filteredUsers.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No users found. Try a different search term.</p>
              </div>
            ) : (
              filteredUsers.map(userProfile => (
                <div key={userProfile.id} className="grid grid-cols-12 p-4 border-t items-center">
                  <div className="col-span-4 font-medium truncate">{userProfile.name}</div>
                  <div className="col-span-3 text-muted-foreground truncate">{userProfile.email}</div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userProfile.role === 'admin' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {userProfile.role}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userProfile.subscription === 'pro' 
                        ? 'bg-badge-pro/20 text-badge-pro' 
                        : 'bg-badge-free/20 text-badge-free'
                    }`}>
                      {userProfile.subscription}
                    </span>
                  </div>
                  <div className="col-span-1 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateUserRole(userProfile.id, userProfile.role as 'user' | 'admin')}
                      title={userProfile.role === 'admin' ? 'Remove admin rights' : 'Make admin'}
                    >
                      {userProfile.role === 'admin' ? (
                        <X className="h-4 w-4 text-destructive" />
                      ) : (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
