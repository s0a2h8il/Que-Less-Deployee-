import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Shield, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card, Input, Toast } from "../../components";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info",
  });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      setToast({
        open: true,
        message: "Account created successfully!",
        type: "success",
      });
      setTimeout(() => navigate("/"), 1000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900">
              Create Account
            </h1>
            <p className="mt-2 text-slate-500">Join QueueLess today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              name="name"
              placeholder="Sahil Vala"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="sahil@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Account Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "user" })}
                  className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all ${
                    formData.role === "user"
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <User size={16} />
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "admin" })}
                  className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all ${
                    formData.role === "admin"
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <Shield size={16} />
                  Admin
                </button>
              </div>
            </div>

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
              />
              <button
                type="button"
                className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
            />

            {error && (
              <p className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth size="lg" isLoading={loading}>
              Get Started
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </Card>
      </motion.div>

      <Toast
        isOpen={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
};

export default Register;
