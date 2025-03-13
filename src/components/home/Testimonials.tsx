
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    id: 1,
    content: "Esta plataforma ha revolucionado mi forma de trabajar con IA. Los cursos son claros y prácticos.",
    author: "María García",
    role: "Diseñadora UX",
    avatar: "/placeholder.svg"
  },
  {
    id: 2,
    content: "Pasé de no saber nada de IA a integrarla en mi flujo de trabajo diario en menos de un mes.",
    author: "Carlos Rodríguez",
    role: "Desarrollador Web",
    avatar: "/placeholder.svg"
  },
  {
    id: 3,
    content: "Los talleres en vivo son increíbles. He aprendido tanto y la comunidad es muy acogedora.",
    author: "Laura Martínez",
    role: "Emprendedora",
    avatar: "/placeholder.svg"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 px-4 ai-neural-bg">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm"></div>
      <div className="container mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 ai-gradient-text">
            Testimoniales
          </h2>
          <p className="text-xl text-blue-100/80 max-w-3xl mx-auto">
            Más de 20,000 usuarios nos respaldan
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full ai-card border-blue-500/20 hover:border-blue-400/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <p className="text-lg text-blue-100/90">{testimonial.content}</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-blue-500/20 flex items-center">
                      <Avatar className="h-10 w-10 mr-3 border border-blue-500/30">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                        <AvatarFallback className="bg-blue-900/60">{testimonial.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-blue-100">{testimonial.author}</p>
                        <p className="text-sm text-blue-200/60">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
