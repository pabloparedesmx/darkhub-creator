
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';

const faqs = [
  {
    question: "¿Necesito experiencia previa con IA?",
    answer: "No, nuestros cursos están diseñados para todos los niveles, desde principiantes absolutos hasta usuarios avanzados. Tenemos cursos introductorios que te enseñarán los conceptos básicos desde cero."
  },
  {
    question: "¿Cuánto cuesta la membresía?",
    answer: "Ofrecemos diferentes planes, incluyendo un plan gratuito con acceso limitado y planes premium desde $9.99 al mes con acceso completo a todos los cursos y recursos."
  },
  {
    question: "¿Puedo cancelar mi suscripción en cualquier momento?",
    answer: "Sí, puedes cancelar tu suscripción en cualquier momento. No hay compromisos a largo plazo ni cargos ocultos."
  },
  {
    question: "¿Los certificados tienen valor oficial?",
    answer: "Nuestros certificados demuestran que has completado el curso, pero no son acreditados por ninguna institución educativa. Sin embargo, son reconocidos en la industria y pueden ser añadidos a tu CV o perfil de LinkedIn."
  },
  {
    question: "¿Tienen soporte para estudiantes?",
    answer: "Sí, ofrecemos soporte por correo electrónico y a través de nuestra comunidad. Los miembros premium también tienen acceso a sesiones de mentoría personalizadas."
  },
  {
    question: "¿Con qué frecuencia se agregan nuevos cursos?",
    answer: "Agregamos nuevos cursos y actualizamos el contenido existente regularmente, aproximadamente 3-5 cursos nuevos cada mes, para mantenernos al día con las últimas tendencias y herramientas de IA."
  }
];

const FAQ = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
            Preguntas frecuentes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Respuestas a las dudas más comunes
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion
            type="multiple"
            value={expandedItems}
            onValueChange={setExpandedItems}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <AccordionItem value={`item-${index}`} className="border border-border rounded-lg overflow-hidden bg-background">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-secondary/20">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-10"
          >
            <p className="mb-4 text-muted-foreground">¿Tienes más preguntas?</p>
            <Button>Contáctanos</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
