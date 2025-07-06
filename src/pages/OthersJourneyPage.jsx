import React from "react";
import { useNavigate } from "react-router-dom";

export const OthersJourneyPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      OthersJourneyPage
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        홈으로
      </button>
    </div>
  );
};
