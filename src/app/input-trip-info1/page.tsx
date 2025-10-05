"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { GangwonMap } from "@/components/organisms/GangwonMap";
import { FaArrowLeft } from "react-icons/fa";
import { commonRules, validateDateRange, validateField } from "@/utils/validation";
import { useToast } from "@/components/ToastProvider";
import "./styles.css";

export default function InputTripInfo1Page() {
  const [tripTitle, setTripTitle] = useState("");
  const [tripLocation, setTripLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const router = useRouter();
  const { showToast } = useToast();

  const handleRegionClick = (regionName: string) => {
    setSelectedRegion(regionName);
    setTripLocation(regionName);
    showToast(`${regionName}이(가) 선택되었습니다.`, "success");
  };

  const handleNext = () => {
    // 지역 선택 검증
    if (!tripLocation) {
      showToast("여행 지역을 선택해주세요.", "error");
      return;
    }

    showToast(`${tripLocation} 여행을 계획합니다!`, "success");
    // TODO: 선택한 지역 정보를 다음 페이지로 전달
    router.push("/input-trip-info2");
  };

  const handleBack = () => {
    router.push("/main");
  };

  return (
    <LayoutTitleWithActions
      title="여행 정보 입력"
      showBack
      backTo="/main"
    >
      <div className="input-trip-info1">
        <div className="form-container">
          <h2>나만의 여행을 위한 일정 입력</h2>
          <p className="form-subtitle">여행하고 싶은 지역을 선택해주세요</p>
          
          <div className="form-group">
            <label className="form-label">여행 지역 선택</label>
            <GangwonMap 
              onRegionClick={handleRegionClick}
              selectedRegion={selectedRegion}
            />
          </div>

          <div className="form-group">
            <Input
              label="선택된 지역"
              placeholder="지도에서 지역을 선택하거나 직접 입력"
              value={tripLocation}
              onChange={(e) => {
                setTripLocation(e.target.value);
                setSelectedRegion("");
              }}
              validation={commonRules.required}
              helperText="지도에서 지역을 클릭하거나 직접 입력해주세요"
            />
          </div>

          <div className="button-group">
            <Button variant="outline" onClick={handleBack}>
              취소
            </Button>
            <Button variant="primary" onClick={handleNext}>
              다음
            </Button>
          </div>
        </div>
      </div>
    </LayoutTitleWithActions>
  );
}
