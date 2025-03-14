
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/525d6862-75f0-45e4-90d6-55b2eff2c439.png" 
              alt="Pricing icon" 
              className="h-16 w-16"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 ai-gradient-text">
            Access hundreds of AI tutorials, guides and resources
          </h2>
          <p className="text-xl text-blue-100/70 max-w-3xl mx-auto">
            Everything is free for registered users.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full border-blue-500/20 overflow-hidden">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Free access to all courses</h3>
                  <div className="mt-6">
                    <Link to="/signup">
                      <Button variant="default" className="w-full mb-6">
                        Sign up for free access
                      </Button>
                    </Link>
                  </div>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Access all courses & tutorials</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Weekly digest with news, tools & resources</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Community access and support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
