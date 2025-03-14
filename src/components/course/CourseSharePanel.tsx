
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
interface CourseSharePanelProps {
  courseTitle: string;
}
const CourseSharePanel = ({
  courseTitle
}: CourseSharePanelProps) => {
  const {
    toast
  } = useToast();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Enlace copiado",
      description: "El enlace del curso ha sido copiado al portapapeles",
      duration: 3000
    });
  };
  return <div className="bg-card rounded-lg border dark:border-blue-500/20 p-6 shadow-sm dark:shadow-blue-500/5">
      <h3 className="text-lg font-medium mb-4">Comparte con un amigo</h3>
      
      <Button variant="outline" className="w-full mb-4 justify-center dark:border-blue-500/30 dark:hover:border-blue-500/50" onClick={copyToClipboard}>
        <Copy className="mr-2 h-4 w-4" />
        Copiar al portapapeles
      </Button>
      
      <div className="flex justify-between">
        <Button variant="outline" size="icon" className="rounded-md flex-1 mr-2 dark:border-blue-500/30 dark:hover:border-blue-500/50" onClick={() => {
        window.open(`https://twitter.com/intent/tweet?text=Mira este curso: ${courseTitle}&url=${window.location.href}`, '_blank');
      }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
          </svg>
        </Button>
        
        <Button variant="outline" size="icon" className="rounded-md flex-1 mx-2 dark:border-blue-500/30 dark:hover:border-blue-500/50" onClick={() => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
      }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" fill="currentColor" />
          </svg>
        </Button>
        
        <Button variant="outline" size="icon" className="rounded-md flex-1 ml-2 dark:border-blue-500/30 dark:hover:border-blue-500/50" onClick={() => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank');
      }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z" fill="currentColor" />
            <path d="M5 10C5 9.44772 5.44772 9 6 9H7C7.55228 9 8 9.44771 8 10V18C8 18.5523 7.55228 19 7 19H6C5.44772 19 5 18.5523 5 18V10Z" fill="currentColor" />
            <path d="M11 19H12C12.5523 19 13 18.5523 13 18V13.5C13 12 16 11 16 13V18.0004C16 18.5527 16.4477 19 17 19H18C18.5523 19 19 18.5523 19 18V12C19 10 17.5 9 15.5 9C13.5 9 13 10.5 13 10.5V10C13 9.44771 12.5523 9 12 9H11C10.4477 9 10 9.44772 10 10V18C10 18.5523 10.4477 19 11 19Z" fill="currentColor" />
          </svg>
        </Button>
      </div>
    </div>;
};
export default CourseSharePanel;
