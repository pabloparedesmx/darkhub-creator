
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
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
        <motion.div
          className="absolute h-72 w-72 rounded-full bg-violet-500/5 blur-3xl"
          animate={{
            x: ['-10%', '20%', '-10%'],
            y: ['30%', '10%', '30%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ bottom: '15%', left: '30%' }}
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
            Build, write and learn with AI
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto"
          >
            Join the 20,000+ AI learning community—likeminded people ready to help you get the most out of AI tools, no matter your goals, job role, or skill level.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <Link to="/courses">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Courses
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Join the Community
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
              <p className="text-muted-foreground"><span className="text-foreground font-medium">Connect with peers</span> building, sharing tips and lessons learned</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-muted-foreground"><span className="text-foreground font-medium">Get expert insights</span> with our <span className="text-foreground">live workshops and demos</span></p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-muted-foreground"><span className="text-foreground font-medium">Access 400+ on-demand</span> <span className="text-foreground">bite-sized courses</span></p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <p className="text-muted-foreground"><span className="text-foreground font-medium">Exclusive</span> <span className="text-foreground">discounts</span> on AI tools ($6k+ value)</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
