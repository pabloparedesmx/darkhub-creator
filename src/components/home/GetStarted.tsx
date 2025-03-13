
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
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background z-0" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">¿Tienes 2 minutos?</span> Construye tu primera app...
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Una forma rápida, fácil y gratuita de comenzar a construir con IA
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-secondary/30 border border-border/60 rounded-lg p-4 mb-8"
          >
            <div className="inline-block px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
              Paso 1 - Elige un proyecto
            </div>
            <p className="text-muted-foreground mb-6">
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
                    <Card className="h-full bg-background hover:bg-secondary/20 transition-colors border-border hover:border-primary/20 cursor-pointer overflow-hidden">
                      <CardContent className="p-6 flex items-center">
                        <div className="mr-4 text-3xl">{card.icon}</div>
                        <div>
                          <h3 className="font-medium text-foreground">{card.title}</h3>
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
              <Button variant="outline" className="group">
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
