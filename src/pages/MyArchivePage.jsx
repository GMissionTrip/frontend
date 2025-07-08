import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/MyArchive.css";
import { HomeSidebar } from "@/components/common/HomeSidebar";
import { TripCard } from "@/components/Archive/TripCard";
import { EditTripModal } from "@/components/Archive/EditTripModal";

// 더미데이터
const initialTrips = [
  {
    id: 1,
    title: "여행 제목",
    date: "2025.06.05 ~ 2025.06.10",
    location: "Location",
    background:
      "url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?fit=crop&w=600&q=80')",
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

export const MyArchive = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [trips, setTrips] = useState(initialTrips);
  const [editingTrip, setEditingTrip] = useState(null);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = (id) => setOpenDropdown(openDropdown === id ? null : id);
  const handleEditClick = (trip) => {
    setEditingTrip(trip);
  };

  const handleCloseModal = () => {
    setEditingTrip(null);
  };

  const handleSaveTrip = (updatedTrip) => {
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
  };
  return (
    <div className="archive-wrapper">
      <div className="top-bar">
        <span className="top-bar-title">내 아카이브</span>
        <div className="menu-icon" onClick={handleSidebar}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="menu-line" />
          ))}
        </div>
        {isSidebarOpen && <HomeSidebar onClose={handleSidebar} />}
      </div>

      <div className="sort-button-wrapper">
        <button className="sort-button">정렬 ▼</button>
      </div>

      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          isOpen={openDropdown === trip.id}
          onToggle={() => toggleDropdown(trip.id)}
          onClick={() => handleNavigate(`/my-archive/details/${trip.id}`)}
          onEditClick={handleEditClick}
        />
      ))}

      {editingTrip && (
        <EditTripModal trip={editingTrip} onClose={handleCloseModal} onSave={handleSaveTrip} />
      )}
    </div>
  );
};
