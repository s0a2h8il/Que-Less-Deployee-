import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { Loader } from "../ui/Loader";
import { Users, Send, AlertCircle, Info } from "lucide-react";
import { queueApi } from "../../api/queueApi";

const CreateExchangeRequest = ({ initialQueueId, onCancel, onSubmit }) => {
  const [queueId, setQueueId] = useState(initialQueueId || "");
  const [targetUserId, setTargetUserId] = useState("");
  const [message, setMessage] = useState("");
  const [waitingUsers, setWaitingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (queueId) {
      fetchQueueMembers();
    }
  }, [queueId]);

  const fetchQueueMembers = async () => {
    try {
      setLoading(true);
      const res = await queueApi.getQueueById(queueId);
      if (res.success) {
        // Filter waiting users (excluding current user)
        // Note: We need to make sure the backend returns the member list for this to work perfectly
        // or have a specific endpoint for 'exchangeable' users.
        // Assuming the backend returns members in the response now or we can use the existing data.
        const members = res.data.queue.members || [];
        setWaitingUsers(members.filter((m) => m.status === "waiting"));
      }
    } catch (err) {
      setError("Failed to load queue members");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!targetUserId) return;

    try {
      setSending(true);
      await onSubmit({ queueId, toUser: targetUserId, message });
      // Reset form
      setTargetUserId("");
      setMessage("");
    } catch (err) {
      setError(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="p-6 border-indigo-100 shadow-xl overflow-visible">
      <div className="flex items-center gap-3 mb-6 whitespace-nowrap">
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
          <Users size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            New Exchange Request
          </h3>
          <p className="text-sm text-slate-500">
            Request to swap spots with someone ahead of you
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader size="sm" />
        </div>
      ) : (
        <form onSubmit={handleSend} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
              Select User to Swap With
            </label>
            {waitingUsers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                {waitingUsers.map((member, idx) => (
                  <div
                    key={String(member.userId._id || idx)}
                    onClick={() => setTargetUserId(String(member.userId._id))}
                    className={`
                      cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center justify-between
                      ${
                        targetUserId === String(member.userId._id)
                          ? "border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-600/10"
                          : "border-slate-100 bg-white hover:border-slate-200"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        #{member.tokenNumber}
                      </div>
                      <span className="font-semibold text-slate-700 truncate max-w-[100px]">
                        {member.userId.name}
                      </span>
                    </div>
                    {targetUserId === String(member.userId._id) && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                        <Send size={10} className="ml-0.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Info size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">
                  No other waiting users available for swap
                </p>
              </div>
            )}
          </div>

          <Input
            label="Message (Optional)"
            placeholder="e.g. I'm in a hurry, would you mind swapping?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sending}
          />

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm flex items-center gap-2 animate-shake whitespace-nowrap">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-2xl"
              onClick={onCancel}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-2xl gap-2 shadow-lg shadow-indigo-200"
              disabled={sending || !targetUserId}
              loading={sending}
            >
              <Send size={18} /> Send Request
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
};

export default CreateExchangeRequest;
