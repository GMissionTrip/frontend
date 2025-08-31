import React, { useState } from "react";
import { BeforeTrip } from "./BeforeTrip";
import { AfterTrip } from "./AfterTrip";
import { LayoutTitleWithActions } from "@/components/common/LayoutTitleWithActions";
import { InProgressTrip } from "./InProgressTrip";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export const CurrentTrip = () => {
  const [tripStage, setTripStage] = useState("after");
  const navigate = useNavigate();

  return (
    <LayoutTitleWithActions
      title="강원도 여행"
      leftIcon={<FaArrowLeft />}
      onLeftIconClick={() => {
        navigate("/main");
      }}
    >
      {tripStage === "before" && <BeforeTrip />}
      {tripStage === "inprogress" && <InProgressTrip />}
      {tripStage === "after" && <AfterTrip />}
    </LayoutTitleWithActions>
  );
};
