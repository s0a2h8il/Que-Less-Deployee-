import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Zap, LayoutDashboard, LogOut, BarChart3,
  ShieldCheck, Compass, Home, Building2, ChevronRight, User,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const isAdmin      = user?.role === "admin" || user?.role === "superadmin";
  const isSuperAdmin = user?.role === "superadmin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  const navLinks = [
    { title: "Home",        path: "/",        icon: Home      },
    { title: "Explore",     path: "/explore",  icon: Compass   },
    { title: "For Business",path: "/business", icon: Building2 },
  ];

  const isActive = (path) => location.pathname === path;

  const roleBadge = isSuperAdmin
    ? { label: "Super Admin", bg: "bg-[#EA526F]/15 text-[#EA526F] border-[#EA526F]/30" }
    : isAdmin
    ? { label: "Admin",       bg: "bg-[#F2B33D]/15 text-[#F2B33D] border-[#F2B33D]/30" }
    : { label: "User",        bg: "bg-[#3AA0FF]/15 text-[#3AA0FF] border-[#3AA0FF]/30" };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "shadow-[0_2px_24px_rgba(11,19,32,0.18)]"
          : ""
      )}
      style={{
        background: scrolled
          ? "rgba(11,19,32,0.97)"
          : "rgba(11,19,32,0.88)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">

        {/* ── Logo ───────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -6 }}
            whileTap={{ scale: 0.93 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #3AA0FF 0%, #2888e8 100%)",
              boxShadow: "0 4px 14px rgba(58,160,255,0.40)",
            }}
          >
            <Zap size={17} fill="white" className="text-white" />
          </motion.div>
          <div className="hidden sm:flex flex-col leading-none">
            <span
              className="text-[17px] font-bold tracking-tight"
              style={{ color: "#F7F4EF", fontFamily: "var(--font-heading)" }}
            >
              Queue<span style={{ color: "#3AA0FF" }}>Less</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: "rgba(247,244,239,0.40)" }}>
              Virtual Queue
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav Links ───────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
              style={{
                color: isActive(link.path) ? "#F7F4EF" : "rgba(247,244,239,0.50)",
                fontFamily: "var(--font-body)",
              }}
            >
              {isActive(link.path) && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "rgba(58,160,255,0.12)",
                    border: "1px solid rgba(58,160,255,0.25)",
                    boxShadow: "0 0 12px rgba(58,160,255,0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{link.title}</span>
            </Link>
          ))}
        </div>

        {/* ── Desktop Right ───────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {isSuperAdmin && (
                <NavIconButton
                  to="/admin/superadmin"
                  icon={<ShieldCheck size={14} />}
                  label="Super Admin"
                  color="#EA526F"
                />
              )}
              {isAdmin && !isSuperAdmin && (
                <NavIconButton
                  to="/admin/dashboard"
                  icon={<ShieldCheck size={14} />}
                  label="Admin Panel"
                  color="#F2B33D"
                />
              )}
              {isAdmin && (
                <NavIconButton
                  to="/analytics"
                  icon={<BarChart3 size={14} />}
                  label="Analytics"
                  color="rgba(247,244,239,0.60)"
                />
              )}

              <div className="flex items-center justify-center w-9 h-9">
                <NotificationBell />
              </div>

              <div className="h-5 w-px mx-1" style={{ background: "rgba(255,255,255,0.10)" }} />

              <Link to="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: "rgba(247,244,239,0.06)",
                    border: "1px solid rgba(247,244,239,0.10)",
                  }}
                >
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white font-bold text-xs shadow-sm"
                    style={{ background: "linear-gradient(135deg, #3AA0FF 0%, #2888e8 100%)" }}
                  >
                    {user?.name?.[0]?.toUpperCase() || <User size={12} />}
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-semibold truncate max-w-[80px]" style={{ color: "#F7F4EF" }}>
                      {user?.name?.split(" ")[0] || "Dashboard"}
                    </span>
                    <span className={cn("text-[10px] font-semibold px-1.5 py-px rounded border mt-0.5 w-fit", roleBadge.bg)}>
                      {roleBadge.label}
                    </span>
                  </div>
                </motion.div>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all"
                style={{ color: "rgba(247,244,239,0.40)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#EA526F"; e.currentTarget.style.background = "rgba(234,82,111,0.10)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(247,244,239,0.40)"; e.currentTarget.style.background = "transparent"; }}
                title="Logout"
              >
                <LogOut size={16} />
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{ color: "rgba(247,244,239,0.55)", fontFamily: "var(--font-body)" }}
                >
                  Sign in
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(58,160,255,0.40)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2 text-sm font-semibold rounded-xl transition-all"
                  style={{
                    background: "#3AA0FF",
                    color: "#0B1320",
                    fontFamily: "var(--font-heading)",
                    boxShadow: "0 4px 14px rgba(58,160,255,0.30)",
                  }}
                >
                  Get Started
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile: bell + hamburger ─────────────────────────── */}
        <div className="flex items-center gap-2 lg:hidden">
          {isAuthenticated && (
            <div className="flex items-center justify-center w-9 h-9">
              <NotificationBell />
            </div>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-all"
            style={{
              color: "rgba(247,244,239,0.60)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.14 }}>
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.14 }}>
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(11,19,32,0.98)" }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {isAuthenticated && (
                <div
                  className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl"
                  style={{ background: "rgba(247,244,239,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold text-sm shrink-0"
                    style={{ background: "linear-gradient(135deg, #3AA0FF 0%, #2888e8 100%)" }}
                  >
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold truncate" style={{ color: "#F7F4EF" }}>{user?.name}</span>
                    <span className="text-xs truncate" style={{ color: "rgba(247,244,239,0.40)" }}>{user?.email}</span>
                  </div>
                  <span className={cn("ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0", roleBadge.bg)}>
                    {roleBadge.label}
                  </span>
                </div>
              )}

              {navLinks.map((link, i) => (
                <motion.div key={link.path} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link
                    to={link.path}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      color: isActive(link.path) ? "#3AA0FF" : "rgba(247,244,239,0.55)",
                      background: isActive(link.path) ? "rgba(58,160,255,0.10)" : "transparent",
                      border: isActive(link.path) ? "1px solid rgba(58,160,255,0.25)" : "1px solid transparent",
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <link.icon size={16} />
                      {link.title}
                    </div>
                    {isActive(link.path) && <ChevronRight size={14} style={{ color: "#3AA0FF" }} />}
                  </Link>
                </motion.div>
              ))}

              <div className="h-px my-2" style={{ background: "rgba(255,255,255,0.07)" }} />

              {isAuthenticated ? (
                <div className="space-y-1">
                  {[
                    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "rgba(247,244,239,0.55)" },
                    ...(isAdmin ? [{ to: "/analytics", icon: BarChart3, label: "Analytics", color: "rgba(247,244,239,0.55)" }] : []),
                    ...(isAdmin && !isSuperAdmin ? [{ to: "/admin/dashboard", icon: ShieldCheck, label: "Admin Panel", color: "#F2B33D" }] : []),
                    ...(isSuperAdmin ? [{ to: "/admin/superadmin", icon: ShieldCheck, label: "Super Admin", color: "#EA526F" }] : []),
                  ].map(({ to, icon: Icon, label, color }) => (
                    <Link key={to} to={to} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ color }}>
                      <Icon size={16} />
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ color: "#EA526F" }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <Link to="/login" className="block">
                    <button
                      className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-all"
                      style={{ color: "rgba(247,244,239,0.70)", background: "rgba(247,244,239,0.06)", border: "1px solid rgba(247,244,239,0.10)" }}
                    >
                      Sign in
                    </button>
                  </Link>
                  <Link to="/register" className="block">
                    <button
                      className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-all"
                      style={{ background: "#3AA0FF", color: "#0B1320", fontFamily: "var(--font-heading)" }}
                    >
                      Get Started →
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavIconButton = ({ to, icon, label, color }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all"
      style={{
        color,
        background: `${color}12`,
        border: `1px solid ${color}28`,
        fontFamily: "var(--font-body)",
      }}
    >
      {icon}
      {label}
    </motion.div>
  </Link>
);

export { Navbar };
