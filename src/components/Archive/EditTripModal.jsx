import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/pages/MyArchivePage.css";

export const EditTripModal = ({ trip, onClose, onSave }) => {
  const [title, setTitle] = useState(trip.title);
  const [location, setLocation] = useState(trip.location);

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const [startStr, endStr] = trip.date.split(" ~ ");
    const parse = (d) => {
      const [year, month, day] = d.split(".");
      return new Date(year, month - 1, day);
    };
    setDateRange([parse(startStr), parse(endStr)]);
  }, [trip.date]);

  const handleSave = () => {
    const formatDate = (date) =>
      `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

    onSave({
      ...trip,
      title,
      location,
      date: `${formatDate(startDate)} ~ ${formatDate(endDate)}`,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <label>
          제목
          <p />
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          위치
          <p />
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>

        <label>
          여행 기간
          <p />
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            dateFormat="yyyy.MM.dd"
            placeholderText="날짜를 선택하세요"
            inline={false}
          />
          {/* <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              if (update[0] && update[1]) {
                setDateRange(update); // 범위 선택 완료
              } else if (update[0] && startDate && endDate) {
                setDateRange([update[0], null]); // 새로운 시작일로 초기화
              } else {
                setDateRange(update); // 일반 업데이트
              }
            }}
            dateFormat="yyyy.MM.dd"
            placeholderText="날짜를 선택하세요"
            shouldCloseOnSelect={true} // ✅ 날짜 선택 시 자동 닫힘
            withPortal // ✅ 모바일 대응 or 팝업 강제
          /> */}
        </label>

        <div className="modal-buttons">
          <button onClick={handleSave} disabled={!startDate || !endDate}>
            저장
          </button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};
