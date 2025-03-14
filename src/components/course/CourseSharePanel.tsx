
import { useState } from 'react';
import { ShareIcon, Copy, Twitter, Facebook, Linkedin, Bookmark, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useToast } from "@/hooks/use-toast";

interface CourseSharePanelProps {
  courseTitle: string;
}

const CourseSharePanel = ({ courseTitle }: CourseSharePanelProps) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Course link has been copied to clipboard",
      duration: 3000,
    });
  };

  const saveToBookmarks = () => {
    toast({
      title: "Saved",
      description: "Course has been added to your bookmarks",
      duration: 3000,
    });
  };

  return (
    <div className="bg-secondary/20 rounded-lg p-6 border border-border mt-2">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground flex items-center">
          <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
          Not Started
        </span>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={saveToBookmarks}>
                  <Bookmark className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => {}}>
                  <CheckCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark as complete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-4">Share with a friend</h3>
      <div className="mb-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center"
          onClick={copyToClipboard}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy to clipboard
        </Button>
      </div>

      <div className="flex justify-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => {}}>
                <Twitter className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on Twitter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => {}}>
                <Facebook className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on Facebook</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => {}}>
                <Linkedin className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on LinkedIn</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CourseSharePanel;
