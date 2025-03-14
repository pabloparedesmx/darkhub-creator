
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsletterSubscribeProps {
  courseTitle?: string;
  className?: string;
}

const NewsletterSubscribe = ({ courseTitle, className = '' }: NewsletterSubscribeProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Error",
        description: "Por favor, introduce un email válido",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
      
      toast({
        title: "¡Suscripción exitosa!",
        description: "Recibirás actualizaciones sobre este curso",
      });
    }, 1000);
  };

  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardContent className="p-6">
        {!isSubscribed ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Suscríbete a las actualizaciones</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Recibe notificaciones cuando actualicemos este curso con nuevas lecciones o recursos.
              {courseTitle && ` Mantente al día con "${courseTitle}".`}
            </p>
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow"
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="sr-only">Cargando...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    <span>Suscribirse</span>
                  </span>
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-2">
            <CheckCircle className="h-12 w-12 text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-2">¡Gracias por suscribirte!</h3>
            <p className="text-sm text-muted-foreground text-center">
              Te avisaremos cuando haya novedades en este curso.
            </p>
            <Button 
              variant="ghost" 
              className="mt-3" 
              onClick={() => setIsSubscribed(false)}
            >
              Suscribir otro correo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsletterSubscribe;
