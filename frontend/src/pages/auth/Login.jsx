import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card, Input, Toast } from "../../components";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", type: "info" });
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(formData);
    if (result.success) {
      setToast({ open: true, message: "Logged in successfully!", type: "success" });
      setTimeout(() => navigate(from, { replace: true }), 1000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900">Welcome Back</h1>
            <p className="mt-2 text-slate-500">Sign in to manage your queues</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="sahil@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />

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
              />
              <button
                type="button"
                className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Create one now
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

export default Login;
