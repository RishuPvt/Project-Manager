import React from 'react';
import { KanbanTask } from './KanbanTask';
import { Button } from '@/components/ui/button';
import { Task } from '@/contexts/BoardContext';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onAddTask: (status: Task['status']) => void;
  onDragStart: (e: React.DragEvent, taskId: string, status: Task['status']) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: Task['status']) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tasks,
  status,
  onAddTask,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  let headerColor;
  switch (status) {
    case 'todo':
      headerColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      break;
    case 'in-progress':
      headerColor = 'bg-blue-100 text-blue-800 border-blue-200';
      break;
    case 'done':
      headerColor = 'bg-green-100 text-green-800 border-green-200';
      break;
    default:
      headerColor = 'bg-gray-100 text-gray-800 border-gray-200';
  }

  return (
    <div
      className="kanban-column"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className={`px-3 py-2 mb-3 rounded font-medium ${headerColor} flex items-center justify-between`}>
        <span>{title}</span>
        <span className="bg-background text-foreground text-xs font-normal rounded-full w-5 h-5 flex items-center justify-center">
          {tasks.length}
        </span>
      </div>
      
      <div className="space-y-3 flex-1">
        {tasks.map(task => (
          <KanbanTask
            key={task.id}
            task={task}
            onDragStart={(e) => onDragStart(e, task.id, status)}
          />
        ))}
      </div>
      
      <Button
        onClick={() => onAddTask(status)}
        variant="ghost"
        className="w-full mt-3 border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
          <path d="M5 12h14"></path>
          <path d="M12 5v14"></path>
        </svg>
        Add Task
      </Button>
    </div>
  );
};
