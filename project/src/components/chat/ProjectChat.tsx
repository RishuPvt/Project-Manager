import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Send, MessageSquare, Users } from 'lucide-react';

const ProjectChat: React.FC = () => {
  const { state, dispatch } = useApp();
  const { user, projects, chatMessages } = state;
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter projects user has access to
  const userProjects = projects.filter(p => 
    p.members.includes(user?.id || '') || p.organizationId === user?.organizationId
  );

  // Get messages for selected project
  const projectMessages = chatMessages.filter(msg => msg.projectId === selectedProjectId);

  // Set default project if none selected
  useEffect(() => {
    if (!selectedProjectId && userProjects.length > 0) {
      setSelectedProjectId(userProjects[0].id);
    }
  }, [userProjects, selectedProjectId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [projectMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedProjectId && user) {
      const message = {
        id: `msg-${Date.now()}`,
        projectId: selectedProjectId,
        userId: user.id,
        userName: user.name,
        message: newMessage.trim(),
        timestamp: new Date().toISOString()
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message });
      setNewMessage('');
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Project Chat
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Communicate with your team in real-time
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="grid lg:grid-cols-4 h-[calc(100vh-200px)]">
            {/* Sidebar - Project List */}
            <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" />
                  Projects
                </h3>
              </div>
              <div className="overflow-y-auto">
                {userProjects.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No projects available</p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {userProjects.map((project) => {
                      const projectMessageCount = chatMessages.filter(msg => msg.projectId === project.id).length;
                      const isSelected = project.id === selectedProjectId;
                      
                      return (
                        <button
                          key={project.id}
                          onClick={() => setSelectedProjectId(project.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                            isSelected
                              ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-sm">{project.name}</h4>
                              <p className="text-xs opacity-75 truncate">
                                {project.description || 'No description'}
                              </p>
                            </div>
                            {projectMessageCount > 0 && (
                              <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                                {projectMessageCount}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 flex flex-col">
              {selectedProject ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {selectedProject.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedProject.description}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        {selectedProject.members.length} members
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {projectMessages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No messages yet
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm">
                            Start the conversation!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {projectMessages.map((message) => {
                          const isOwnMessage = message.userId === user?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  isOwnMessage
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                }`}
                              >
                                {!isOwnMessage && (
                                  <p className="text-xs font-medium mb-1 opacity-75">
                                    {message.userName}
                                  </p>
                                )}
                                <p className="text-sm">{message.message}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isOwnMessage ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
                                  }`}
                                >
                                  {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-xl">
                      Select a project to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectChat;