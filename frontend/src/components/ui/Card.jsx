import React from "react";
import "./Card.css";

const Card = ({ children, className = "", padding = "md", radius = "lg", border = true }) => {
  const cardClasses = [
    "card-primitive",
    `padding-${padding}`,
    `radius-${radius}`,
    border ? "border-active" : "",
    className
  ].join(" ").trim();

  return <div className={cardClasses}>{children}</div>;
};

export default Card;
