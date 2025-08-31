import React, { useState } from "react";
import "@/components/Archive/SortDropdown.css";
export const SortDropdown = ({ sortOption, setSortOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: "최신순", value: "latest" },
    { label: "오래된순", value: "oldest" },
    { label: "제목순", value: "title" },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value) => {
    setSortOption(value);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === sortOption)?.label;

  return (
    <div className="sort-dropdown-wrapper">
      <button className="sort-dropdown-btn" onClick={toggleDropdown}>
        {selectedLabel}
      </button>

      {isOpen && (
        <ul className="sort-dropdown-menu">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`sort-dropdown-item ${opt.value === sortOption ? "active" : ""}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
