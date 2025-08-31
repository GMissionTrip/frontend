import { BottomModalSheet } from "@/components/common/BottomModalSheet";
import { loadKakaoMap } from "@/utils/loadKakaoMap.mjs";
import React, { useEffect, useRef } from "react";

export const SelectPlace = () => {
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
      <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
      <BottomModalSheet />
    </div>
  );
};
