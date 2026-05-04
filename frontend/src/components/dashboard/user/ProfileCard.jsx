import React from "react";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { Card, Button } from "../..";

const ProfileCard = ({ user }) => {
  if (!user) return null;

  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  return (
    <Card className="p-8 border-slate-100 shadow-soft">
      <div className="flex flex-col items-center text-center">
        <div className="h-24 w-24 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-xl shadow-blue-200 mb-6">
          {initials}
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">{user.name}</h2>
        <p className="text-slate-500 font-medium mb-6">{user.email}</p>
        
        <div className="w-full space-y-4 border-t border-slate-50 pt-6">
          <div className="flex items-center gap-3 text-slate-600">
             <Shield size={18} className="text-blue-500" />
             <span className="text-sm font-bold uppercase tracking-wider">Role: {user.role}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
             <Calendar size={18} className="text-blue-500" />
             <span className="text-sm font-bold uppercase tracking-wider">Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <Button variant="outline" fullWidth className="mt-8 rounded-xl">
           Edit Profile
        </Button>
      </div>
    </Card>
  );
};

export default ProfileCard;
