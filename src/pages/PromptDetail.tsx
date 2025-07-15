import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Copy, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PromptWithCategory } from '@/types/prompt';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import RichTextContent from '@/components/ui/RichTextContent';
import SEO from '@/components/ui/SEO';

const PromptDetail = () => {
  const { id } = useParams<{ id: string; }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Fetch the prompt
  const { data: prompt, error, isLoading } = useQuery({
    queryKey: ['prompt', id],
    queryFn: async () => {
      if (!id) throw new Error('Prompt ID is required');
      const {
        data,
        error
      } = await supabase.from('prompts').select(`
          *,
          categories (
            name
          )
        `).eq('id', id).single();
      if (error) throw error;
      return data as PromptWithCategory;
    }
  });

  const handleCopyPrompt = () => {
    if (!prompt) return;

    // Create a temporary element to strip HTML tags for copying
    const tempElement = document.createElement('div');
    tempElement.innerHTML = prompt.content;
    const textContent = tempElement.textContent || tempElement.innerText || '';
    navigator.clipboard.writeText(textContent).then(() => {
      setCopied(true);
      toast({
        title: "¡Copiado!",
        description: "El prompt ha sido copiado al portapapeles"
      });
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Error",
        description: "No se pudo copiar el prompt",
        variant: "destructive"
      });
    });
  };

  if (isLoading) {
    return <LoadingState message="Cargando prompt..." />;
  }

  if (error || !prompt) {
    return <ErrorState message="No se pudo cargar el prompt" />;
  }

  return (
    <Layout>
      {/* Add SEO component with dynamic data */}
      <SEO
        title={`${prompt.name} | AI Makers Prompts`}
        description={`${prompt.name} - Prompt optimizado para ${prompt.categories?.name || 'uso general'}`}
        type="article"
      />
      
      <motion.div initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="container py-0">
        <div className="mt-8 mb-10"> {/* Added top margin and increased bottom margin */}
          <Button variant="ghost" onClick={() => navigate('/prompts')} className="mb-8" // Increased from mb-4 to mb-8
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a prompts
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6"> {/* Increased gaps from gap-4 to gap-6 and mb-2 to mb-6 */}
            <h1 className="text-3xl font-bold">{prompt.name}</h1>
            <Button onClick={handleCopyPrompt} className="w-full md:w-auto">
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "¡Copiado!" : "Copiar prompt"}
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8"> {/* Increased from mb-6 to mb-8 */}
            <span>
              Creado: {format(new Date(prompt.created_at), 'dd MMM yyyy')}
            </span>
            {prompt.categories && <Badge variant="outline">
                {prompt.categories.name}
              </Badge>}
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-8 mb-8"> {/* Increased padding from p-6 to p-8, added bottom margin */}
          <RichTextContent content={prompt.content} className="prose dark:prose-invert max-w-none" />
        </div>
      </motion.div>
    </Layout>
  );
};

export default PromptDetail;
