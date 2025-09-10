import { BottomModalSheet } from "@/components/common/BottomModalSheet";
import { loadKakaoMap } from "@/utils/loadKakaoMap.mjs";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutTitleWithActions } from "@/components/common/LayoutTitleWithActions";
import { HomeSidebar } from "@/components/common/HomeSidebar";
import { FaArrowLeft, FaBars } from "react-icons/fa";

export const SelectPlace = () => {
  const navigate = useNavigate();
  const handleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    loadKakaoMap().then(() => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };

        new window.kakao.maps.Map(container, options);
      });
    });
  }, []);

  return (
    <div>
      {/* 상단 헤더 */}
      <LayoutTitleWithActions
        title="관광지 정보"
        leftIcon={<FaArrowLeft />}
        onLeftIconClick={() => navigate("/select-place")}
        icon={<FaBars />}
        onIconClick={handleSidebar}
      />
      {isSidebarOpen && <HomeSidebar onClose={handleSidebar} />}{" "}
      <div ref={mapRef} style={{ width: "100%", height: "90vh" }} />
      <BottomModalSheet />
    </div>
  );
};
