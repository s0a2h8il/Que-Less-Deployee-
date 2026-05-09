import React, { useState } from "react";
import { User, Mail, Shield, Calendar, Phone } from "lucide-react";
import { Card, Button } from "../..";
import EditProfileModal from "./EditProfileModal";
import { CONFIG } from "../../../constants/config";

const ProfileCard = ({ user }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!user) return null;

  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    // Handle both cases: path starting with / or not
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${CONFIG.BASE_URL}${cleanPath}`;
  };

  const [imgError, setImgError] = useState(false);

  return (
    <>
      <Card className="p-8 border-slate-100 shadow-soft overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500 to-blue-600 opacity-10" />
        <div className="flex flex-col items-center text-center relative pt-4">
          <div className="h-24 w-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-xl shadow-indigo-100 mb-6 overflow-hidden border-4 border-white">
            {user.avatar && !imgError ? (
              <img 
                src={getAvatarUrl(user.avatar)} 
                alt={user.name} 
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              initials
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">{user.name}</h2>
          <p className="text-slate-500 font-medium mb-2">{user.email}</p>
          
          {user.bio && (
            <p className="text-sm text-slate-400 italic mb-6 max-w-xs leading-relaxed">
              "{user.bio}"
            </p>
          )}
          
          <div className="w-full space-y-4 border-t border-slate-50 pt-6">
            {user.phone && (
              <div className="flex items-center gap-3 text-slate-600">
                 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-500">
                    <Phone size={16} />
                 </div>
                 <span className="text-sm font-semibold">{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-slate-600">
               <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-500">
                  <Shield size={16} />
               </div>
               <span className="text-sm font-bold uppercase tracking-wider">Role: {user.role}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
               <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-500">
                  <Calendar size={16} />
               </div>
               <span className="text-sm font-bold uppercase tracking-wider">Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            fullWidth 
            className="mt-8 rounded-2xl h-12 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
            onClick={() => setIsEditModalOpen(true)}
          >
             Edit Profile
          </Button>
        </div>
      </Card>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        user={user} 
      />
    </>
  );
};

export default ProfileCard;
