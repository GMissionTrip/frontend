import React from "react";
import "./LayoutTitleWithActions.css";

export const LayoutTitleWithActions = ({
  title,
  icon,
  onIconClick,
  leftIcon,
  onLeftIconClick,
  rightIcon,
  onRightIconClick,
  children,
}) => {
  return (
    <div>
      <div className="app-bar">
        {leftIcon && (
          <div className="left-icon" onClick={onLeftIconClick}>
            {leftIcon}
          </div>
        )}
        <div className="title">{title}</div>
        {rightIcon && (
          <div className="right-icon" onClick={onRightIconClick}>
            {rightIcon}
          </div>
        )}
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
