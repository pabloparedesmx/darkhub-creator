
import { motion } from 'framer-motion';
import { Tool } from '@/types/admin';
import ToolCard from './ToolCard';

interface ToolGridProps {
  tools: Tool[];
}

const ToolGrid = ({ tools }: ToolGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.length > 0 ? (
        tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ToolCard tool={tool} />
          </motion.div>
        ))
      ) : (
        <div className="col-span-3 text-center py-10">
          <p className="text-muted-foreground">No tools found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
};

export default ToolGrid;
