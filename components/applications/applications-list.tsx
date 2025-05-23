'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Mail } from "lucide-react";

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

interface ApplicationsListProps {
  applications: Application[];
}

export function ApplicationsList({ applications }: ApplicationsListProps) {
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);

  const toggleApplication = (applicationId: string) => {
    setExpandedApplication(expandedApplication === applicationId ? null : applicationId);
  };

  const getStatusColor = (status: Application['status']) => {
    const colors = {
      pending: 'bg-yellow-500',
      reviewed: 'bg-blue-500',
      accepted: 'bg-green-500',
      rejected: 'bg-red-500',
    };
    return colors[status];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Job Applications</CardTitle>
        <CardDescription>View and manage applications for your job postings</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <>
                <TableRow key={application.id}>
                  <TableCell>{application.applicantName}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => toggleApplication(application.id)}
                    >
                      <Mail className="h-4 w-4" />
                      {application.email}
                    </Button>
                  </TableCell>
                  <TableCell>{new Date(application.appliedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleApplication(application.id)}
                    >
                      {expandedApplication === application.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedApplication === application.id && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="p-4 space-y-4 bg-muted/50 rounded-lg">
                        <div>
                          <h4 className="font-semibold mb-2">Experience</h4>
                          <p className="text-sm">{application.experience}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {application.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {application.coverLetter && (
                          <div>
                            <h4 className="font-semibold mb-2">Cover Letter</h4>
                            <p className="text-sm whitespace-pre-wrap">{application.coverLetter}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={application.resume} target="_blank" rel="noopener noreferrer">
                              View Resume
                            </a>
                          </Button>
                          <Button variant="outline" size="sm">
                            Update Status
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 