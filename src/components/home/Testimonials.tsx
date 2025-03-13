
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
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nuestra comunidad opina
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
              <Card className="h-full border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <p className="text-lg">{testimonial.content}</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                        <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
