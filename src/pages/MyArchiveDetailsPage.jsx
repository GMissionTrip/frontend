import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { TripCard } from "@/components/Archive/TripCard";
import { TopBar } from "@/components/common/TopBar";

export const MyArchiveDetails = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mapRef = useRef(null);

  const location = useLocation();
  const trip = location.state;

  if (!trip) {
    return <div>여행 정보가 없습니다.</div>;
  }

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const createMap = () => {
      if (!mapRef.current) return;

      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);
    };

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(createMap);
    } else {
      if (!document.querySelector('script[src*="dapi.kakao.com"]')) {
        const script = document.createElement("script");
        script.src =
          "//dapi.kakao.com/v2/maps/sdk.js?appkey=a1695389a580ad3b3491b1d31db7dfbc&autoload=false&libraries=services";
        script.async = true;
        script.onload = () => window.kakao.maps.load(createMap);
        document.head.appendChild(script);
      }
    }
  }, []);

  return (
    <>
      <TopBar title="상세 정보" isSidebarOpen={isSidebarOpen} onToggleSidebar={handleSidebar} />
      <TripCard trip={trip} className="trip-card-details" />

      {/* 지도 띄우기 */}
      <div ref={mapRef} style={{ width: "100%", height: "250px" }}></div>
      <div className="trip-details"></div>
    </>
  );
};
