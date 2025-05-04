import React from 'react';
import { Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { BoardCard } from '@/components/dashboard/BoardCard';
import { CreateBoardDialog } from '@/components/dashboard/CreateBoardDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useBoard } from '@/contexts/BoardContext';
import { Input } from '@/components/ui/input';

const Dashboard = () => {
  const { user } = useAuth();
  const { boards } = useBoard();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const filteredBoards = boards.filter(board => 
    board.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Boards</h1>
            <p className="text-muted-foreground">
              Organize and manage your projects with Kanban boards
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Input
              placeholder="Search boards..."
              className="max-w-[300px]"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <CreateBoardDialog />
          </div>
        </div>
        
        {filteredBoards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBoards.map(board => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">No boards match your search</p>
            <p className="text-muted-foreground">Try a different search term or create a new board</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">You don't have any boards yet</p>
            <p className="text-muted-foreground mb-6">Create your first board to get started</p>
            <CreateBoardDialog />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
