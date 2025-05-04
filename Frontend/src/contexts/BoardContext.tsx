import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

// Define types
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: TaskPriority;
  dueDate?: string;
  assignee?: {
    id: string;
    name: string;
    avatar: string;
  };
  comments?: {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    timestamp: string;
  }[];
};

export type Board = {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
};

interface BoardContextType {
  boards: Board[];
  currentBoard: Board | null;
  setCurrentBoard: (board: Board | null) => void;
  addBoard: (title: string, description?: string) => void;
  addTask: (boardId: string, task: Omit<Task, 'id'>) => void;
  updateTask: (boardId: string, taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (boardId: string, taskId: string) => void;
  moveTask: (boardId: string, taskId: string, newStatus: Task['status']) => void;
}

// Create context
const BoardContext = createContext<BoardContextType | null>(null);

// Sample data
const INITIAL_BOARDS: Board[] = [
  {
    id: '1',
    title: 'Marketing Campaign',
    description: 'Q2 Marketing Campaign Planning',
    tasks: [
      {
        id: '101',
        title: 'Create social media assets',
        description: 'Design graphics for Instagram and Twitter',
        status: 'todo',
        priority: 'medium',
        dueDate: '2025-05-20',
        assignee: {
          id: '2',
          name: 'Jane Smith',
          avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=8b5cf6&color=fff'
        },
        comments: []
      },
      {
        id: '102',
        title: 'Draft email templates',
        description: 'Create email sequences for the campaign',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2025-05-15',
        assignee: {
          id: '1',
          name: 'John Doe',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff'
        },
        comments: [
          {
            id: 'c1',
            userId: '2',
            userName: 'Jane Smith',
            userAvatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=8b5cf6&color=fff',
            text: 'Let me know if you need help with this.',
            timestamp: '2025-05-05T14:48:00.000Z'
          }
        ]
      },
      {
        id: '103',
        title: 'Finalize budget',
        description: 'Get approval for Q2 campaign budget',
        status: 'done',
        priority: 'high',
        dueDate: '2025-05-01',
        assignee: {
          id: '1',
          name: 'John Doe',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff'
        },
        comments: []
      }
    ]
  },
  {
    id: '2',
    title: 'Website Redesign',
    description: 'Refresh our company website',
    tasks: [
      {
        id: '201',
        title: 'Create wireframes',
        description: 'Design wireframes for homepage and product pages',
        status: 'done',
        priority: 'high',
        dueDate: '2025-04-15',
        assignee: {
          id: '2',
          name: 'Jane Smith',
          avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=8b5cf6&color=fff'
        },
        comments: []
      },
      {
        id: '202',
        title: 'Implement new design',
        description: 'Convert designs to responsive code',
        status: 'in-progress',
        priority: 'medium',
        dueDate: '2025-05-20',
        assignee: {
          id: '1',
          name: 'John Doe',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff'
        },
        comments: []
      },
      {
        id: '203',
        title: 'SEO optimization',
        description: 'Optimize content for search engines',
        status: 'todo',
        priority: 'low',
        dueDate: '2025-05-30',
        assignee: {
          id: '2',
          name: 'Jane Smith',
          avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=8b5cf6&color=fff'
        },
        comments: []
      }
    ]
  }
];

// Provider component
export const BoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [boards, setBoards] = useState<Board[]>(INITIAL_BOARDS);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const { toast } = useToast();

  const addBoard = (title: string, description?: string) => {
    const newBoard: Board = {
      id: String(Date.now()),
      title,
      description,
      tasks: []
    };
    
    setBoards([...boards, newBoard]);
    toast({
      title: "Board created",
      description: `'${title}' board has been created`,
    });
  };

  const addTask = (boardId: string, task: Omit<Task, 'id'>) => {
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            tasks: [...board.tasks, { ...task, id: String(Date.now()) }]
          };
        }
        return board;
      });
    });
    
    toast({
      title: "Task added",
      description: `'${task.title}' has been added to the board`
    });
  };

  const updateTask = (boardId: string, taskId: string, updatedTask: Partial<Task>) => {
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            tasks: board.tasks.map(task => {
              if (task.id === taskId) {
                return { ...task, ...updatedTask };
              }
              return task;
            })
          };
        }
        return board;
      });
    });
    
    toast({
      title: "Task updated",
      description: "Task details have been updated"
    });
  };

  const deleteTask = (boardId: string, taskId: string) => {
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            tasks: board.tasks.filter(task => task.id !== taskId)
          };
        }
        return board;
      });
    });
    
    toast({
      title: "Task deleted",
      description: "Task has been removed from the board"
    });
  };

  const moveTask = (boardId: string, taskId: string, newStatus: Task['status']) => {
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            tasks: board.tasks.map(task => {
              if (task.id === taskId) {
                return { ...task, status: newStatus };
              }
              return task;
            })
          };
        }
        return board;
      });
    });
    
    toast({
      title: "Task moved",
      description: `Task moved to ${newStatus.replace('-', ' ')}`
    });
  };

  return (
    <BoardContext.Provider 
      value={{ 
        boards, 
        currentBoard,
        setCurrentBoard,
        addBoard, 
        addTask, 
        updateTask, 
        deleteTask, 
        moveTask 
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

// Custom hook
export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};
