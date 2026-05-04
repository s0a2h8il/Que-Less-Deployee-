import React from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import ActiveQueueCard from "./ActiveQueueCard";
import { Button } from "../..";

const MyActiveQueues = ({ queues }) => {
  if (!queues || queues.length === 0) {
    return (
      <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
         <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-300 mx-auto mb-6">
            <Search size={32} />
         </div>
         <h3 className="text-xl font-bold text-slate-900 mb-2">No active queues</h3>
         <p className="text-slate-500 mb-10 max-w-xs mx-auto">You haven't joined any queues yet. Explore businesses to get started.</p>
         <Link to="/explore">
           <Button variant="primary">Explore Now</Button>
         </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {queues.map(queue => (
         <ActiveQueueCard key={queue._id} queue={queue} />
       ))}
    </div>
  );
};

export default MyActiveQueues;
