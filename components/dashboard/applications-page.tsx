'use client';

import { ApplicationsList } from '../applications/applications-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Application {
  id: string;
  jobId: string;
  applicantName: string;
  email: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  resume: string;
  coverLetter?: string;
  experience: string;
  skills: string[];
}

// This would typically come from your API/database
const mockApplications: Application[] = [
  {
    id: '1',
    jobId: 'job1',
    applicantName: 'John Doe',
    email: 'john@example.com',
    appliedAt: '2024-03-20T10:00:00Z',
    status: 'pending',
    resume: '/resumes/john-doe.pdf',
    coverLetter: 'I am excited to apply for this position...',
    experience: '5 years of experience in web development',
    skills: ['React', 'TypeScript', 'Node.js'],
  },
  // Add more mock applications as needed
];

export function ApplicationsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Job Applications</h1>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <ApplicationsList applications={mockApplications} />
        </TabsContent>
        
        <TabsContent value="pending">
          <ApplicationsList 
            applications={mockApplications.filter(app => app.status === 'pending')} 
          />
        </TabsContent>
        
        <TabsContent value="reviewed">
          <ApplicationsList 
            applications={mockApplications.filter(app => app.status === 'reviewed')} 
          />
        </TabsContent>
        
        <TabsContent value="accepted">
          <ApplicationsList 
            applications={mockApplications.filter(app => app.status === 'accepted')} 
          />
        </TabsContent>
        
        <TabsContent value="rejected">
          <ApplicationsList 
            applications={mockApplications.filter(app => app.status === 'rejected')} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 