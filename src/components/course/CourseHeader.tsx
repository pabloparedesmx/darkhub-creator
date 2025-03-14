
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import RichTextContent from '@/components/ui/RichTextContent';
import { DbCourse } from '@/types/admin';

interface CourseHeaderProps {
  course: Omit<DbCourse, 'badges'> & {
    badges: Array<'tutorial' | 'pro' | 'free'>;
  };
}

const CourseHeader = ({ course }: CourseHeaderProps) => {
  return (
    <div className="mb-12">
      {/* Breadcrumb */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/courses">Tutoriales</Link>
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
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
          {/* Subtitle (brief description) */}
          <p className="text-lg text-muted-foreground mb-10">
            {course.short_description || "Aprende a usar esta herramienta de manera efectiva para tus proyectos."}
          </p>
        </div>
        
        {/* Full Rich Text Description */}
        <div className="mt-6 prose dark:prose-invert max-w-none">
          <RichTextContent content={course.description} />
        </div>
      </motion.div>
    </div>
  );
};

export default CourseHeader;
