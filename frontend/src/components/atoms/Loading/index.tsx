import React from "react";
import "./styles.css";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = "medium", 
  text = "로딩 중...", 
  fullScreen = false 
}) => {
  return (
    <div className={`loading-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className={`loading-spinner ${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};
