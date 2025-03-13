
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import RichTextContent from '@/components/ui/RichTextContent';
import { DbCourse } from '@/types/admin';

interface CourseHeaderProps {
  course: Omit<DbCourse, 'badges'> & {
    badges: Array<'tutorial' | 'pro' | 'free'>;
  };
}

const CourseHeader = ({ course }: CourseHeaderProps) => {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  return (
    <div>
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/courses">Catalog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{course.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Course title and description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
          {course.difficulty && (
            <span className={`text-xs rounded-full px-2 py-0.5 ${difficultyColors[course.difficulty as keyof typeof difficultyColors]}`}>
              {course.difficulty}
            </span>
          )}
        </div>
        <RichTextContent content={course.description} />
      </motion.div>
    </div>
  );
};

export default CourseHeader;
