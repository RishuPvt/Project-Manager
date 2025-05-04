import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

// Define types for our context
type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: { name: string; email: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Sample user data (in a real app this would come from a backend)
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password456',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=8b5cf6&color=fff'
  }
];

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${foundUser.name}!`,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };
  
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      toast({
        title: "Signup failed",
        description: "Email already in use",
        variant: "destructive",
      });
    } else {
      // In a real app, you'd save this to a database
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
      };
      
      // Add user to mock database
      MOCK_USERS.push({ ...newUser, password });
      
      // Log in the user
      setUser(newUser);
      toast({
        title: "Signup successful",
        description: `Welcome to Kanban, ${name}!`,
      });
    }
    
    setLoading(false);
  };
  
  const updateUserProfile = async (data: { name: string; email: string }) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      // Find the user in our mock database
      const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        // Update user data in mock DB
        MOCK_USERS[userIndex] = {
          ...MOCK_USERS[userIndex],
          name: data.name,
          email: data.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6366f1&color=fff`
        };
        
        // Update local state
        setUser({
          ...user,
          name: data.name,
          email: data.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6366f1&color=fff`
        });
      }
    }
    
    setLoading(false);
  };
  
  const changePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      // Find the user in our mock database
      const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        // Check if current password is correct
        if (MOCK_USERS[userIndex].password === currentPassword) {
          // Update password
          MOCK_USERS[userIndex].password = newPassword;
          
          toast({
            title: "Password updated",
            description: "Your password has been changed successfully",
          });
        } else {
          toast({
            title: "Password change failed",
            description: "Current password is incorrect",
            variant: "destructive",
          });
          throw new Error("Current password is incorrect");
        }
      }
    }
    
    setLoading(false);
  };
  
  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout,
      updateUserProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
