"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Loading } from "@/components/atoms/Loading";
import { FaCalendar, FaClock } from "react-icons/fa";
import { useToast } from "@/components/ToastProvider";
import { commonRules, validateDateRange, validateField } from "@/utils/validation";
import { useCompanions, useActivities, useThemes } from "@/hooks/queries/useTripOptionsQuery";
import "./styles.css";

export default function InputTripInfo2Page() {
  const [tripTitle, setTripTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [selectedCompanions, setSelectedCompanions] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const router = useRouter();
  const { showToast } = useToast();

  // React Query로 옵션 데이터 로드
  const { data: companions = [], isLoading: companionsLoading } = useCompanions();
  const { data: activities = [], isLoading: activitiesLoading } = useActivities();
  const { data: themes = [], isLoading: themesLoading } = useThemes();

  const isLoading = companionsLoading || activitiesLoading || themesLoading;

  const handleToggle = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleComplete = () => {
    // 필수 필드 검증
    if (!tripTitle || !startDate || !endDate) {
      showToast("모든 필수 필드를 입력해주세요.", "error");
      return;
    }

    // 날짜 범위 검증
    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.isValid) {
      showToast(dateValidation.errors[0], "error");
      return;
    }

    // 여행 제목 검증
    const titleValidation = validateField(tripTitle, commonRules.tripTitle);
    if (!titleValidation.isValid) {
      showToast(titleValidation.errors[0], "error");
      return;
    }

    // TODO: 여행 정보를 저장하고 다음 단계로 이동
    showToast("기본 정보가 저장되었습니다!", "success");
    router.push("/select-places");
  };

  const handleBack = () => {
    router.push("/input-trip-info1");
  };

  // 로딩 중
  if (isLoading) {
    return <Loading fullScreen text="옵션 데이터를 불러오는 중..." />;
  }

  return (
    <LayoutTitleWithActions
      title="여행 정보 입력"
      showBack
      backTo="/input-trip-info1"
    >
      <div className="input-trip-info2">
        <div className="form-container">
          <h2>나의 여행을 입력하세요</h2>
          <p className="form-subtitle">누구와 어디로 갈래요?</p>

          {/* 동행자 선택 */}
          <div className="form-group">
            <label className="form-label">누구와 여행하시나요?</label>
            <div className="option-grid">
              {companions.map((companion) => (
                <button
                  key={companion.id}
                  className={`option-button ${
                    selectedCompanions.includes(companion.id) ? "selected" : ""
                  }`}
                  onClick={() => handleToggle(setSelectedCompanions, companion.id)}
                >
                  <span className="option-icon">{companion.icon}</span>
                  <span className="option-label">{companion.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 활동 선택 */}
          <div className="form-group">
            <label className="form-label">무엇을 하고 싶나요?</label>
            <div className="option-grid">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  className={`option-button ${
                    selectedActivities.includes(activity.id) ? "selected" : ""
                  }`}
                  onClick={() => handleToggle(setSelectedActivities, activity.id)}
                >
                  <span className="option-icon">{activity.icon}</span>
                  <span className="option-label">{activity.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="divider"></div>

          {/* 여행 기간 */}
          <div className="form-group">
            <label className="form-label">
              <FaCalendar className="label-icon" />
              여행 기간
            </label>
            <div className="date-picker-container">
              <div className="date-input-wrapper">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="시작일"
                />
              </div>
              <span className="date-separator">~</span>
              <div className="date-input-wrapper">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="종료일"
                />
              </div>
            </div>
          </div>

          {/* 시간 선택 */}
          <div className="form-group">
            <label className="form-label">
              <FaClock className="label-icon" />
              활동 시간
            </label>
            <div className="time-selector">
              <div className="time-input-group">
                <span className="time-label">시작</span>
                <select
                  className="time-select"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, "0");
                    return (
                      <option key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </option>
                    );
                  })}
                </select>
                <span className="time-period">AM/PM</span>
              </div>
            </div>
          </div>

          {/* 여행 제목 */}
          <div className="form-group">
            <Input
              label="여행 제목"
              placeholder="예: 가평의 여름!"
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              validation={commonRules.tripTitle}
            />
          </div>

          {/* 여행 테마 선택 */}
          <div className="form-group">
            <label className="form-label">여행 테마 (최대 2개)</label>
            <div className="theme-grid">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  className={`theme-button ${
                    selectedThemes.includes(theme.id) ? "selected" : ""
                  }`}
                  onClick={() => {
                    if (selectedThemes.includes(theme.id)) {
                      // 이미 선택된 경우 제거
                      setSelectedThemes(selectedThemes.filter((t) => t !== theme.id));
                    } else if (selectedThemes.length < 2) {
                      // 2개 미만인 경우만 추가
                      setSelectedThemes([...selectedThemes, theme.id]);
                    } else {
                      // 2개 이상인 경우 토스트 메시지
                      showToast("최대 2개까지만 선택 가능합니다.", "warning");
                    }
                  }}
                  disabled={!selectedThemes.includes(theme.id) && selectedThemes.length >= 2}
                >
                  <span className="theme-icon">{theme.icon}</span>
                  <span className="theme-label">{theme.label}</span>
                </button>
              ))}
            </div>
            {selectedThemes.length > 0 && (
              <p className="selected-themes-count">
                {selectedThemes.length} / 2 선택됨
              </p>
            )}
          </div>

          <div className="button-group">
            <Button
              variant="primary"
              onClick={handleComplete}
              className="complete-button"
            >
              장소 선택하기 →
            </Button>
          </div>
        </div>
      </div>
    </LayoutTitleWithActions>
  );
}
