import React from "react";
import { LogIn, LogOut, PauseCircle, Ban, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const QueueActionPanel = ({ queue, userMember, onJoin, onLeave, joining, leaving }) => {
  const { isAuthenticated } = useAuth();
  const { status } = queue;

  if (!isAuthenticated) {
    return (
      <Card className="p-6 border-blue-100 bg-blue-50/50">
        <div className="flex items-center gap-4">
           <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
              <LogIn size={24} />
           </div>
           <div className="flex-1">
              <h4 className="font-bold text-slate-900">Login Required</h4>
              <p className="text-sm text-slate-500">Sign in to join this queue and get your token.</p>
           </div>
           <Link to="/login">
             <Button size="sm">Login</Button>
           </Link>
        </div>
      </Card>
    );
  }

  // Handle various queue statuses
  if (status === 'paused') {
    return (
      <div className="flex items-center gap-4 p-6 bg-amber-50 border border-amber-100 rounded-[2rem] text-amber-700">
         <PauseCircle size={24} className="shrink-0" />
         <p className="text-sm font-bold">This queue is currently paused. Please check back later.</p>
      </div>
    );
  }

  if (status === 'closed') {
    return (
      <div className="flex items-center gap-4 p-6 bg-slate-100 border border-slate-200 rounded-[2rem] text-slate-500">
         <Ban size={24} className="shrink-0" />
         <p className="text-sm font-bold">This queue is now closed. No new members are being accepted.</p>
      </div>
    );
  }

  // If user is already in queue
  if (userMember) {
    if (userMember.status === 'waiting') {
      return (
        <Button 
          fullWidth 
          variant="outline" 
          size="lg" 
          className="h-16 rounded-[2rem] border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200"
          onClick={onLeave}
          isLoading={leaving}
        >
          <LogOut size={20} className="mr-2" />
          Leave Queue
        </Button>
      );
    }
    
    if (userMember.status === 'called') {
      return (
        <div className="flex items-center gap-4 p-6 bg-emerald-500 text-white rounded-[2rem] shadow-xl shadow-emerald-200">
           <AlertCircle size={24} className="shrink-0" />
           <div className="flex-1">
             <p className="font-black">It's Your Turn!</p>
             <p className="text-xs opacity-90">Please proceed to the counter immediately.</p>
           </div>
        </div>
      );
    }

    return (
      <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-center text-slate-400 font-bold text-sm">
        Your status: {userMember.status}
      </div>
    );
  }

  // Default: Join Queue
  return (
    <Button 
      fullWidth 
      size="lg" 
      className="h-16 rounded-[2rem] shadow-xl shadow-blue-200"
      onClick={onJoin}
      isLoading={joining}
    >
      <LogIn size={20} className="mr-2" />
      Join Queue
    </Button>
  );
};

export default QueueActionPanel;
