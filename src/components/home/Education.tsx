
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const Education = () => {
  return (
    <section className="py-20 px-4 bg-secondary/10">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Consejos prácticos, educación, eventos y más
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Todo lo que necesitas para dominar las herramientas de IA
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full bg-background border-border">
              <CardContent className="p-6">
                <div className="mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Biblioteca de recursos</h3>
                <p className="text-muted-foreground mb-4">
                  Accede a nuestra colección de guías, tutoriales y documentos para aprender a tu propio ritmo.
                </p>
                <Link to="/resources">
                  <Button variant="outline" className="group mt-2">
                    Explorar recursos
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full bg-background border-border">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Comunidad activa</h3>
                <p className="text-muted-foreground mb-4">
                  Únete a nuestra comunidad de entusiastas de la IA para compartir conocimientos y resolver dudas.
                </p>
                <Link to="/community">
                  <Button variant="outline" className="group mt-2">
                    Unirse ahora
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full bg-background border-border">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Talleres en vivo</h3>
                <p className="text-muted-foreground mb-4">
                  Participa en nuestros talleres semanales donde expertos explican los últimos avances en IA.
                </p>
                <div className="bg-secondary/40 p-4 rounded-md mb-4">
                  <p className="text-sm font-medium">Próximo evento: 15 de junio</p>
                  <p className="text-sm text-muted-foreground">Introducción a Midjourney v6</p>
                </div>
                <Button className="w-full">Registrarse</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Education;
