import React, { useState, useEffect } from "react";
import { User, Mail, Save, X, Phone, AlignLeft, Image as ImageIcon, Camera } from "lucide-react";
import { Modal, Input, Button } from "../..";
import { authApi } from "../../../api/authApi";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "../../../constants/config";

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const { showToast } = useToast();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
      setPreviewUrl(user.avatar || "");
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast({ message: "File size should be less than 2MB", type: "error" });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let currentAvatar = formData.avatar;

      // 1. Upload avatar if selected
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("avatar", selectedFile);
        const uploadRes = await authApi.uploadAvatar(uploadData);
        currentAvatar = uploadRes.data.avatar;
      }

      // 2. Update profile details
      const response = await authApi.updateProfile({
        ...formData,
        avatar: currentAvatar
      });

      if (response.success) {
        setUser(response.data.user);
        showToast({ message: "Profile updated successfully", type: "success" });
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile";
      setError(msg);
      showToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("data:")) return path;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${CONFIG.BASE_URL}${cleanPath}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold flex items-center gap-2 border border-red-100"
          >
            <X size={16} />
            {error}
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Avatar & Bio */}
          <div className="md:w-1/3 flex flex-col items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-slate-100 border-4 border-white shadow-xl group-hover:shadow-indigo-100 transition-all duration-300 ring-0 group-hover:ring-4 ring-indigo-500/10">
                {previewUrl ? (
                  <img 
                    src={getAvatarUrl(previewUrl)} 
                    alt="Avatar Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${formData.name}&background=random&size=128`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-400">
                    <User size={48} />
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                <Camera size={16} />
              </div>
            </div>

            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
            />
            
            <div className="w-full space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                <AlignLeft size={12} />
                About Me
              </label>
              <textarea
                name="bio"
                rows="5"
                className="flex w-full rounded-2xl border-2 border-slate-200 bg-white/90 px-3.5 py-2 text-sm transition-all duration-500 ease-out outline-none hover:border-slate-300 hover:bg-white ring-2 ring-transparent ring-offset-2 ring-offset-white focus:border-[#0B1320] focus:bg-white focus:ring-[#0B1320] shadow-[0_8px_20px_rgba(61,64,91,0.04)] resize-none leading-relaxed"
                placeholder="Tell us a bit about yourself..."
                value={formData.bio}
                onChange={handleChange}
                style={{
                  color: "var(--text-primary)",
                }}
              />
              <p className="text-[10px] text-right text-slate-400 font-bold mr-1">
                {formData.bio.length}/160
              </p>
            </div>
          </div>

          {/* Right Column: Inputs */}
          <div className="md:w-2/3 space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                required
                fullWidth
                placeholder="Your name"
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
                fullWidth
                disabled
                placeholder="your@email.com"
                className="bg-slate-50 cursor-not-allowed opacity-70"
              />

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                fullWidth
                placeholder="+1 234 567 890"
              />

              <div className="pt-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2">
                  Account Settings
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Public Profile</span>
                    <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-slate-50">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl h-12 border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            className="rounded-2xl h-12 shadow-lg shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700 font-bold"
            leftIcon={<Save size={18} />}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
