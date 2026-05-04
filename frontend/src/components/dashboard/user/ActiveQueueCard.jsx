import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, ArrowRight, Share2, Repeat } from "lucide-react";
import { Card, Button, Modal } from "../..";
import { cn } from "../../../utils/cn";
import CreateExchangeRequest from "../../exchange/CreateExchangeRequest";
import { useExchange } from "../../../hooks/useExchange";
import { Toast } from "../../ui/Toast";

const ActiveQueueCard = ({ queue }) => {
  const { _id, title, business, userToken, position, estimatedWaitTime, userStatus } = queue;
  const isNear = position <= 3 && userStatus === 'waiting';
  
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const { createRequest } = useExchange();
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const handleExchangeSubmit = async (data) => {
    try {
      await createRequest(data);
      setToast({ show: true, message: "Exchange request sent successfully!", type: "success" });
      setShowExchangeModal(false);
    } catch (err) {
      setToast({ show: true, message: err, type: "error" });
    }
  };

  return (
    <>
      <Card className={cn(
        "p-6 border-slate-100 shadow-soft relative overflow-hidden transition-all group",
        isNear && "ring-2 ring-orange-500 bg-orange-50/30"
      )}>
        {isNear && (
          <div className="absolute top-0 right-0 px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl animate-pulse">
             Turn Near
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{business?.name}</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">{title}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Your Token</p>
              <p className="text-2xl font-black text-blue-600">#{userToken}</p>
           </div>
           <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Position</p>
              <p className="text-2xl font-black text-slate-900">{position}</p>
           </div>
        </div>

        <div className="flex items-center gap-6 mb-8 text-slate-500">
           <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span className="text-sm font-bold">~{estimatedWaitTime}m wait</span>
           </div>
           <div className="flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              <span className="text-sm font-bold">{position - 1} ahead</span>
           </div>
        </div>

        <div className="flex gap-3">
          <Link to={`/queue/${_id}`} className="flex-1">
            <Button fullWidth className="rounded-xl gap-2 shadow-lg shadow-blue-100">
               Live View
               <ArrowRight size={16} />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-xl shrink-0 border-indigo-100 text-indigo-600 hover:bg-indigo-50"
            onClick={() => setShowExchangeModal(true)}
            title="Exchange Spot"
          >
             <Repeat size={18} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl shrink-0">
             <Share2 size={18} />
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        title="Spot Exchange"
      >
        <CreateExchangeRequest
          initialQueueId={_id}
          onCancel={() => setShowExchangeModal(false)}
          onSubmit={handleExchangeSubmit}
        />
      </Modal>

      <Toast
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
};

export default ActiveQueueCard;
