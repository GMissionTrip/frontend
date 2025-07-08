import React, { useState } from "react";

const DropdownMenu = () => (
  <div className="dropdown-menu">
    <div className="dropdown-item">수정하기</div>
    <div className="dropdown-divider" />
    <div className="dropdown-item">삭제하기</div>
  </div>
);

export const TripCard = ({ trip, isOpen, onToggle, onClick }) => {
  return (
    <div className="trip-card" style={{ background: trip.background }}>
      <div onClick={onClick}>
        <div className="gradient-overlay" />
        <div className="trip-text">
          <div className="trip-title">{trip.title}</div>
          <div className="trip-date">{trip.date}</div>
          <div className="trip-location">{trip.location}</div>
        </div>
      </div>
      <div className="dropdown-button" onClick={onToggle}>
        ⋯
      </div>
      {isOpen && <DropdownMenu />}
    </div>
  );
};
