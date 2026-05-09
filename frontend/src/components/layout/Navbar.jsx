import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Zap,
  LayoutDashboard,
  LogOut,
  BarChart3,
  ShieldCheck,
  Compass,
  Home,
  Building2,
  ChevronRight,
  User,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";
import { CONFIG } from "../../constants/config";

const Navbar = () => {
  const palette = {
    cream: "#FFF7EA",
    sand: "#F2CC8F",
    peach: "#E07A5F",
    mint: "#81B29A",
    ink: "#3D405B",
    sky: "#BEE3F8",
  };

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isSuperAdmin = user?.role === "superadmin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${CONFIG.BASE_URL}${cleanPath}`;
  };

  const navLinks = [
    { title: "Home", path: "/", icon: Home },
    { title: "Explore", path: "/explore", icon: Compass },
    { title: "For Business", path: "/business", icon: Building2 },
  ];

  const isActive = (path) => location.pathname === path;

  const roleBadge = isSuperAdmin
    ? {
        label: "Super Admin",
        bg: "bg-[#EA526F]/15 text-[#EA526F] border-[#EA526F]/30",
      }
    : isAdmin
      ? {
          label: "Admin",
          bg: "bg-[#F2B33D]/15 text-[#F2B33D] border-[#F2B33D]/30",
        }
      : {
          label: "User",
          bg: "bg-[#3AA0FF]/15 text-[#3AA0FF] border-[#3AA0FF]/30",
        };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "shadow-[0_8px_30px_rgba(61,64,91,0.10)]" : "",
      )}
      style={{
        background: scrolled
          ? "rgba(255,247,234,0.92)"
          : "rgba(255,247,234,0.84)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        borderBottom: "1px solid rgba(61,64,91,0.10)",
      }}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* ── Logo ───────────────────────────────────────────── */}
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 shrink-0 group whitespace-nowrap"
          aria-label="QueueLess"
        >
          <motion.div
            whileHover={{ scale: 1.08, rotate: -6 }}
            whileTap={{ scale: 0.93 }}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)",
              boxShadow: "0 10px 22px rgba(224,122,95,0.22)",
            }}
          >
            <Zap size={14} fill="white" className="text-white sm:w-[17px] sm:h-[17px]" />
          </motion.div>
          <div className="flex flex-col leading-none">
            <span
              className="text-base sm:text-[17px] font-bold tracking-tight"
              style={{ color: palette.ink, fontFamily: "var(--font-heading)" }}
            >
              Queue<span style={{ color: palette.peach }}>Less</span>
            </span>
            <span
              className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em]"
              style={{ color: "rgba(61,64,91,0.52)" }}
            >
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
              className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap"
              style={{
                color: isActive(link.path)
                  ? palette.ink
                  : "rgba(61,64,91,0.62)",
                fontFamily: "var(--font-body)",
              }}
            >
              {isActive(link.path) && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(129,178,154,0.18) 0%, rgba(190,227,248,0.34) 100%)",
                    border: "1px solid rgba(129,178,154,0.28)",
                    boxShadow: "0 8px 18px rgba(61,64,91,0.06)",
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
                  color={palette.peach}
                />
              )}
              {isAdmin && !isSuperAdmin && (
                <NavIconButton
                  to="/admin/dashboard"
                  icon={<ShieldCheck size={14} />}
                  label="Admin Panel"
                  color={palette.sand}
                />
              )}
              {isAdmin && (
                <NavIconButton
                  to="/analytics"
                  icon={<BarChart3 size={14} />}
                  label="Analytics"
                  color={palette.ink}
                />
              )}

              <div className="flex items-center justify-center w-9 h-9">
                <NotificationBell />
              </div>

              <div
                className="h-5 w-px mx-1"
                style={{ background: "rgba(61,64,91,0.12)" }}
              />

              <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl cursor-pointer transition-all whitespace-nowrap"
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    border: "1px solid rgba(61,64,91,0.10)",
                    boxShadow: "0 8px 18px rgba(61,64,91,0.05)",
                  }}
                >
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white font-bold text-xs shadow-sm overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)",
                    }}
                  >
                    {user?.avatar ? (
                      <img 
                        key={user.avatar}
                        src={getAvatarUrl(user.avatar)} 
                        alt="" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerText = user?.name?.[0]?.toUpperCase() || "U";
                        }}
                      />
                    ) : (
                      user?.name?.[0]?.toUpperCase() || <User size={12} />
                    )}
                  </div>
                  <div className="flex flex-col leading-none">
                    <span
                      className="text-xs font-semibold truncate max-w-[80px]"
                      style={{ color: palette.ink }}
                    >
                      {user?.name?.split(" ")[0] || "Dashboard"}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-1.5 py-px rounded border mt-0.5 w-fit",
                        roleBadge.bg,
                      )}
                    >
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
                style={{ color: "rgba(61,64,91,0.48)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = palette.peach;
                  e.currentTarget.style.background = "rgba(224,122,95,0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(61,64,91,0.48)";
                  e.currentTarget.style.background = "transparent";
                }}
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
                  style={{
                    cursor: "pointer",
                    color: "rgba(61,64,91,0.66)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Sign in
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(58,160,255,0.40)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2 text-sm font-semibold rounded-xl transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, #3D405B 0%, #4F5D75 100%)",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-heading)",
                    boxShadow: "0 10px 22px rgba(61,64,91,0.22)",
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
              color: "rgba(61,64,91,0.62)",
              border: "1px solid rgba(61,64,91,0.10)",
              background: "rgba(255,255,255,0.64)",
            }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.14 }}
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.14 }}
                >
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
            style={{
              borderTop: "1px solid rgba(61,64,91,0.10)",
              background: "rgba(255,247,234,0.96)",
            }}
          >
            <div className="max-w-7xl mx-auto px-4 pt-6 pb-12 space-y-2">
              {isAuthenticated && (
                <div
                  className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl whitespace-nowrap"
                  style={{
                    background: "rgba(255,255,255,0.72)",
                    border: "1px solid rgba(61,64,91,0.10)",
                  }}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold text-sm shrink-0 overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)",
                    }}
                  >
                    {user?.avatar ? (
                      <img 
                        key={user.avatar}
                        src={getAvatarUrl(user.avatar)} 
                        alt="" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerText = user?.name?.[0]?.toUpperCase() || "U";
                        }}
                      />
                    ) : (
                      user?.name?.[0]?.toUpperCase() || "U"
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className="text-sm font-semibold truncate"
                      style={{ color: palette.ink }}
                    >
                      {user?.name}
                    </span>
                    <span
                      className="text-xs truncate"
                      style={{ color: "rgba(61,64,91,0.56)" }}
                    >
                      {user?.email}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0",
                      roleBadge.bg,
                    )}
                  >
                    {roleBadge.label}
                  </span>
                </div>
              )}

              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={link.path}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
                    style={{
                      color: isActive(link.path)
                        ? palette.ink
                        : "rgba(61,64,91,0.68)",
                      background: isActive(link.path)
                        ? "rgba(129,178,154,0.14)"
                        : "transparent",
                      border: isActive(link.path)
                        ? "1px solid rgba(129,178,154,0.24)"
                        : "1px solid transparent",
                    }}
                  >
                    <div className="flex items-center gap-2.5 whitespace-nowrap">
                      <link.icon size={16} />
                      {link.title}
                    </div>
                    {isActive(link.path) && (
                      <ChevronRight
                        size={14}
                        style={{ color: palette.peach }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}

              <div
                className="h-px my-2"
                style={{ background: "rgba(61,64,91,0.10)" }}
              />

              {isAuthenticated ? (
                <div className="space-y-1">
                  {[
                    {
                      to: "/dashboard",
                      icon: LayoutDashboard,
                      label: "Dashboard",
                      color: "rgba(247,244,239,0.55)",
                    },
                    ...(isAdmin
                      ? [
                          {
                            to: "/analytics",
                            icon: BarChart3,
                            label: "Analytics",
                            color: "rgba(247,244,239,0.55)",
                          },
                        ]
                      : []),
                    ...(isAdmin && !isSuperAdmin
                      ? [
                          {
                            to: "/admin/dashboard",
                            icon: ShieldCheck,
                            label: "Admin Panel",
                            color: "#F2B33D",
                          },
                        ]
                      : []),
                    ...(isSuperAdmin
                      ? [
                          {
                            to: "/admin/superadmin",
                            icon: ShieldCheck,
                            label: "Super Admin",
                            color: "#EA526F",
                          },
                        ]
                      : []),
                  ].map(({ to, icon: Icon, label, color }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
                      style={{ color }}
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
                    style={{ color: palette.peach }}
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
                      style={{
                        color: palette.ink,
                        background: "rgba(255,255,255,0.72)",
                        border: "1px solid rgba(61,64,91,0.10)",
                      }}
                    >
                      Sign in
                    </button>
                  </Link>
                  <Link to="/register" className="block">
                    <button
                      className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-all"
                      style={{
                        background:
                          "linear-gradient(135deg, #3D405B 0%, #4F5D75 100%)",
                        color: "#FFFFFF",
                        fontFamily: "var(--font-heading)",
                      }}
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
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
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
