import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Book, FileText, Kanban, ArrowRight, Users, LayoutDashboard, Image } from "lucide-react";

const About = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              About KanbanFlow
            </h1>
            <p className="text-lg text-muted-foreground">
              A powerful project management tool designed to enhance team collaboration and productivity
            </p>
          </div>

          {/* Project Overview */}
          <section className="mb-16">
            <div className="flex items-center mb-6">
              <Book className="h-6 w-6 mr-2 text-primary" />
              <h2 className="text-2xl font-semibold">Project Overview</h2>
            </div>
            <Separator className="mb-6" />
            <div className="space-y-4">
              <p>
                KanbanFlow is a Kanban-style project management application designed to help teams visualize work, limit work-in-progress, and maximize efficiency. 
                Built with React, TypeScript, and Tailwind CSS, it offers a modern, responsive interface for managing tasks and workflows.
              </p>
              <p>
                Our mission is to provide teams with a flexible, intuitive tool that adapts to their unique processes, rather than forcing teams to adapt to the tool.
              </p>
            </div>
          </section>

          {/* Key Features */}
          <section className="mb-16">
            <div className="flex items-center mb-6">
              <FileText className="h-6 w-6 mr-2 text-primary" />
              <h2 className="text-2xl font-semibold">Key Features</h2>
            </div>
            <Separator className="mb-6" />
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex items-start">
                  <LayoutDashboard className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Flexible Kanban Boards</h3>
                    <p className="text-muted-foreground text-sm">Customize columns and workflows to match your team's process</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex items-start">
                  <Users className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Team Collaboration</h3>
                    <p className="text-muted-foreground text-sm">Real-time updates, comments, and collaborative task management</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex items-start">
                  <Image className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Visual Task Management</h3>
                    <p className="text-muted-foreground text-sm">Color-coded cards, labels, and visual indicators for task status</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex items-start">
                  <Kanban className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Progress Tracking</h3>
                    <p className="text-muted-foreground text-sm">Monitor project progress with analytics and reporting tools</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Flow Diagram */}
          <section className="mb-16">
            <div className="flex items-center mb-6">
              <Kanban className="h-6 w-6 mr-2 text-primary" />
              <h2 className="text-2xl font-semibold">Workflow</h2>
            </div>
            <Separator className="mb-6" />
            <div className="rounded-lg border p-6 bg-card overflow-hidden">
              {/* Kanban Flow Diagram */}
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                {/* Backlog */}
                <div className="w-full md:w-1/4 p-3 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-3 text-center">Backlog</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-card rounded shadow-sm text-sm">Feature request</div>
                    <div className="p-2 bg-card rounded shadow-sm text-sm">Bug report</div>
                    <div className="p-2 bg-card rounded shadow-sm text-sm">UI improvement</div>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                
                {/* In Progress */}
                <div className="w-full md:w-1/4 p-3 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-3 text-center">In Progress</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-primary/10 rounded shadow-sm text-sm">API integration</div>
                    <div className="p-2 bg-destructive/10 rounded shadow-sm text-sm">Critical bug fix</div>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                
                {/* Review */}
                <div className="w-full md:w-1/4 p-3 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-3 text-center">Review</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-secondary/10 rounded shadow-sm text-sm">Code review</div>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                
                {/* Done */}
                <div className="w-full md:w-1/4 p-3 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-3 text-center">Done</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-accent/10 rounded shadow-sm text-sm">New dashboard</div>
                    <div className="p-2 bg-accent/10 rounded shadow-sm text-sm">UI enhancements</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Technical Documentation */}
          <section className="mb-16">
            <div className="flex items-center mb-6">
              <FileText className="h-6 w-6 mr-2 text-primary" />
              <h2 className="text-2xl font-semibold">Technical Documentation</h2>
            </div>
            <Separator className="mb-6" />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Tech Stack</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>React 18 with TypeScript</li>
                    <li>React Router for navigation</li>
                    <li>Tailwind CSS for styling</li>
                    <li>shadcn/ui component library</li>
                    <li>Tanstack React Query for data fetching</li>
                    <li>Lucide React for icons</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Architecture</h3>
                  <p className="text-muted-foreground">
                    KanbanFlow follows a modern React architecture with a component-based structure.
                    Context API is used for state management across the application, with separate contexts
                    for authentication and board management. The app is organized into pages, components, contexts, and utility functions.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Key Components</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li><strong>AuthContext</strong> - Handles user authentication state</li>
                    <li><strong>BoardContext</strong> - Manages kanban boards and tasks</li>
                    <li><strong>KanbanBoard</strong> - Main board interface with columns and cards</li>
                    <li><strong>MainLayout</strong> - Consistent layout wrapper with navigation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
