"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Place } from "@/types/place";
import "./styles.css";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapWithPlacesProps {
  places: Place[];
  selectedPlaces: Place[];
  onPlaceClick: (place: Place) => void;
  center?: { lat: number; lng: number };
}

export const KakaoMapWithPlaces: React.FC<KakaoMapWithPlacesProps> = ({
  places,
  selectedPlaces,
  onPlaceClick,
  center = { lat: 38.207, lng: 128.591 }, // 속초 기본 좌표
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoTooltipsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // 카카오 맵 초기화
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: 8, // 확대 레벨
        };

        const kakaoMap = new window.kakao.maps.Map(container, options);
        mapInstanceRef.current = kakaoMap;
      } else {
        // 카카오 맵 스크립트 로드
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
          process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || "a1695389a580ad3b3491b1d31db7dfbc"
        }&autoload=false`;
        script.async = true;
        script.onload = () => {
          window.kakao.maps.load(() => {
            const container = mapRef.current;
            if (!container) return;
            
            const options = {
              center: new window.kakao.maps.LatLng(center.lat, center.lng),
              level: 8,
            };

            const kakaoMap = new window.kakao.maps.Map(container, options);
            mapInstanceRef.current = kakaoMap;
          });
        };
        document.head.appendChild(script);
      }
    };

    loadKakaoMap();
  }, [center.lat, center.lng]);

  // 마커 클릭 핸들러 (useCallback으로 메모이제이션)
  const handleMarkerClick = useCallback((place: Place, markerElement: HTMLElement) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 바운스 애니메이션
    markerElement.style.animation = "marker-bounce 0.5s ease";
    setTimeout(() => {
      markerElement.style.animation = "";
    }, 500);

    // 클릭한 마커로 부드럽게 이동 (확대 없이)
    const moveLatLon = new window.kakao.maps.LatLng(place.lat, place.lng);
    map.panTo(moveLatLon);
    
    // 바텀 시트 열기
    onPlaceClick(place);
  }, [onPlaceClick]);

  // 툴팁 표시/숨김 핸들러
  const showTooltip = useCallback((placeId: string) => {
    const tooltip = infoTooltipsRef.current.get(placeId);
    if (tooltip) {
      tooltip.style.display = "block";
    }
  }, []);

  const hideTooltip = useCallback((placeId: string) => {
    const tooltip = infoTooltipsRef.current.get(placeId);
    if (tooltip) {
      tooltip.style.display = "none";
    }
  }, []);

  // 마커 생성 및 업데이트
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.kakao) return;

    // 기존 마커 제거
    markersRef.current.forEach((overlay) => {
      overlay.setMap(null);
    });
    markersRef.current = [];

    // 기존 툴팁 제거
    infoTooltipsRef.current.clear();

    // 새 마커 생성
    const newMarkers = places.map((place) => {
      const markerPosition = new window.kakao.maps.LatLng(place.lat, place.lng);
      const isSelected = selectedPlaces.some((p) => p.id === place.id);
      const order = selectedPlaces.findIndex((p) => p.id === place.id) + 1;

      // 커스텀 오버레이 컨테이너
      const container = document.createElement("div");
      container.style.cssText = "position: relative;";

      // 마커 엘리먼트
      const markerContent = document.createElement("div");
      markerContent.style.cssText = `
        cursor: pointer;
        text-align: center;
        transition: transform 0.3s ease;
      `;

      if (isSelected) {
        // 선택된 마커 (빨간색 + 번호)
        markerContent.innerHTML = `
          <div class="marker-selected" style="
            background: #FF6B6B;
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 8px rgba(255, 107, 107, 0.5);
            border: 3px solid white;
            transition: all 0.3s ease;
          ">
            <span style="
              transform: rotate(45deg);
              font-weight: bold;
              font-size: 16px;
            ">${order}</span>
          </div>
          <div style="
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 8px solid #FF6B6B;
          "></div>
        `;
      } else {
        // 기본 마커 (회색)
        markerContent.innerHTML = `
          <div class="marker-default" style="
            background: #94A3B8;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            border: 2px solid white;
            font-size: 12px;
            transition: all 0.3s ease;
          ">📍</div>
        `;
      }

      // 툴팁 엘리먼트
      const tooltip = document.createElement("div");
      tooltip.style.cssText = `
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-8px);
        padding: 8px 12px;
        font-size: 13px;
        font-weight: 500;
        color: #333;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        white-space: nowrap;
        display: none;
        pointer-events: none;
        z-index: 1000;
      `;
      tooltip.textContent = place.name;

      container.appendChild(tooltip);
      container.appendChild(markerContent);

      // 툴팁 참조 저장
      infoTooltipsRef.current.set(place.id, tooltip);

      // 이벤트 리스너 (한 번만 추가)
      const clickHandler = () => handleMarkerClick(place, markerContent);
      const mouseenterHandler = () => {
        markerContent.style.transform = "scale(1.15) translateY(-3px)";
        showTooltip(place.id);
      };
      const mouseleaveHandler = () => {
        markerContent.style.transform = "scale(1) translateY(0)";
        hideTooltip(place.id);
      };

      markerContent.addEventListener("click", clickHandler);
      markerContent.addEventListener("mouseenter", mouseenterHandler);
      markerContent.addEventListener("mouseleave", mouseleaveHandler);

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: markerPosition,
        content: container,
        yAnchor: isSelected ? 1.5 : 1.3,
        zIndex: isSelected ? 100 : 1,
      });

      customOverlay.setMap(map);

      return customOverlay;
    });

    markersRef.current = newMarkers;

    // 모든 마커가 보이도록 지도 범위 조정
    if (places.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      places.forEach((place) => {
        bounds.extend(new window.kakao.maps.LatLng(place.lat, place.lng));
      });
      map.setBounds(bounds);
    }

    // cleanup: 마커 제거
    return () => {
      newMarkers.forEach((overlay) => {
        overlay.setMap(null);
      });
    };
  }, [places, selectedPlaces, handleMarkerClick, showTooltip, hideTooltip]);

  return (
    <div className="kakao-map-container">
      <div ref={mapRef} className="kakao-map" />
    </div>
  );
};

