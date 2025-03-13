
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const projectCards = [
  {
    id: 1,
    title: 'Sitio web personal "link-in-bio"',
    icon: '🌐',
    link: '/projects/link-in-bio'
  },
  {
    id: 2,
    title: 'App web simple usando una API pública',
    icon: '🔌',
    link: '/projects/web-app-api'
  },
  {
    id: 3,
    title: 'Resumidor de texto con API de IA',
    icon: '📝',
    link: '/projects/text-summariser'
  }
];

const GetStarted = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden ai-section-gradient">
      <div className="absolute inset-0 opacity-30 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/20 to-transparent"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-blue-400">¿Tienes 2 minutos?</span> Construye tu primera app...
          </h2>
          <p className="text-xl text-blue-100/80 mb-8">
            Una forma rápida, fácil y gratuita de comenzar a construir con IA
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="ai-card p-6 mb-8"
          >
            <div className="inline-block px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm font-medium text-blue-400 mb-4">
              Paso 1 - Elige un proyecto
            </div>
            <p className="text-blue-100/80 mb-6">
              Selecciona un proyecto → copia el prompt de PRD → pégalo en tu herramienta favorita
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projectCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                >
                  <Link to={card.link}>
                    <Card className="h-full bg-blue-950/40 hover:bg-blue-900/40 transition-colors border-blue-500/20 hover:border-blue-400/30 cursor-pointer overflow-hidden">
                      <CardContent className="p-6 flex items-center">
                        <div className="mr-4 text-3xl">{card.icon}</div>
                        <div>
                          <h3 className="font-medium text-blue-100">{card.title}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <Link to="/projects">
              <Button variant="outline" className="group border-blue-500/30 text-blue-100 hover:bg-blue-900/20">
                Explorar todos los proyectos iniciales
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
