
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { PromptWithCategory } from '@/types/prompt';
import { Link } from 'react-router-dom';

interface PromptCardProps {
  prompt: PromptWithCategory;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <Link to={`/prompts/${prompt.id}`} className="flex-1 flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-xl leading-tight">{prompt.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="prose dark:prose-invert line-clamp-3 text-sm text-muted-foreground">
            <div dangerouslySetInnerHTML={{ __html: prompt.content.substring(0, 120) + '...' }} />
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(prompt.created_at), 'MMM d, yyyy')}
          </div>
          {prompt.categories && (
            <Badge variant="outline" className="text-xs">
              {prompt.categories.name}
            </Badge>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
};
