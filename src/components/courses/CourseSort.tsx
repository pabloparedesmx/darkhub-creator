
interface CourseSortProps {
  onSortChange: (value: string) => void;
}

const CourseSort = ({ onSortChange }: CourseSortProps) => {
  return (
    <div className="w-full sm:w-auto flex items-center">
      <span className="text-sm text-muted-foreground mr-2">Sort</span>
      <select 
        className="py-2 px-3 rounded-md bg-secondary/50 text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary"
        onChange={(e) => onSortChange(e.target.value)}
        defaultValue="newest"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
        <option value="popular">Most Popular</option>
      </select>
    </div>
  );
};

export default CourseSort;
