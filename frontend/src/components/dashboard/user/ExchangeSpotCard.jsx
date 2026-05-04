import React from "react";
import { Repeat, Info, ArrowRight } from "lucide-react";
import { Card, Button } from "../..";
import { useNavigate } from "react-router-dom";

const ExchangeSpotCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-8 border-slate-100 shadow-soft bg-slate-900 text-white border-none">
       <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10">
             <Repeat size={24} />
          </div>
          <div>
             <h4 className="text-xl font-bold">Spot Exchange</h4>
             <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Feature Active</p>
          </div>
       </div>

       <p className="text-sm text-slate-400 leading-relaxed mb-8">
          Running late? Or want to move ahead? Request a spot exchange with other members in the queue. 
          Both parties must agree for the exchange to take place.
       </p>

       <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3 mb-8">
          <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">Manage your incoming and outgoing exchange requests in the exchange panel.</p>
       </div>

       <Button 
         fullWidth 
         className="bg-blue-600 hover:bg-blue-500 text-white border-none rounded-xl gap-2 shadow-lg shadow-blue-900/20"
         onClick={() => navigate("/exchanges")}
       >
          Exchange Panel <ArrowRight size={16} />
       </Button>
    </Card>
  );
};

export default ExchangeSpotCard;
