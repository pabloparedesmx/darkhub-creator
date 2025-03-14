
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, User, Monitor } from 'lucide-react';
import { Workshop } from '@/types/admin';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI Workshops
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join our live workshops with experts in AI and technology to enhance your skills and knowledge
              </p>
            </motion.div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Upcoming Workshops */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold mb-8">Upcoming Workshops</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingWorkshops.length > 0 ? upcomingWorkshops.map((workshop, index) => (
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
                                <p className="text-muted-foreground mb-4">{workshop.description}</p>
                              )}
                              
                              <div className="flex items-center text-sm text-muted-foreground mb-4">
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
                    )) : (
                      <div className="col-span-full text-center py-10">
                        <p className="text-muted-foreground">No upcoming workshops scheduled at the moment.</p>
                        <p className="mt-2">Check back soon for new workshops!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recorded Workshops */}
                {recordedWorkshops.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-8">Past Recordings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                  <p className="text-muted-foreground mb-4">{workshop.description}</p>
                                )}
                                
                                <div className="flex items-center text-sm text-muted-foreground mb-4">
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
      </main>
      <Footer />
    </div>
  );
};

export default Workshops;
