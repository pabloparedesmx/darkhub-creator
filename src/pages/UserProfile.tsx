
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // For debugging
  useEffect(() => {
    console.log('UserProfile - Current user:', user);
  }, [user]);

  // Function to upgrade to Pro (placeholder for now)
  const handleUpgradeToPro = async () => {
    setIsLoading(true);
    try {
      // Future implementation
      toast({
        title: "Coming soon",
        description: "Pro upgrade functionality will be available soon!",
      });
    } catch (error) {
      console.error('Error upgrading to pro:', error);
      toast({
        title: "Error",
        description: "Failed to process upgrade request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-6">
              <p className="text-center">Loading profile data...</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Configuración de Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <p className="text-lg">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Correo Electrónico</label>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Suscripción</label>
              <p className="text-lg capitalize">{user?.subscription || 'Gratis'}</p>
            </div>
            {user?.subscription === 'free' && (
              <Button 
                variant="default" 
                className="w-full"
                onClick={handleUpgradeToPro}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : 'Actualizar a Pro'}
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
