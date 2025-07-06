import React from "react";
import "./LayoutTitleWithActions.css";

export const LayoutTitleWithActions = ({ title, icon, onIconClick, children }) => {
  return (
    <div>
      <div className="app-bar">
        <div className="title">{title}</div>
        {icon && (
          <div className="title-btn" onClick={onIconClick}>
            {icon}
          </div>
        )}
      </div>
      <div className="content">{children}</div>
    </div>
  );
};
