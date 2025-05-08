import React from 'react';
import { Task } from '@/contexts/BoardContext';
import { Badge } from '@/components/ui/badge';

import { Avatar } from '../ui/avatar';

import { cn } from "../../lib/utilis"

interface KanbanTaskProps {
  task: Task;
  onDragStart: (e: React.DragEvent) => void;
}

export const KanbanTask: React.FC<KanbanTaskProps> = ({ task, onDragStart }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200'
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={onDragStart}
    >
      <h3 className="font-medium text-sm mb-2">{task.title}</h3>
      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between">
        <Badge 
          variant="outline" 
          className={cn("text-xs", priorityColors[task.priority])}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
        
        <div className="flex items-center space-x-2">
          {task.dueDate && (
            <span className="text-xs text-muted-foreground">
              {formatDate(task.dueDate)}
            </span>
          )}
          {task.assignee && (
            <Avatar className="h-6 w-6">
              <img src={task.assignee.avatar} alt={task.assignee.name} />
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
};
