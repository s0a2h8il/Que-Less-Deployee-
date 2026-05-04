import React from "react";
import { SearchX, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "..";

const EmptyBusinessState = ({ onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="h-24 w-24 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-8">
        <SearchX size={48} />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 mb-3">No businesses found</h2>
      <p className="text-slate-500 max-w-md mb-10 leading-relaxed">
        We couldn't find any businesses matching your search or filters. 
        Try adjusting your filters or searching for something else.
      </p>
      <Button 
        variant="outline" 
        onClick={onReset}
        className="gap-2 border-slate-200"
      >
        <RotateCcw size={18} />
        Clear all filters
      </Button>
    </motion.div>
  );
};

export default EmptyBusinessState;
