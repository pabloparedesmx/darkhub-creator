
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./hooks/use-theme";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Courses from "./pages/Courses";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/AdminDashboard";
import CourseDetails from "./pages/CourseDetails";
import NotFound from "./pages/NotFound";
import CoursePlayer from "./pages/CoursePlayer";
import CourseEditor from "./pages/CourseEditor";
import Prompts from "./pages/Prompts";
import PromptDetail from "./pages/PromptDetail";
import Tools from "./pages/Tools";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";

// Create a global query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Structured data for the website (Schema.org)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AI Makers",
  "url": "https://aimakers.app/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://aimakers.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "description": "Plataforma educativa para aprender a utilizar herramientas de IA con tutoriales, prompts y recursos para creadores digitales."
};

const App = () => {
  // Add structured data to the page
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected routes for all authenticated users */}
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Navigate to="/courses" replace />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:slug" element={<CourseDetails />} />
                  <Route path="/courses/:slug/learn" element={<CoursePlayer />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/prompts" element={<Prompts />} />
                  <Route path="/prompts/:id" element={<PromptDetail />} />
                  <Route path="/tools" element={<Tools />} />
                </Route>
                
                {/* Admin-only routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/courses/new" element={<CourseEditor />} />
                  <Route path="/admin/courses/edit/:courseId" element={<CourseEditor />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
