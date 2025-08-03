import React, { useEffect, useState } from "react";
import {
  Users,
  FolderPlus,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { backendurl } from "../../API/backendUrl";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard: React.FC = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  // ---------------- teamMembersCount ----------------

  const [teamMembersCount, setteamMembersCount] = useState([]);

  useEffect(() => {
    const organizationMembers = async () => {
      try {
        const response = await axios.get(
          `${backendurl}/profile/totalMemberInOrg`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setteamMembersCount(response.data.data);
          // console.log(
          //   "Total approved members in organization",
          //   response.data.data.totalMembers
          // );
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Please log in.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    organizationMembers();
  }, []);

  // ---------------- organizationProjects ----------------

  const [organizationProject, setorganizationProjects] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  useEffect(() => {
    const organizationProjects = async () => {
      try {
        const response = await axios.get(
          `${backendurl}/organization/project/getAllProjects`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setorganizationProjects(response.data.data.projects);
          setProjectCount(response.data.data.count);
          //console.log(response.data.data);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Please log in.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    organizationProjects();
  }, []);

  // ---------------- organizationTasks ----------------

  const organizationTasks = [
    { id: 1, title: "API Setup", projectId: 1, status: "done" },
    { id: 2, title: "Frontend UI", projectId: 1, status: "inprogress" },
    { id: 3, title: "Socket Integration", projectId: 2, status: "done" },
  ];

  // ---------------- pendingRequests ----------------
  const [pendingReq, setPendingReq] = useState([]);

  useEffect(() => {
    const pendingRequests = async () => {
      try {
        const response = await axios.get(
          `${backendurl}/auth/getPendingRequests`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setPendingReq(response.data.data);
          //console.log(pendingReq);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Please log in.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    pendingRequests();
  }, [backendurl]);

  // ---------------- Stats ----------------

  const [completedTasks, setcompletedTasks] = useState();
  const [inProgressTasks, setinProgressTasks] = useState();
  useEffect(() => {
    const getTaskStatusCount = async () => {
      try {
        const response = await axios.get(
          `${backendurl}/project/task/gettotalTaskStatusCount`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setcompletedTasks(response.data.data.done);
         // console.log(setcompletedTasks);
          setinProgressTasks(response.data.data.inProgress);
         // console.log(setinProgressTasks);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Please log in.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    getTaskStatusCount();
  }, []);

  // ---------------- Handlers ----------------

  const handleApproveRequest = async (pendingReq: string) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${backendurl}/auth/approveJoinRequest/${pendingReq}`,
        { status: "approved" },
        { withCredentials: true }
      );

      if (response.data.success) {
        //console.log(`Approved request ${pendingReq}`);
        toast.success(response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Please log in.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    console.log(`Rejected request ${requestId}`);
  };

  // ---------------- handleCreateProject ----------------

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${backendurl}/organization/project/createProject`, // your backend route
        {
          title: newProject.name,
          description: newProject.description,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Project created successfully");

        // Close modal and reset form
        setShowCreateProject(false);
        setNewProject({ name: "", description: "" });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create project";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading pending requests...</p>;
  }
  // ---------------- JSX ----------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your organization, projects, and team
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Projects
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {projectCount}
                </p>
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed Tasks
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedTasks}
                </p>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
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

          {/* Team Members */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Team Members
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {teamMembersCount.totalMembers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Join Requests & Projects */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Join Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                Pending Join Requests
                {pendingReq.length > 0 && (
                  <span className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {pendingReq.length}
                  </span>
                )}
              </h2>
            </div>
            <div className="p-6">
              {pendingReq.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No pending join requests
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingReq.map((request) => (
                    <div
                      key={request.user.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {request.user.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {request.user.email}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900 rounded-lg"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <FolderPlus className="w-5 h-5 mr-2 text-indigo-500" />
                  Projects
                </h2>
                <button
                  onClick={() => setShowCreateProject(true)}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              {organizationProject && organizationProject.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No projects yet. Create your first project!
                </p>
              ) : (
                <div className="space-y-4">
                  {organizationProject.map((project) => {
                    const projectTasks = organizationTasks.filter(
                      (t) => t.projectId === project.id
                    );
                    const completedProjectTasks = projectTasks.filter(
                      (t) => t.status === "done"
                    ).length;

                    return (
                      <div
                        key={project.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {project.title}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {completedProjectTasks}/{projectTasks.length} tasks
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {project.description}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {project.status}
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{
                              width:
                                projectTasks.length > 0
                                  ? `${
                                      (completedProjectTasks /
                                        projectTasks.length) *
                                      100
                                    }%`
                                  : "0%",
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Project Modal */}
        {showCreateProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Project
                </h3>
              </div>
              <form onSubmit={handleCreateProject} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Enter project name"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Project description"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                  >
                    Create Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateProject(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
