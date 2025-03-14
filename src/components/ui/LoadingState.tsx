
import Navbar from '@/components/layout/Navbar';

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Cargando..." }: LoadingStateProps) => {
  return (
    <div className="min-h-screen flex-col">
      <Navbar />
      <div className="flex justify-center items-center flex-grow py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </div>
  );
};

export default LoadingState;
