import React from "react";
import Image from "next/image";
import { TravelCardProps } from "@/types";
import "./styles.css";

export const TravelCard: React.FC<TravelCardProps> = ({ image, title, date, size = "large" }) => {
  return (
    <div className={`card ${size}-card`}>
      <Image src={image} alt={title} />
      <div className="card-text">
        <p>{title}</p>
        <p className="date">{date}</p>
      </div>
    </div>
  );
};
