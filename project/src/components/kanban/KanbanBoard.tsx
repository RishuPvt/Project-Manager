import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useApp } from '../../contexts/AppContext';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import TaskModal from './TaskModal';
import { Task } from '../../contexts/AppContext';
import { Plus, Filter, Users, Calendar } from 'lucide-react';

const KanbanBoard: React.FC = () => {
  const { state, dispatch } = useApp();
  const { tasks, projects, user, users } = state;
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');

  // Filter tasks based on user's projects
  const userProjects = projects.filter(p => 
    p.members.includes(user?.id || '') || p.organizationId === user?.organizationId
  );
  
  // Filter tasks based on selected filters
  let filteredTasks = tasks.filter(t => 
    userProjects.some(p => p.id === t.projectId)
  );

  if (selectedProject !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.projectId === selectedProject);
  }

  if (selectedAssignee !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.assignedTo === selectedAssignee);
  }

  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'inprogress');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = filteredTasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as 'todo' | 'inprogress' | 'done';

    const task = filteredTasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...task, status: newStatus }
      });
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    }
  };

  const handleTaskSave = (taskData: Partial<Task>) => {
    if (editingTask) {
      // Update existing task
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...editingTask, ...taskData }
      });
    } else {
      // Create new task
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskData.title || '',
        description: taskData.description || '',
        status: 'todo',
        projectId: taskData.projectId || userProjects[0]?.id || '',
        assignedTo: taskData.assignedTo || user?.id || '',
        createdBy: user?.id || '',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: todoTasks,
      color: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
      count: todoTasks.length
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      tasks: inProgressTasks,
      color: 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20',
      count: inProgressTasks.length
    },
    {
      id: 'done',
      title: 'Done',
      tasks: doneTasks,
      color: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20',
      count: doneTasks.length
    }
  ];

  // Get team members for the filter
  const teamMembers = users.filter(u => u.organizationId === user?.organizationId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Kanban Board
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Drag and drop tasks to update their status
              </p>
            </div>
            <button
              onClick={handleCreateTask}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Projects</option>
                {userProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Assignees</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {todoTasks.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">To Do</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {inProgressTasks.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {doneTasks.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Done</div>
            </div>
          </div>
        </div>

        {/* Board */}
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={column.tasks}
                color={column.color}
                count={column.count}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="transform rotate-3">
                <KanbanCard 
                  task={activeTask} 
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Task Modal */}
        {showTaskModal && (
          <TaskModal
            task={editingTask}
            projects={userProjects}
            users={teamMembers}
            onSave={handleTaskSave}
            onClose={() => {
              setShowTaskModal(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;