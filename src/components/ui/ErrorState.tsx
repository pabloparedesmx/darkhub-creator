
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

interface ErrorStateProps {
  title?: string;
  message?: string;
}

const ErrorState = ({ 
  title = "No Encontrado", 
  message = "El recurso que estás buscando no existe o ha sido eliminado."
}: ErrorStateProps) => {
  return (
    <div className="min-h-screen flex-col">
      <Navbar />
      <div className="flex justify-center items-center flex-grow py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <p className="mb-6">{message}</p>
          <Button asChild>
            <Link to="/courses">Volver a Cursos</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
