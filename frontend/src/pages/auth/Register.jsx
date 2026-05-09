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
        message: "Account created! Please verify your email to continue.",
        type: "success",
      });
      setTimeout(() => navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`), 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900">
              Create Account
            </h1>
            <p className="mt-2 text-slate-500">Join QueueLess today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            </div>

            {error && (
              <p className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth size="lg" isLoading={loading}>
              Get Started
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/auth/google?role=${formData.role}`;
            }}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-4.3 0-8.01 2.47-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </button>

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
