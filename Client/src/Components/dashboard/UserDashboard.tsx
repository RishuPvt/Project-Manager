import React, { useEffect, useState } from "react";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Calendar,
  Filter,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendurl } from "../../API/backendUrl";

const UserDashboard: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "todo" | "inprogress" | "done">(
    "all"
  );

  const [isLoading, setIsLoading] = useState(true);
  const [completedTasks, setcompletedTasks] = useState();
  const [inProgressTasks, setinProgressTasks] = useState();
  const [todoTasks, settodoTasks] = useState();
  const [tasks, settasks] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Run both requests in parallel
        const [userRes, taskRes, tasklistres] = await Promise.all([
          axios.get(`${backendurl}/profile/currentUser`, {
            withCredentials: true,
          }),
          axios.get(`${backendurl}/project/task/userTaskstatusCount`, {
            withCredentials: true,
          }),
          axios.get(`${backendurl}/project/task/getmyTask`, {
            withCredentials: true,
          }),
        ]);

        // Handle user response
        if (userRes.data.success) {
          setUser(userRes.data.data);
          toast.success(userRes.data.message);
        }

        // Handle task Status  response
        if (taskRes.data.success) {
          setcompletedTasks(taskRes.data.data.done);
          setinProgressTasks(taskRes.data.data.inProgress);
          settodoTasks(taskRes.data.data.todo);
        }

        // Handle Mytask  response
        if (tasklistres.data.success) {
          settasks(tasklistres.data.data);
      
          
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Please log in.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Task status change (mock function)
  const handleStatusChange = (taskId: number, newStatus: string) => {
    console.log(`Task ${taskId} moved to ${newStatus}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300";
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300";
      case "inprogress":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300";
      case "done":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return <p>Loading pending requests...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's what's on your plate today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  To Do
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {todoTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {inProgressTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <CheckSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedTasks}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-emerald-500" />
              My Tasks
            </h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Tasks</option>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>
          </div>

          <div className="p-6">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                  {filter === "all"
                    ? "No tasks assigned yet"
                    : `No ${filter.replace("inprogress", "in progress")} tasks`}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  Tasks assigned to you will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            Project: {task.project?.title || "Unknown Project"}
                          </span>
                          {task.deadline && (
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status === "inprogress"
                            ? "In Progress"
                            : task.status}
                        </span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {task.status !== "todo" && (
                          <button
                            onClick={() => handleStatusChange(task.id, "todo")}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md"
                          >
                            Move to To Do
                          </button>
                        )}
                        {task.status !== "inprogress" && (
                          <button
                            onClick={() =>
                              handleStatusChange(task.id, "inprogress")
                            }
                            className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-md"
                          >
                            Start Progress
                          </button>
                        )}
                        {task.status !== "done" && (
                          <button
                            onClick={() => handleStatusChange(task.id, "done")}
                            className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-md"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                      {/* <ArrowRight className="w-4 h-4 text-gray-400" /> */}
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <i className="ri-time-line"></i>
                        {new Date(task.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
