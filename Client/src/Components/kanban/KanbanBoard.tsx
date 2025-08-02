import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import { useUserStore } from "../../contexts/User.store";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import TaskModal from "./TaskModel";
import { Plus, Filter, Users } from "lucide-react";

// ----- DEMO DATA -----
interface Project {
  id: string;
  name: string;
  members: string[];
  organizationId: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "done";
  projectId: string;
  assignedTo: string;
  createdBy: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

const demoProjects: Project[] = [
  { id: "p1", name: "Project A", members: ["1", "2"], organizationId: "org1" },
  { id: "p2", name: "Project B", members: ["1"], organizationId: "org1" },
];

const demoTasks: Task[] = [
  {
    id: "t1",
    title: "Design UI",
    description: "Create home page UI",
    status: "todo",
    projectId: "p1",
    assignedTo: "1",
    createdBy: "1",
    priority: "high",
  },
  {
    id: "t2",
    title: "Setup backend",
    description: "Initialize Express server",
    status: "inprogress",
    projectId: "p1",
    assignedTo: "2",
    createdBy: "1",
    priority: "medium",
  },
  {
    id: "t3",
    title: "Deploy app",
    description: "Deploy on Vercel",
    status: "done",
    projectId: "p2",
    assignedTo: "1",
    createdBy: "2",
    priority: "low",
  },
];

const demoUsers = [
  { id: "1", name: "Rishu", organizationId: "org1" },
  { id: "2", name: "Amit", organizationId: "org1" },
];

// ----- COMPONENT -----
const KanbanBoard: React.FC = () => {
  const { user } = useUserStore();
  const [tasks, setTasks] = useState<Task[]>(demoTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");

  // filter projects based on user
  const userProjects = demoProjects.filter(
    (p) =>
      p.members.includes(user?.id.toString() || "") ||
      p.organizationId === user?.orgId
  );

  // filter tasks
  let filteredTasks = tasks.filter((t) =>
    userProjects.some((p) => p.id === t.projectId)
  );

  if (selectedProject !== "all") {
    filteredTasks = filteredTasks.filter((t) => t.projectId === selectedProject);
  }
  if (selectedAssignee !== "all") {
    filteredTasks = filteredTasks.filter(
      (t) => t.assignedTo === selectedAssignee
    );
  }

  const todoTasks = filteredTasks.filter((task) => task.status === "todo");
  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "inprogress"
  );
  const doneTasks = filteredTasks.filter((task) => task.status === "done");

  // ----- Handlers -----
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = filteredTasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as "todo" | "inprogress" | "done";

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
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
    if (window.confirm("Delete this task?")) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const handleTaskSave = (taskData: Partial<Task>) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id ? { ...t, ...taskData } : t
        )
      );
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskData.title || "New Task",
        description: taskData.description || "",
        status: "todo",
        projectId: taskData.projectId || userProjects[0]?.id || "p1",
        assignedTo: taskData.assignedTo || user?.id.toString() || "1",
        createdBy: user?.id.toString() || "1",
        priority: taskData.priority || "medium",
      };
      setTasks((prev) => [...prev, newTask]);
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const columns = [
    {
      id: "todo",
      title: "To Do",
      tasks: todoTasks,
      color:
        "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
      count: todoTasks.length,
    },
    {
      id: "inprogress",
      title: "In Progress",
      tasks: inProgressTasks,
      color:
        "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20",
      count: inProgressTasks.length,
    },
    {
      id: "done",
      title: "Done",
      tasks: doneTasks,
      color:
        "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20",
      count: doneTasks.length,
    },
  ];

  const teamMembers = demoUsers.filter(
    (u) => u.organizationId === user?.orgId
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Kanban Board
          </h1>
          <button
            onClick={handleCreateTask}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="inline w-5 h-5 mr-1" /> Add Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="all">All Projects</option>
              {userProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="all">All Assignees</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Board */}
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={col.tasks}
                color={col.color}
                count={col.count}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask && (
              <KanbanCard
                task={activeTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            )}
          </DragOverlay>
        </DndContext>

        {showTaskModal && (
          <TaskModal
            task={editingTask}
            projects={userProjects}
            users={teamMembers}
            onSave={handleTaskSave}
            onClose={() => setShowTaskModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
