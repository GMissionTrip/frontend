import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/pages/MyArchive/MyArchivePage";
import "@/components/Archive/EditTripModal.css";

export const EditTripModal = ({ trip, onClose, onSave }) => {
  const [title, setTitle] = useState(trip?.title || "");
  const [location, setLocation] = useState(trip?.location || "");

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (!trip?.date) return;

    const [startStr, endStr] = trip.date.split(" - ");
    const parse = (d) => {
      const [year, month, day] = d.split(".");
      return new Date(year, month - 1, day);
    };
    setDateRange([parse(startStr), parse(endStr)]);
  }, [trip]);

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
