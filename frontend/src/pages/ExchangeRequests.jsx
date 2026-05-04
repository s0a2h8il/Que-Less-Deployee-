import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightLeft,
  Inbox,
  Send,
  History,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import { useExchange } from "../hooks/useExchange";
import IncomingExchangeRequests from "../components/exchange/IncomingExchangeRequests";
import OutgoingExchangeRequests from "../components/exchange/OutgoingExchangeRequests";
import ExchangeHistory from "../components/exchange/ExchangeHistory";
import { Loader, Button } from "../components";
import { Toast } from "../components/ui/Toast";

const ExchangeRequests = () => {
  const [activeTab, setActiveTab] = useState("incoming");
  const {
    incomingRequests,
    outgoingRequests,
    history,
    loading,
    error,
    acceptRequest,
    rejectRequest,
    refresh,
  } = useExchange();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const handleAccept = async (id) => {
    try {
      await acceptRequest(id);
      showToast("Exchange accepted! Your spot has been swapped.", "success");
    } catch (err) {
      showToast(err, "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      showToast("Exchange request rejected.", "info");
    } catch (err) {
      showToast(err, "error");
    }
  };

  const tabs = [
    {
      id: "incoming",
      label: "Incoming",
      icon: Inbox,
      count: incomingRequests.length,
    },
    {
      id: "outgoing",
      label: "Outgoing",
      icon: Send,
      count: outgoingRequests.length,
    },
    { id: "history", label: "History", icon: History, count: null },
  ];

  return (
    <div className="w-full bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3 whitespace-nowrap">
              <ArrowRightLeft className="text-indigo-600" size={36} />
              Spot Exchange
            </h1>
            <p className="text-slate-500 font-medium">
              Manage your queue spot swap requests
            </p>
          </div>
          <Button
            onClick={refresh}
            variant="outline"
            className="rounded-2xl gap-2 bg-white"
            disabled={loading}
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-slate-100 mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "text-slate-500 hover:bg-slate-50"
                }
              `}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`
                  ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-black
                  ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600"}
                `}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-100">
          {loading &&
          !incomingRequests.length &&
          !outgoingRequests.length &&
          !history.length ? (
            <div className="flex justify-center items-center h-64">
              <Loader size="lg" />
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100">
              <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
              <h3 className="text-lg font-bold text-red-900 mb-2">
                Error Loading Data
              </h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button
                onClick={refresh}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-100"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "incoming" && (
                  <IncomingExchangeRequests
                    requests={incomingRequests}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                )}
                {activeTab === "outgoing" && (
                  <OutgoingExchangeRequests requests={outgoingRequests} />
                )}
                {activeTab === "history" && (
                  <ExchangeHistory history={history} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <Toast
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default ExchangeRequests;
