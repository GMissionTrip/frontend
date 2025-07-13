import React from "react";
import { HomeSidebar } from "@/components/common/HomeSidebar";

export const TopBar = ({ title, isSidebarOpen, onToggleSidebar }) => {
  return (
    <div className="top-bar">
      <span className="top-bar-title">{title}</span>
      <div className="menu-icon" onClick={onToggleSidebar}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="menu-line" />
        ))}
      </div>
      {isSidebarOpen && <HomeSidebar onClose={onToggleSidebar} />}
    </div>
  );
};
