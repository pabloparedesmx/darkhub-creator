
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative py-32 md:py-48 flex items-center justify-center overflow-hidden ai-neural-bg">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 ai-gradient-text ai-blue-glow"
          >
            Domina la IA
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-100/90 mb-10 max-w-3xl mx-auto"
          >
            Únete a nuestra comunidad de más de 20.000 personas aprendiendo IA — personas con ideas afines listas para ayudarte a aprovechar al máximo las herramientas de IA.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <Link to="/courses">
              <Button size="lg" className="w-full sm:w-auto ai-button">
                Explorar Cursos
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-blue-500/50 text-blue-100 hover:bg-blue-900/20">
                Unirse a la Comunidad
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-6 text-left"
          >
            <div className="flex items-start space-x-2">
              <span className="text-blue-400">•</span>
              <p className="text-blue-100/70"><span className="text-blue-100 font-medium">Conéctate con colegas</span> construyendo y compartiendo consejos y lecciones aprendidas</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400">•</span>
              <p className="text-blue-100/70"><span className="text-blue-100 font-medium">Obtén insights de expertos</span> con nuestros <span className="text-blue-100">talleres y demostraciones en vivo</span></p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400">•</span>
              <p className="text-blue-100/70"><span className="text-blue-100 font-medium">Accede a más de 400</span> <span className="text-blue-100">cursos bajo demanda</span></p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400">•</span>
              <p className="text-blue-100/70"><span className="text-blue-100 font-medium">Descuentos exclusivos</span> en herramientas de IA (valor de +$6k)</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
