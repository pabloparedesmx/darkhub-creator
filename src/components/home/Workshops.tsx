
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, User, Monitor } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Workshop } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

const Workshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('workshops')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        setWorkshops(data as Workshop[]);
      } catch (error: any) {
        console.error('Error fetching workshops:', error);
        toast({
          title: 'Error',
          description: 'Failed to load workshops',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshops();
  }, [toast]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Group workshops by status (upcoming vs. recorded)
  const upcomingWorkshops = workshops.filter(workshop => !workshop.is_recorded);
  const recordedWorkshops = workshops.filter(workshop => workshop.is_recorded);

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Workshops
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our live workshops with experts in AI and technology
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Upcoming Workshops */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Upcoming Workshops</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingWorkshops.map((workshop, index) => (
                  <motion.div
                    key={workshop.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <Avatar className="h-12 w-12 mr-3 border-2 border-primary/20">
                                {workshop.expert_profile_image ? (
                                  <AvatarImage src={workshop.expert_profile_image} alt={workshop.expert_name} />
                                ) : (
                                  <AvatarFallback>{getInitials(workshop.expert_name)}</AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Expert</p>
                                <p className="font-medium">{workshop.expert_name}</p>
                              </div>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-3">{workshop.title}</h3>
                          
                          {workshop.description && (
                            <p className="text-muted-foreground mb-4 line-clamp-3">{workshop.description}</p>
                          )}
                          
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {format(parseISO(workshop.date), 'MMMM d, yyyy')} at {format(parseISO(workshop.date), 'h:mm a')} {workshop.timezone}
                            </span>
                          </div>
                          
                          <div className="mt-6">
                            <Button asChild className="w-full">
                              <a href={workshop.registration_url} target="_blank" rel="noopener noreferrer">
                                Register Now
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {upcomingWorkshops.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No upcoming workshops scheduled at the moment.</p>
                </div>
              )}
            </div>

            {/* Recorded Workshops */}
            {recordedWorkshops.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Past Recordings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recordedWorkshops.map((workshop, index) => (
                    <motion.div
                      key={workshop.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow bg-secondary/20">
                        <CardContent className="p-0">
                          <div className="relative p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center">
                                <Avatar className="h-12 w-12 mr-3 border-2 border-primary/20">
                                  {workshop.expert_profile_image ? (
                                    <AvatarImage src={workshop.expert_profile_image} alt={workshop.expert_name} />
                                  ) : (
                                    <AvatarFallback>{getInitials(workshop.expert_name)}</AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Expert</p>
                                  <p className="font-medium">{workshop.expert_name}</p>
                                </div>
                              </div>
                              <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium flex items-center">
                                <Monitor className="h-3 w-3 mr-1" />
                                Recorded
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-bold mb-3">{workshop.title}</h3>
                            
                            {workshop.description && (
                              <p className="text-muted-foreground mb-4 line-clamp-3">{workshop.description}</p>
                            )}
                            
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                Recorded on {format(parseISO(workshop.date), 'MMMM d, yyyy')}
                              </span>
                            </div>
                            
                            <div className="mt-6">
                              <Button asChild variant="outline" className="w-full">
                                <a href={workshop.registration_url} target="_blank" rel="noopener noreferrer">
                                  Watch Recording
                                  <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Workshops;
