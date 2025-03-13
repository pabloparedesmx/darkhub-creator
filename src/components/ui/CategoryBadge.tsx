
import { cn } from "@/lib/utils";

type CategoryBadgeProps = {
  type: 'tutorial' | 'pro' | 'free';
  className?: string;
};

const CategoryBadge = ({ type, className }: CategoryBadgeProps) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded";
  
  const styleMap = {
    tutorial: "bg-badge-tutorial/10 text-badge-tutorial border border-badge-tutorial/20",
    pro: "bg-badge-pro/10 text-badge-pro border border-badge-pro/20",
    free: "bg-badge-free/10 text-badge-free border border-badge-free/20",
  };

  return (
    <span className={cn(baseClasses, styleMap[type], className)}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

export default CategoryBadge;
