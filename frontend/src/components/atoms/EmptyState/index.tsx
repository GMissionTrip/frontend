import React from "react";
import "./styles.css";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: "small" | "medium" | "large";
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "📭",
  title,
  description,
  action,
  size = "medium"
}) => {
  return (
    <div className={`empty-state empty-state-${size}`}>
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {action && (
        <button 
          className="empty-state-action"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
