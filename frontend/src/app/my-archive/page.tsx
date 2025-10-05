"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { TripCard } from "@/components/organisms/Archive/TripCard";
import { EditTripModal } from "@/components/organisms/Archive/EditTripModal";
import { SortDropdown } from "@/components/organisms/Archive/SortDropdown";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Search } from "@/components/atoms/Search";
import { Sidebar } from "@/components/organisms/Landing/Sidebar";
import { FaBars } from "react-icons/fa";
import { Trip } from "@/types";
import { archiveService } from "@/services/archiveService";
import { useToast } from "@/components/ToastProvider";
import "./MyArchivePage.css";

// 더미데이터
const initialTrips: Trip[] = [
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

export default function MyArchive() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [sortOption, setSortOption] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditClick = (trip: Trip) => {
    setEditingTrip(trip);
  };

  const handleCloseModal = () => {
    setEditingTrip(null);
  };

  const handleSaveTrip = (updatedTrip: Trip) => {
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
  };

  const toggleDropdown = (id: number) => setOpenDropdown(openDropdown === id ? null : id);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // 백엔드에서 아카이브 데이터 로드
  const loadArchives = useCallback(async () => {
    try {
      setIsLoading(true);
      const archives = await archiveService.getArchives();
      
      // Archive 타입을 Trip 타입으로 변환
      const convertedTrips: Trip[] = archives.map(archive => ({
        id: archive.id,
        title: archive.title,
        date: archive.date,
        location: archive.location,
        background: archive.background,
        isImage: archive.isImage
      }));
      
      setTrips(convertedTrips);
    } catch (error) {
      console.error("아카이브 로드 실패:", error);
      showToast("아카이브를 불러오는데 실패했습니다.", "error");
      // 에러 시 더미 데이터 사용
      setTrips(initialTrips);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

    // 컴포넌트 마운트 시 데이터 로드
    React.useEffect(() => {
      loadArchives();
    }, [loadArchives]);

  // 검색 및 정렬된 여행 목록
  const filteredAndSortedTrips = [...trips]
    .filter(trip => 
      searchQuery === "" || 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "latest") {
        // 최근 날짜순
        const aDate = new Date(a.date.split(" - ")[0]);
        const bDate = new Date(b.date.split(" - ")[0]);
        return bDate.getTime() - aDate.getTime();
      } else if (sortOption === "oldest") {
        // 오래된 날짜순
        const aDate = new Date(a.date.split(" - ")[0]);
        const bDate = new Date(b.date.split(" - ")[0]);
        return aDate.getTime() - bDate.getTime();
      } else if (sortOption === "title") {
        // 제목순
        return a.title.localeCompare(b.title, "ko");
      }
      return 0;
    });

  return (
    <div className="archive-wrapper">
      <LayoutTitleWithActions
        title="내 아카이브"
        showBack
        rightIcon={<FaBars />}
        onRightIconClick={handleSidebar}
      >
        <div className="archive-content">
        {/* 검색 및 정렬 */}
        <div className="archive-controls">
          <Search
            placeholder="여행 제목이나 지역으로 검색..."
            onSearch={handleSearch}
            onClear={handleClearSearch}
            className="archive-search"
          />
          <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        </div>

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="loading-state">
            <p>아카이브를 불러오는 중...</p>
          </div>
        ) : filteredAndSortedTrips.length > 0 ? (
          <div className="archive-list">
            {filteredAndSortedTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                isOpen={openDropdown === trip.id}
                onToggle={() => toggleDropdown(trip.id)}
                onClick={() => handleNavigate(`/my-archive/details/${trip.id}`)}
                onEditClick={handleEditClick}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🗺️"
            title={searchQuery ? "검색 결과가 없습니다" : "아직 여행 기록이 없어요"}
            description={
              searchQuery 
                ? `"${searchQuery}"에 대한 검색 결과를 찾을 수 없습니다. 다른 키워드로 검색해보세요.`
                : "첫 번째 여행을 기록하고 아름다운 추억을 만들어보세요!"
            }
            action={
              searchQuery 
                ? {
                    label: "검색 초기화",
                    onClick: handleClearSearch
                  }
                : {
                    label: "새 여행 시작하기",
                    onClick: () => handleNavigate("/input-trip-info1")
                  }
            }
            size="large"
          />
        )}
      </div>

      {editingTrip && (
        <EditTripModal trip={editingTrip} onClose={handleCloseModal} onSave={handleSaveTrip} />
      )}
      </LayoutTitleWithActions>

      {isSidebarOpen && <Sidebar onClose={handleSidebar} />}
    </div>
  );
}
