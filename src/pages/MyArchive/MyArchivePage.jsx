import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TripCard } from "@/components/Archive/TripCard";
import { EditTripModal } from "@/components/Archive/EditTripModal";
import { SortDropdown } from "@/components/Archive/SortDropdown";
import { FaArrowLeft, FaBars } from "react-icons/fa";
import { LayoutTitleWithActions } from "@/components/common/LayoutTitleWithActions";
import { HomeSidebar } from "@/components/common/HomeSidebar";

import "@/components/common/TopBar.css";
import "@/pages/MyArchive/MyArchivePage.css";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper";
import SwiperCore from "swiper";

SwiperCore.use([EffectCards]);
import "swiper/css";
import "swiper/css/effect-cards";

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
  const [viewMode, setViewMode] = useState("list");

  const navigate = useNavigate();

  const handleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleEditClick = (trip) => setEditingTrip(trip);
  const handleCloseModal = () => setEditingTrip(null);
  const handleSaveTrip = (updatedTrip) => {
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
  };
  const toggleDropdown = (id) => setOpenDropdown(openDropdown === id ? null : id);

  const sortedTrips = [...trips].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.date.split(" - ")[0]) - new Date(a.date.split(" - ")[0]);
    } else if (sortOption === "oldest") {
      return new Date(a.date.split(" - ")[0]) - new Date(b.date.split(" - ")[0]);
    } else if (sortOption === "title") {
      return a.title.localeCompare(b.title, "ko");
    }
    return 0;
  });

  return (
    <div className="archive-wrapper">
      <LayoutTitleWithActions
        title="내 아카이브"
        leftIcon={<FaArrowLeft />}
        onLeftIconClick={() => navigate("/main")}
        icon={<FaBars />}
        onIconClick={handleSidebar}
      />

      {isSidebarOpen && <HomeSidebar onClose={handleSidebar} />}

      {/* 뷰 모드 선택 버튼 */}
      <div className="view-toggle">
        <div
          className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          리스트형
        </div>
        <div
          className={`toggle-btn ${viewMode === "card" ? "active" : ""}`}
          onClick={() => setViewMode("card")}
        >
          카드형
        </div>
      </div>

      <div className="sort-button-wrapper">
        <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
      </div>

      {viewMode === "list" && (
        <div className="trip-list">
          {sortedTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              isOpen={openDropdown === trip.id}
              onToggle={() => toggleDropdown(trip.id)}
              onClick={() => navigate(`/my-archive/details/${trip.id}`, { state: trip })}
              onEditClick={handleEditClick}
              viewMode="list"
            />
          ))}
        </div>
      )}

      {viewMode === "card" && (
        <Swiper effect={"cards"} grabCursor={true} modules={[EffectCards]} className="mySwiper">
          {sortedTrips.map((trip) => (
            <SwiperSlide key={trip.id}>
              <div
                className="card-slide"
                style={{ background: trip.background }}
                onClick={() => navigate(`/my-archive/details/${trip.id}`, { state: trip })}
              >
                <div className="card-title">{trip.title}</div>
                <div className="card-date">{trip.date}</div>
                <div className="card-location">{trip.location}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {editingTrip && (
        <EditTripModal trip={editingTrip} onClose={handleCloseModal} onSave={handleSaveTrip} />
      )}
    </div>
  );
};
