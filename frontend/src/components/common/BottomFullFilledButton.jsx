import React from "react";
import "./BottomFullFilledButton.css";

export const BottomFullFilledButton = ({ label, leftIcon = null, disabled = false, onClick }) => {
  return (
    <button
      className={`bottom-button ${disabled ? "disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && <img src={leftIcon} alt="" className="left-icon" />}
      <span>{label}</span>
    </button>
  );
};
