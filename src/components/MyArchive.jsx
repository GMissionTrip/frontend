import React, { useState } from "react";
import "../styles/MyArchive.css";

const trips = [
  {
    id: 1,
    title: "여행 제목",
    date: "2025.06.05 ~ 2025.06.10",
    location: "Location",
    background:
      "url('https://images.unsplash.com/photo-1605169987296-28fce84f0b30?fit=crop&w=600&q=80')",
    isImage: true,
  },
  {
    id: 2,
    title: "여행 제목",
    date: "2025.06.05 ~ 2025.06.10",
    location: "Location",
    background: "#003070",
  },
  {
    id: 3,
    title: "여행 제목",
    date: "2025.06.05 ~ 2025.06.10",
    location: "Location",
    background: "#1F4300",
  },
  {
    id: 4,
    title: "여행 제목",
    date: "2025.06.05 ~ 2025.06.10",
    location: "Location",
    background:
      "url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?fit=crop&w=600&q=80')",
    isImage: true,
  },
];

// const TopBar = () => (
//   <div className="top-bar">
//     <span className="top-bar-title">내 아카이브</span>
//     <div className="menu-icon">
//       <div className="menu-line" />
//       <div className="menu-line" />
//       <div className="menu-line" />
//     </div>
//   </div>
// );
const TopBar = () => (
  <div className="top-bar">
    <span className="top-bar-title">내 아카이브</span>
    <div className="menu-icon">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="menu-line" />
      ))}
    </div>
  </div>
);

const SortButton = () => (
  <div className="sort-button-wrapper">
    <button className="sort-button">정렬 ▾</button>
  </div>
);

const DropdownMenu = () => (
  <div className="dropdown-menu">
    <div className="dropdown-item">수정하기</div>
    <div className="dropdown-divider" />
    <div className="dropdown-item">삭제하기</div>
  </div>
);

const TripCard = ({ trip, isOpen, onToggle }) => (
  <div className="trip-card" style={{ background: trip.background }}>
    <div className="gradient-overlay" />
    <div className="trip-text">
      <div className="trip-title">{trip.title}</div>
      <div className="trip-date">{trip.date}</div>
      <div className="trip-location">📍 {trip.location}</div>
    </div>
    <div className="dropdown-button" onClick={onToggle}>
      ⋯
    </div>
    {isOpen && <DropdownMenu />}
    {trip.id === 1 && <div className="trip-number">1</div>}
  </div>
);

export default function MyArchive() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const toggleDropdown = (id) => setOpenDropdown(openDropdown === id ? null : id);

  return (
    <div className="archive-wrapper">
      <TopBar />
      <SortButton />
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          isOpen={openDropdown === trip.id}
          onToggle={() => toggleDropdown(trip.id)}
        />
      ))}
    </div>
  );
}
