
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface TabContentProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const TabContent = ({ title, description, children }: TabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children || <p>{title} content will be implemented here.</p>}
      </CardContent>
    </Card>
  );
};
