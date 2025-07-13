import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  organizationId?: string;
  avatar?: string;
}

interface Organization {
  id: string;
  name: string;
  description: string;
  adminId: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  createdBy: string;
  members: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  projectId: string;
  assignedTo: string;
  createdBy: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  organizationId: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ChatMessage {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  organizations: Organization[];
  projects: Project[];
  tasks: Task[];
  joinRequests: JoinRequest[];
  chatMessages: ChatMessage[];
  users: User[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'ADD_ORGANIZATION'; payload: Organization }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_JOIN_REQUEST'; payload: JoinRequest }
  | { type: 'UPDATE_JOIN_REQUEST'; payload: JoinRequest }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AppState = {
  user: null,
  theme: 'light',
  organizations: [],
  projects: [],
  tasks: [],
  joinRequests: [],
  chatMessages: [],
  users: []
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_ORGANIZATION':
      return { ...state, organizations: [...state.organizations, action.payload] };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t)
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload)
      };
    case 'ADD_JOIN_REQUEST':
      return { ...state, joinRequests: [...state.joinRequests, action.payload] };
    case 'UPDATE_JOIN_REQUEST':
      return {
        ...state,
        joinRequests: state.joinRequests.map(jr => jr.id === action.payload.id ? action.payload : jr)
      };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(u => u.id === action.payload.id ? action.payload : u),
        user: state.user?.id === action.payload.id ? action.payload : state.user
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export type { User, Organization, Project, Task, JoinRequest, ChatMessage };