
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative py-20 md:py-32 flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20 z-0" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute h-56 w-56 rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: ['-20%', '30%', '-20%'],
            y: ['0%', '50%', '0%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ top: '10%', left: '20%' }}
        />
        <motion.div
          className="absolute h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"
          animate={{
            x: ['30%', '-20%', '30%'],
            y: ['20%', '60%', '20%'],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ top: '20%', right: '20%' }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Construye, escribe y aprende con IA
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto"
          >
            Únete a nuestra comunidad de más de 20.000 personas aprendiendo IA — personas con ideas afines listas para ayudarte a aprovechar al máximo las herramientas de IA, sin importar tus objetivos, rol o nivel de habilidad.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <Link to="/courses">
              <Button size="lg" className="w-full sm:w-auto">
                Explorar Cursos
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
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
              <span className="text-primary">•</span>
              <p className="text-muted-foreground"><span className="text-foreground font-medium">Conéctate con colegas</span> construyendo y compartiendo consejos y lecciones aprendidas</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-muted-foreground"><span className="text-foreground font-medium">Obtén insights de expertos</span> con nuestros <span className="text-foreground">talleres y demostraciones en vivo</span></p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-muted-foreground"><span className="text-foreground font-medium">Accede a más de 400</span> <span className="text-foreground">cursos bajo demanda</span></p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-muted-foreground"><span className="text-foreground font-medium">Descuentos exclusivos</span> en herramientas de IA (valor de +$6k)</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
