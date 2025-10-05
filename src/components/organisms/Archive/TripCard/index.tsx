"use client";

import React from "react";

interface Trip {
  id: number;
  title: string;
  date: string;
  location: string;
  background: string;
  isImage?: boolean;
}

interface DropdownMenuProps {
  onEditClick: (trip: Trip) => void;
  trip: Trip;
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ onEditClick, trip, onClose }) => (
  <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
    <div
      className="dropdown-item"
      onClick={() => {
        onEditClick(trip);
        if (onClose) onClose();
      }}
    >
      수정하기
    </div>
    <div className="dropdown-divider" />
    <div className="dropdown-item">삭제하기</div>
  </div>
);

interface TripCardProps {
  trip: Trip;
  isOpen?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  onEditClick?: (trip: Trip) => void;
  className?: string;
}

export const TripCard: React.FC<TripCardProps> = ({ 
  trip, 
  isOpen = false, 
  onToggle, 
  onClick, 
  onEditClick, 
  className = "" 
}) => {
  return (
    <div className={`trip-card ${className}`} style={{ background: trip.background }}>
      <div onClick={onClick || (() => {})}>
        <div className="gradient-overlay" />
        <div className="trip-text">
          <div className="trip-title">{trip.title}</div>
          <div className="trip-date">{trip.date}</div>
          <div className="trip-location">{trip.location}</div>
        </div>
      </div>

      {onToggle && (
        <div
          className="dropdown-button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          ⋯
        </div>
      )}

      {isOpen && onToggle && (
        <DropdownMenu trip={trip} onEditClick={onEditClick!} onClose={onToggle} />
      )}
    </div>
  );
};
