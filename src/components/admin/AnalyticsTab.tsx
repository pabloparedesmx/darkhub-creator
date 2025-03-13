
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const AnalyticsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
        <CardDescription>View performance metrics for your platform</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Analytics dashboard will be implemented in the next phase.</p>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;
