
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface CourseSearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const CourseSearch = ({ searchTerm, setSearchTerm }: CourseSearchProps) => {
  return (
    <div className="w-full sm:w-auto relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search tutorials and courses"
        className="pl-10 pr-4 py-2 w-full sm:w-80 bg-secondary/50 hover:bg-secondary/80 focus:bg-secondary"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button 
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          onClick={() => setSearchTerm('')}
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  );
};

export default CourseSearch;
