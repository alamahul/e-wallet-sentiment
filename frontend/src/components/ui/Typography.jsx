import React from "react";
import "./Typography.css";

const Typography = ({ 
  variant = "body", 
  children, 
  className = "", 
  align = "left",
  color = "default" 
}) => {
  const Tag = variant === "h1" ? "h1" : variant === "h2" ? "h2" : "p";
  
  const classes = [
    `typography-${variant}`,
    `align-${align}`,
    `color-${color}`,
    className
  ].join(" ").trim();

  return <Tag className={classes}>{children}</Tag>;
};

export default Typography;
