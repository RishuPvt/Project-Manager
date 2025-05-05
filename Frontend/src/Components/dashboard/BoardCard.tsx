import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Board } from '@/contexts/BoardContext';

interface BoardCardProps {
  board: Board;
}

export const BoardCard: React.FC<BoardCardProps> = ({ board }) => {
  const navigate = useNavigate();
  
  const todoCount = board.tasks.filter(task => task.status === 'todo').length;
  const inProgressCount = board.tasks.filter(task => task.status === 'in-progress').length;
  const doneCount = board.tasks.filter(task => task.status === 'done').length;
  const totalCount = board.tasks.length;
  
  const handleClick = () => {
    navigate(`/board/${board.id}`);
  };
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full flex flex-col"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{board.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {board.description || 'No description provided'}
        </p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? 'task' : 'tasks'}
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            {todoCount}
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            {inProgressCount}
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            {doneCount}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};
