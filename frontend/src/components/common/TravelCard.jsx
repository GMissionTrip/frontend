import React from "react";
import "./TravelCard.css";

export const TravelCard = ({ image, title, date, size = "large" }) => {
  return (
    <div className={`card ${size}-card`}>
      <img src={image} alt={title} />
      <div className="card-text">
        <p>{title}</p>
        <p className="date">{date}</p>
      </div>
    </div>
  );
};
