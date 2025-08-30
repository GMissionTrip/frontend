import { LayoutTitleWithActions } from "@/components/common/LayoutTitleWithActions";
import placeIcon from "@/assets/placeIcon.png";
import { BottomFullFilledButton } from "@/components/common/BottomFullFilledButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import "./InputTripInfo2.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const InputTripInfo2 = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const tripThemes1 = ["자연", "도시", "역사", "바다", "산"];
  const tripThemes2 = ["맛집 탐방", "휴식", "액티비티", "문화 체험", "인스타 핫플"];
  const tripWith = ["나홀로", "연인과", "친구와", "아기와", "어르신과", "반려동물과"];

  return (
    <LayoutTitleWithActions
      title="여행 정보 입력"
      leftIcon={<FaArrowLeft />}
      onLeftIconClick={() => {
        navigate("/input-trip-info1");
      }}
    >
      <div className="input-trip-wrapper">
        <div className="trip-input-section">
          <div className="travel-companion-group">
            <label htmlFor="travel-companion">누구와 여행하나요?</label>
            <div id="travel-companion" className="travel-companion-list">
              {tripWith.map((item, idx) => (
                <div className="travel-companion-item" key={idx}>
                  <span className="travel-companion-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="travel-duration-group">
            <label htmlFor="travel-calendar">여행 기간</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="여행 시작일 선택"
              dateFormat="yyyy-MM-dd"
              isClearable
              inline
            />
          </div>
          <div className="trip-theme-group">
            <label>여행 테마 1</label>
            <div className="trip-theme-list">
              {tripThemes1.map((theme, idx) => (
                <div className="trip-theme-item" key={idx}>
                  {theme}
                </div>
              ))}
            </div>
          </div>

          {/* 여행 테마 2 */}
          <div className="trip-theme-group">
            <label>여행 테마 2</label>
            <div className="trip-theme-list">
              {tripThemes2.map((theme, idx) => (
                <div className="trip-theme-item" key={idx}>
                  {theme}
                </div>
              ))}
            </div>
          </div>
        </div>
        <BottomFullFilledButton
          label="미션 추천 받기"
          leftIcon={placeIcon}
          disabled={false}
          onClick={() => alert("버튼 클릭!")}
        />
      </div>
    </LayoutTitleWithActions>
  );
};
