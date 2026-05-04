import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <div className="h-24 w-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8">
        <AlertCircle size={48} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-slate-600 max-w-md mb-10">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button size="lg">Back to Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
