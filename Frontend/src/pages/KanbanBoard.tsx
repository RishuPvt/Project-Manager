import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { KanbanColumn } from '@/components/kanban/KanbanColumn';
import { TaskDetailDialog } from '@/components/kanban/TaskDetailDialog';
import { CreateTaskDialog } from '@/components/kanban/CreateTaskDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useBoard, Task } from '@/contexts/BoardContext';
import { Button } from '@/components/ui/button';

const KanbanBoard = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { user } = useAuth();
  const { boards, setCurrentBoard, currentBoard, moveTask, updateTask, deleteTask, addTask } = useBoard();
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<{ id: string; status: Task['status'] } | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo');
  
  // Find the current board based on URL param
  useEffect(() => {
    const board = boards.find(b => b.id === boardId);
    setCurrentBoard(board || null);
  }, [boardId, boards, setCurrentBoard]);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!currentBoard) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const todoTasks = currentBoard.tasks.filter(task => task.status === 'todo');
  const inProgressTasks = currentBoard.tasks.filter(task => task.status === 'in-progress');
  const doneTasks = currentBoard.tasks.filter(task => task.status === 'done');
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDetailDialogOpen(true);
  };
  
  const handleSaveTask = (updatedTask: Partial<Task>) => {
    if (!selectedTask) return;
    updateTask(currentBoard.id, selectedTask.id, updatedTask);
    setDetailDialogOpen(false);
    setSelectedTask(null);
  };
  
  const handleDeleteTask = () => {
    if (!selectedTask) return;
    deleteTask(currentBoard.id, selectedTask.id);
    setDetailDialogOpen(false);
    setSelectedTask(null);
  };
  
  const handleDragStart = (e: React.DragEvent, taskId: string, status: Task['status']) => {
    setDraggedTask({ id: taskId, status });
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === newStatus) return;
    
    moveTask(currentBoard.id, draggedTask.id, newStatus);
    setDraggedTask(null);
  };
  
  const openCreateDialog = (status: Task['status']) => {
    setNewTaskStatus(status);
    setCreateDialogOpen(true);
  };
  
  const handleCreateTask = (task: Omit<Task, 'id'>) => {
    addTask(currentBoard.id, task);
    setCreateDialogOpen(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{currentBoard.title}</h1>
            <p className="text-muted-foreground">
              {currentBoard.description || 'No description provided'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => openCreateDialog('todo')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              Add New Task
            </Button>
          </div>
        </div>
        
        {/* Kanban Board */}
        <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-8">
          <KanbanColumn
            title="To Do"
            status="todo"
            tasks={todoTasks}
            onAddTask={openCreateDialog}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="In Progress"
            status="in-progress"
            tasks={inProgressTasks}
            onAddTask={openCreateDialog}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="Done"
            status="done"
            tasks={doneTasks}
            onAddTask={openCreateDialog}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </div>
        
        {/* Task Dialogs */}
        <TaskDetailDialog
          boardId={currentBoard.id}
          task={selectedTask}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
        
        <CreateTaskDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          initialStatus={newTaskStatus}
          onCreateTask={handleCreateTask}
        />
      </div>
    </MainLayout>
  );
};

export default KanbanBoard;
