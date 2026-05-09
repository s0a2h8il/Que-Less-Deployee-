import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card, Input, Toast } from "../../components";
import { useAuth } from "../../context/AuthContext";
import { setToken } from "../../utils/token";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info",
  });
  const { login, loading: authLoading } = useAuth();
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");
    const userParam = params.get("user");
    const errorParam = params.get("error");

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }

    if (tokenParam && userParam) {
      setIsProcessingOAuth(true);
      try {
        setToken(tokenParam);
        // Direct redirect without full page reload if possible, 
        // but window.location.href is safer for clearing URL params
        window.location.href = from;
        return;
      } catch (err) {
        console.error("Failed to parse Google user data", err);
        setIsProcessingOAuth(false);
      }
    }

    // 2. Handle standard redirect toasts
    const redirectToast = location.state?.toast;
    if (redirectToast) {
      setToast({
        open: true,
        type: redirectToast.type || "info",
        message: redirectToast.message || "Please sign in to continue.",
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location, from]);

  if (isProcessingOAuth) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-lg font-bold text-slate-700 animate-pulse">Authenticating with Google...</p>
      </div>
    );
  }

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
      setToast({
        open: true,
        message: "Logged in successfully!",
        type: "success",
      });
      setTimeout(() => navigate(from, { replace: true }), 2500);
    } else {
      if (result.message && result.message.includes("Account not verified")) {
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } else {
        setError(result.message);
      }
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
            <h1 className="text-3xl font-extrabold text-slate-900">
              Welcome Back
            </h1>
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

            <Button type="submit" fullWidth size="lg" isLoading={authLoading}>
              Sign In
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
              window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
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
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-600 hover:underline"
            >
              Create one now
            </Link>
          </div>
        </Card>
      </motion.div>

      <Toast
        isOpen={toast.open}
        message={toast.message}
        type={toast.type}
        duration={2500}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
};

export default Login;
