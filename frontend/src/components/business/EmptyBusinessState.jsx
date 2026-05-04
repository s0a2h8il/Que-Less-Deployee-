import React from "react";
import { SearchX, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "..";

const EmptyBusinessState = ({ onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="h-24 w-24 rounded-full flex items-center justify-center mb-8"
        style={{
          background: "rgba(129, 178, 154, 0.08)",
          color: "#81B29A",
        }}
      >
        <SearchX size={48} />
      </div>
      <h2
        className="text-2xl font-extrabold mb-3"
        style={{
          color: "var(--text-primary)",
          fontFamily: "var(--font-heading)",
        }}
      >
        No queues found
      </h2>
      <p
        className="max-w-md mb-10 leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        We couldn't find any businesses matching your search or filters. Try
        adjusting your filters or searching for something else.
      </p>
      <Button
        onClick={onReset}
        style={{
          background: "#81B29A",
          color: "white",
          border: "none",
        }}
        className="gap-2 hover:shadow-md transition-all duration-200"
      >
        <RotateCcw size={18} />
        Clear all filters
      </Button>
    </motion.div>
  );
};

export default EmptyBusinessState;
