import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card, Toast } from "../../components";
import { useAuth } from "../../context/AuthContext";

const VerifyOTP = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", type: "info" });

  
  const { verifyOTP, resendOTP, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleOtpChange = (index, value) => {
    const newValue = value.replace(/\D/g, "");
    if (!newValue && value !== "") return; // Reject non-digits, allow empty string (backspace)

    const newOtpArray = [...otpArray];
    
    // Handle pasting multiple digits
    if (newValue.length > 1) {
      const pastedDigits = newValue.split("").slice(0, 6);
      pastedDigits.forEach((digit, i) => {
        if (index + i < 6) newOtpArray[index + i] = digit;
      });
      setOtpArray(newOtpArray);
      
      const nextIndex = Math.min(index + pastedDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      setError("");
      return;
    }

    // Normal typing (1 digit)
    newOtpArray[index] = newValue;
    setOtpArray(newOtpArray);
    setError("");

    // Auto focus next input
    if (newValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = otpArray.join("");
    
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    const result = await verifyOTP({ email, otp });
    
    if (result.success) {
      setToast({
        open: true,
        message: "Account verified successfully!",
        type: "success",
      });
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      setError(result.message);
    }
  };

  const handleResend = async () => {
    setError("");
    const result = await resendOTP({ email });
    if (result.success) {
      setOtpArray(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setToast({
        open: true,
        message: "OTP resent successfully! Please check your email.",
        type: "success",
      });
    } else {
      setError(result.message || "Failed to resend OTP.");
    }
  };

  if (!email) return null;

  const getColors = (digit) => {
    // Warm Gold Theme for all boxes
    const theme = { bg: "bg-[#fffbf2]", border: "border-[#F2CC8F]", text: "text-[#b45309]", focus: "focus:border-[#F2CC8F] focus:ring-[#F2CC8F]/20" };
    
    if (digit) {
      return `${theme.bg} border-[2px] ${theme.border} ${theme.text} ${theme.focus}`;
    }
    return `bg-[#F8FAFC] border-[2px] border-[#E2E8F0] text-[#94A3B8] hover:bg-white hover:${theme.border} focus:bg-white ${theme.focus}`;
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
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Mail size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Verify Email</h1>
            <p className="mt-2 text-slate-500">
              We've sent a 6-digit verification code to <br />
              <span className="font-semibold text-slate-800">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
                Verification Code (OTP)
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otpArray.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-xl outline-none transition-all duration-300 shadow-sm focus:ring-[4px] ${getColors(digit)}`}
                  />
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth size="lg" isLoading={loading}>
              Verify Account
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              className="font-bold text-blue-600 hover:underline bg-transparent border-none cursor-pointer"
            >
              Resend OTP
            </button>
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

export default VerifyOTP;
