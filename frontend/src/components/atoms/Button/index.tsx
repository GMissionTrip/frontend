import React from "react";
import "./styles.css";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
  type = "button",
  className = "",
  leftIcon,
  rightIcon,
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
    </button>
  );
};
