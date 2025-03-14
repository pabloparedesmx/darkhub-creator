
import { motion } from 'framer-motion';
import CourseCard, { Course } from '@/components/ui/CourseCard';
import { Button } from '@/components/ui/button';

interface CourseGridProps {
  courses: Course[];
  coursesData: Course[];
  clearAllFilters: () => void;
  featured?: boolean;
}

const CourseGrid = ({ courses, coursesData, clearAllFilters, featured = false }: CourseGridProps) => {
  return (
    <>
      <div className="text-sm text-muted-foreground mb-6">
        Mostrando {courses.length} de {coursesData.length}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <CourseCard 
              course={course} 
              featured={featured && index === 0} 
            />
          </motion.div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No hay cursos que coincidan con tus filtros. Intenta ajustar tus criterios de búsqueda.</p>
          <Button 
            variant="outline" 
            onClick={clearAllFilters}
            className="mt-4"
          >
            Limpiar todos los filtros
          </Button>
        </div>
      )}
    </>
  );
};

export default CourseGrid;
