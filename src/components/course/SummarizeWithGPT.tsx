
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Copy, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface SummarizeWithGPTProps {
  courseTitle: string;
  courseContent: string;
  className?: string;
}

const SummarizeWithGPT = ({ courseTitle, courseContent, className = '' }: SummarizeWithGPTProps) => {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Requesting summary for course:", courseTitle);
      
      // Make API call to the Gemini API through our backend proxy
      const { data, error: fnError } = await supabase.functions.invoke("summarize-with-gemini", {
        body: {
          title: courseTitle,
          content: courseContent
        }
      });
      
      if (fnError) {
        throw new Error(`Error calling function: ${fnError.message}`);
      }
      
      if (!data || !data.summary) {
        throw new Error('No se recibió ningún resumen del servidor');
      }
      
      setSummary(data.summary);
      toast({
        title: "Resumen generado",
        description: "Se ha generado un resumen del curso correctamente",
        duration: 3000
      });
    } catch (err) {
      console.error('Error generating summary:', err);
      setError(err instanceof Error ? err.message : 'Error al generar el resumen');
      toast({
        title: "Error",
        description: "No se pudo generar el resumen. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast({
      title: "Copiado",
      description: "Resumen copiado al portapapeles",
      duration: 3000
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Resúmelo con GPT</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Genera un resumen conciso del contenido de este curso utilizando inteligencia artificial.
        </p>
        
        {!summary && !isLoading && !error && (
          <Button 
            onClick={handleSummarize} 
            className="w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generar resumen
          </Button>
        )}
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Generando resumen...</p>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center text-center py-2">
            <AlertCircle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-sm text-destructive">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => setError(null)}
            >
              Intentar de nuevo
            </Button>
          </div>
        )}
        
        {summary && !isLoading && (
          <div className="mt-2">
            <div className="bg-muted/50 p-4 rounded-md text-sm mb-4 max-h-48 overflow-y-auto">
              {summary}
            </div>
            <Button 
              variant="secondary" 
              className="w-full" 
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar al portapapeles
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummarizeWithGPT;
