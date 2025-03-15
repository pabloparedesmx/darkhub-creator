
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthFormContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkUrl: string;
}

const AuthFormContainer = ({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkUrl
}: AuthFormContainerProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#051526] bg-gradient-to-b from-[#051526] to-[#0a2540]">
      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            <div className="flex justify-center mb-8">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/a1eb8418-2a78-4ec8-b3f9-ac0807a34936.png" 
                  alt="AI Makers" 
                  className="h-12" 
                />
              </Link>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
              <p className="text-blue-100/70 text-sm">{subtitle}</p>
            </div>
            
            {children}
            
            <div className="mt-6 text-center text-sm text-blue-100/70">
              {footerText}{" "}
              <Link to={footerLinkUrl} className="text-blue-400 hover:text-blue-300 hover:underline">
                {footerLinkText}
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AuthFormContainer;
