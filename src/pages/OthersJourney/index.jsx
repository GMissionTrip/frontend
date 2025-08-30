import { LayoutTitleWithActions } from "@/components/common/LayoutTitleWithActions";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRegUser } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import OtherTravelCard from "@/components/common/OtherTravelCard";
import "./styles.css";

export const OthersJourneyPage = () => {
  const navigate = useNavigate();
  const dummyData = [
    {
      id: 1,
      title: "여행 이야기",
      view: 20,
      like: 40,
      imageUrl:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      subtitle: "여행을 떠나요",
    },
    {
      id: 2,
      title: "자연과 함께",
      view: 15,
      like: 30,
      imageUrl:
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=400&q=80",
      subtitle: "자연을 만끽하는 여행",
    },
    {
      id: 3,
      title: "도시 탐방",
      view: 25,
      like: 50,
      imageUrl:
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=400&q=80",
      subtitle: "도시의 매력을 느껴보세요",
    },
  ];

  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("최신순");

  const filterOptions = ["최신순", "조회순", "좋아요순"];

  const handleFilterToggle = () => {
    setShowFilter((prev) => !prev);
  };

  const handleFilterSelect = (option) => {
    setSelectedFilter(option);
    setShowFilter(false);
  };

  return (
    <LayoutTitleWithActions
      title={"다른 사람의 이야기"}
      leftIcon={<FaArrowLeft />}
      onLeftIconClick={() => {
        navigate("/main");
      }}
      icon={<FaRegUser />}
      onIconClick={() => navigate("/login")}
    >
      <div className="others-journey-filter-btn">
        <button onClick={handleFilterToggle}>
          <FaFilter className="others-journey-filter-icon" />
        </button>
        <span>{selectedFilter}</span>
        {showFilter && (
          <div className="others-journey-filter-dropdown">
            {filterOptions.map((option) => (
              <div key={option} onClick={() => handleFilterSelect(option)}>
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        {dummyData.map((item) => (
          <OtherTravelCard key={item.id} data={item} />
        ))}
      </div>
    </LayoutTitleWithActions>
  );
};
