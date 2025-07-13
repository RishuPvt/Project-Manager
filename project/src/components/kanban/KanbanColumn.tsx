import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import { Task } from '../../contexts/AppContext';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
  count: number;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  id, 
  title, 
  tasks, 
  color, 
  count,
  onEditTask,
  onDeleteTask 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const getColumnIcon = (status: string) => {
    switch (status) {
      case 'todo': return '📋';
      case 'inprogress': return '⚡';
      case 'done': return '✅';
      default: return '📋';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-2 border-dashed transition-all duration-200 ${
        isOver 
          ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/30 scale-105' 
          : color
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getColumnIcon(id)}</span>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
              {count}
            </span>
          </div>
        </div>

        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 min-h-[300px]">
            {tasks.map((task) => (
              <KanbanCard 
                key={task.id} 
                task={task} 
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {tasks.length === 0 && (
              <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl mb-2">{getColumnIcon(id)}</div>
                  <div className="text-sm">Drop tasks here</div>
                  <div className="text-xs mt-1">or drag from other columns</div>
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;