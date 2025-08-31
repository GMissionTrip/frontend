import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "@/components/common/TopBar";
import { TripCard } from "@/components/Archive/TripCard";
import { EditTripModal } from "@/components/Archive/EditTripModal";
import { SortDropdown } from "@/components/Archive/SortDropdown";

import "@/components/common/TopBar.css";
import "@/pages/MyArchive/MyArchivePage.css";

// 더미데이터
const initialTrips = [
  {
    id: 1,
    title: "여행 제목A",
    date: "2025.06.01 - 2025.06.05",
    location: "Location",
    background:
      "url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?fit=crop&w=600&q=80')",
    isImage: true,
  },
  {
    id: 2,
    title: "여행 제목B",
    date: "2025.05.05 - 2025.06.10",
    location: "Location",
    background: "#003070",
  },
  {
    id: 3,
    title: "여행 제목C",
    date: "2025.06.05 - 2025.06.10",
    location: "Location",
    background: "#1F4300",
  },
  {
    id: 4,
    title: "여행 제목D",
    date: "2025.06.10 - 2025.06.10",
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
  const [sortOption, setSortOption] = useState("latest");

  const navigate = useNavigate();

  const handleNavigate = (path, state) => {
    navigate(path, { state });
  };

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditClick = (trip) => {
    setEditingTrip(trip);
  };

  const handleCloseModal = () => {
    setEditingTrip(null);
  };

  const handleSaveTrip = (updatedTrip) => {
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
  };

  const toggleDropdown = (id) => setOpenDropdown(openDropdown === id ? null : id);

  const sortedTrips = [...trips].sort((a, b) => {
    if (sortOption === "latest") {
      // 최근 날짜순
      const aDate = new Date(a.date.split(" - ")[0]);
      const bDate = new Date(b.date.split(" - ")[0]);
      return bDate - aDate;
    } else if (sortOption === "oldest") {
      // 오래된 날짜순
      const aDate = new Date(a.date.split(" - ")[0]);
      const bDate = new Date(b.date.split(" - ")[0]);
      return aDate - bDate;
    } else if (sortOption === "title") {
      // 제목순
      return a.title.localeCompare(b.title, "ko");
    }
    return 0;
  });
  return (
    <div className="archive-wrapper">
      <TopBar title="내 아카이브" isSidebarOpen={isSidebarOpen} onToggleSidebar={handleSidebar} />

      {/* 정렬 선택 */}
      <div className="sort-button-wrapper">
        <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
      </div>

      {sortedTrips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          isOpen={openDropdown === trip.id}
          onToggle={() => toggleDropdown(trip.id)}
          onClick={() => handleNavigate(`/my-archive/details/${trip.id}`, trip)}
          onEditClick={handleEditClick}
        />
      ))}

      {editingTrip && (
        <EditTripModal trip={editingTrip} onClose={handleCloseModal} onSave={handleSaveTrip} />
      )}
    </div>
  );
};
