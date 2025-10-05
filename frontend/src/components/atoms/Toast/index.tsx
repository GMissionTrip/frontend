import React, { useEffect } from "react";
import "./styles.css";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = "info", 
  duration = 3000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type} fade-in`}>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
      <div className="toast-body">
        <div className="toast-icon">
          {type === "success" && "✓"}
          {type === "error" && "✕"}
          {type === "warning" && "⚠"}
          {type === "info" && "ℹ"}
        </div>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
};
