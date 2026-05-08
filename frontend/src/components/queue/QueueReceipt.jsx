import React, { forwardRef } from "react";
import { Zap, MapPin, Clock, Calendar, CheckCircle2 } from "lucide-react";

const QueueReceipt = forwardRef(({ queue, userMember, preview = false }, ref) => {
  if (!queue || !userMember) return null;

  const businessName = queue.business?.name || queue.businessId?.name || "Business";
  const address = [queue.business?.address, queue.business?.city].filter(Boolean).join(", ");
  const joinedAt = userMember.joinedAt
    ? new Date(userMember.joinedAt).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    : "N/A";

  return (
    <div
      ref={ref}
      id="queue-receipt-capture"
      className="receipt-container"
      style={{
        width: preview ? "100%" : "600px",
        minHeight: preview ? "auto" : "240px",
        background: "#F7F4EF",
        borderRadius: preview ? "24px" : "0px",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#3D405B",
        position: preview ? "relative" : "fixed",
        left: preview ? "0" : "-2000px",
        top: preview ? "0" : "0",
        display: "flex",
        overflow: "hidden",
        boxShadow: preview ? "0 10px 40px rgba(0,0,0,0.1)" : "none",
        zIndex: preview ? 1 : -1,
      }}
    >
      <style>{`
        .receipt-container {
          flex-direction: row;
        }
        @media (max-width: 640px) {
          .receipt-container {
            flex-direction: column !important;
            width: 100% !important;
            height: auto !important;
          }
          .branding-side {
            width: 100% !important;
            flex-direction: row !important;
            padding: 20px !important;
          }
          .token-side {
            border-right: none !important;
            border-bottom: 2px dashed rgba(61,64,91,0.1) !important;
            padding: 30px !important;
          }
          .details-side {
            width: 100% !important;
            padding: 24px !important;
          }
        }
      `}</style>

      {/* Left Branding Side */}
      <div className="branding-side" style={{
        width: "180px",
        background: "#3D405B",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        flexShrink: 0,
        transition: "all 0.3s ease"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.1)",
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Zap size={28} fill="#F2CC8F" color="#F2CC8F" />
        </div>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "16px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", margin: 0, color: "#F2CC8F" }}>
            Queue-Less
          </h1>
          <p style={{ fontSize: "9px", fontWeight: 700, opacity: 0.5, marginTop: "4px", textTransform: "uppercase" }}>
            Digital Ticket
          </p>
        </div>
      </div>

      {/* Center Token Side */}
      <div className="token-side" style={{
        flex: 1,
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRight: "2px dashed rgba(61,64,91,0.1)",
        background: "white"
      }}>
        <p style={{ fontSize: "11px", fontWeight: 800, opacity: 0.4, textTransform: "uppercase", marginBottom: "4px", letterSpacing: "1px" }}>
          Token
        </p>
        <div style={{ fontSize: "80px", fontWeight: 900, color: "#E07A5F", lineHeight: 1 }}>
          #{userMember.tokenNumber}
        </div>
      </div>

      {/* Right Details Side */}
      <div className="details-side" style={{
        width: "260px",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "white",
        flexShrink: 0
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "9px", fontWeight: 800, opacity: 0.4, textTransform: "uppercase", marginBottom: "2px" }}>Queue</p>
            <p style={{ fontSize: "14px", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{queue.title}</p>
          </div>
          <div>
            <p style={{ fontSize: "9px", fontWeight: 800, opacity: 0.4, textTransform: "uppercase", marginBottom: "2px" }}>Location</p>
            <p style={{ fontSize: "14px", fontWeight: 800, color: "#3D405B" }}>{businessName}</p>
            <p style={{ fontSize: "11px", opacity: 0.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>{address}</p>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ fontSize: "9px", fontWeight: 800, opacity: 0.4, textTransform: "uppercase", marginBottom: "2px" }}>Joined</p>
            <p style={{ fontSize: "12px", fontWeight: 700 }}>{joinedAt.split(',')[1]}</p>
          </div>
          <p style={{ fontSize: "9px", fontWeight: 700, opacity: 0.3 }}>
            ID: {userMember._id?.substring(0, 8).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
});

export default QueueReceipt;
