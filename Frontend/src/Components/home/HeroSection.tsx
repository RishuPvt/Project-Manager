import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 animate-gradient-slow" />
      <div className="absolute inset-0">
        <div className="h-full w-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>
      
      <div className="relative container mx-auto px-4 py-24 md:py-32 flex flex-col items-center">
        <h1 className="animate-fade-in text-4xl md:text-6xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Organize Your Projects with KanbanFlow
        </h1>
        
        <p className="animate-fade-in delay-100 text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-center">
          A powerful Kanban-style project management tool that helps teams collaborate and track progress effectively.
        </p>
        
        <div className="animate-fade-in delay-200 flex flex-wrap justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="text-lg group">
              Get Started Free 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="text-lg">
              Log In
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 md:mt-16 w-full max-w-5xl animate-fade-in delay-300">
          <div className="relative rounded-xl overflow-hidden border shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80" 
              alt="KanbanFlow Dashboard Preview" 
              className="w-full hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
