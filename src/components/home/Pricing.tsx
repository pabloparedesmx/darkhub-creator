
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
            That's just a taste—ready to take your first bite?
          </h2>
          <p className="text-xl text-blue-100/70 max-w-3xl mx-auto">
            Pick a plan that suits you or your team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                  <h3 className="text-xl font-bold mb-2">Free—basic access</h3>
                  <div className="mt-6">
                    <Link to="/signup">
                      <Button variant="outline" className="w-full mb-6">
                        Get started for free
                      </Button>
                    </Link>
                  </div>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Access our free courses & tutorials</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>2x weekly digest with news, tools & resources</span>
                  </li>
                  <li className="flex items-start text-muted-foreground">
                    <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="line-through">Community access, courses, tutorials, discounts and workshops</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-full border-blue-500/20 bg-blue-950/20 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div>
                    <div className="inline-block bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm font-medium mb-2">
                      30% off for a limited time
                    </div>
                    <h3 className="text-xl font-bold">Personal—start building with AI</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                    <div className="border border-blue-500/30 rounded-lg px-4 py-2 text-center min-w-[120px]">
                      <div className="text-xl font-bold text-blue-400">$225</div>
                      <div className="text-sm text-blue-300">- lifetime</div>
                      <div className="text-xs text-blue-400/70">pay once—was $325</div>
                    </div>
                    
                    <div className="border border-blue-500/30 rounded-lg px-4 py-2 text-center min-w-[120px]">
                      <div className="text-xl font-bold text-blue-400">$175</div>
                      <div className="text-sm text-blue-300">- yearly</div>
                      <div className="text-xs text-blue-400/70">was $250</div>
                    </div>
                  </div>
                </div>

                <Link to="/signup">
                  <Button className="w-full mb-4 ai-button">
                    Upgrade for full access
                  </Button>
                </Link>
                
                <p className="text-sm text-center text-blue-300/60 mb-6">
                  30-day no questions asked refund
                </p>

                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>A network of like-minded peers through <strong>private community</strong> discussions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>400+ courses & tutorials</strong></span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Live and recorded <strong>expert workshops</strong></span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Discounts</strong> on AI tools ($6k+ value)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Certifications</strong> for completed courses</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 lg:col-span-3"
          >
            <Card className="border-blue-500/20 bg-blue-950/10 overflow-hidden">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-xl font-bold mb-4">Team—upskill your team</h3>
                    <Link to="/contact">
                      <Button variant="outline" className="w-full mb-6">
                        Learn more
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Team management & flexible seat transfer</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Assign content to members</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Advanced analytics and progress tracking</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Dedicated account manager</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
