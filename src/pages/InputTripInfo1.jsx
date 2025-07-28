import React, { useState, useCallback } from "react";
import "./InputTripInfo1.css";
import { LayoutTitleWithActions } from "@/components/common/LayoutTitleWithActions";
import { BottomFullFilledButton } from "@/components/common/BottomFullFilledButton";
import { GangwonMap } from "@/components/GangwonMap";
import placeIcon from "../assets/placeIcon.png";
import { useNavigate } from "react-router-dom";

export const InputTripInfo1 = () => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const navigate = useNavigate();

  const handleRegionClick = useCallback((regionName) => {
    console.log(regionName);
    setSelectedRegion(regionName);
  }, []);

  return (
    <LayoutTitleWithActions title="여행 정보 입력">
      <div className="input-trip-wrapper">
        <div className="trip-input-section">
          <div className="trip-input-group">
            <label htmlFor="region-input">여행 지역 입력</label>
            <input
              id="region-input"
              value={selectedRegion}
              placeholder="출발 지역을 입력해주세요 (선택사항)"
              className="trip-input"
              readOnly
            />
          </div>
          <GangwonMap onRegionClick={handleRegionClick} />
        </div>
        <BottomFullFilledButton
          label="여행정보 입력하기"
          leftIcon={placeIcon}
          disabled={false}
          onClick={() => navigate("/input-trip-info2")}
        />
      </div>
    </LayoutTitleWithActions>
  );
};
