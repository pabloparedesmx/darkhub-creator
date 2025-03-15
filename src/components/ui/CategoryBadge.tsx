
import { cn } from "@/lib/utils";

type CategoryBadgeProps = {
  type: 'tutorial' | 'pro' | 'free';
  className?: string;
};

const CategoryBadge = ({ type, className }: CategoryBadgeProps) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded";
  
  const styleMap = {
    tutorial: "bg-blue-100 text-blue-700 border border-blue-200",
    pro: "bg-purple-100 text-purple-700 border border-purple-200",
    free: "bg-green-100 text-green-700 border border-green-200",
  };

  return (
    <span className={cn(baseClasses, styleMap[type], className)}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

export default CategoryBadge;
