
import React from 'react';
import { PromptWithCategory } from '@/types/prompt';
import { PromptCard } from './PromptCard';

interface PromptGridProps {
  prompts: PromptWithCategory[];
}

export const PromptGrid: React.FC<PromptGridProps> = ({ prompts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
};
