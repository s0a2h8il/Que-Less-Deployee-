import React, { useState, useEffect } from "react";
import { User, Mail, Save, X } from "lucide-react";
import { Modal, Input, Button } from "../..";
import { authApi } from "../../../api/authApi";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authApi.updateProfile(formData);
      if (response.success) {
        setUser(response.data.user);
        showToast({ message: "Profile updated successfully", type: "success" });
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      showToast({ 
        message: err.response?.data?.message || "Failed to update profile", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}
        
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          icon={User}
          required
          fullWidth
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
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            leftIcon={<Save size={18} />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
