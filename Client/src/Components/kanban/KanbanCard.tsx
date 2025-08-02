import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  AlertCircle,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";

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

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

// ----- DEMO DATA (replace with global state or API later) -----
const demoProjects = [
  { id: "p1", name: "Project A" },
  { id: "p2", name: "Project B" },
];

const demoUsers = [
  { id: "1", name: "Rishu Raj" },
  { id: "2", name: "Amit Kumar" },
];

const KanbanCard: React.FC<KanbanCardProps> = ({ task, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Find project and assigned user from demo data
  const project = demoProjects.find((p) => p.id === task.projectId);
  const assignedUser = demoUsers.find((u) => u.id === task.assignedTo);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟠";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group ${
        isDragging ? "opacity-50 scale-105 rotate-3 shadow-xl" : ""
      } ${isOverdue ? "ring-2 ring-red-300 dark:ring-red-700" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm flex-1">
              {task.title}
            </h4>
            <span className="text-lg flex-shrink-0">
              {getPriorityIcon(task.priority)}
            </span>
          </div>
          {isOverdue && (
            <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-xs mb-2">
              <AlertCircle className="w-3 h-3" />
              <span>Overdue</span>
            </div>
          )}
        </div>

        {/* Action menu */}
        <div className="relative ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 min-w-[120px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                  setShowMenu(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                  setShowMenu(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {task.description}
      </p>

      {/* Project & priority */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span className="font-medium truncate">{project?.name || "No Project"}</span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Assigned user & due date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {assignedUser && (
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {assignedUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[80px]">
                {assignedUser.name.split(" ")[0]}
              </span>
            </div>
          )}
        </div>

        {task.dueDate && (
          <div
            className={`flex items-center space-x-1 text-xs ${
              isOverdue
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;
