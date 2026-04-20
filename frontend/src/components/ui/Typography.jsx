import React from "react";
import "./Typography.css";

const Typography = ({ 
  variant = "body", 
  children, 
  className = "", 
  align = "left",
  color = "default" 
}) => {
  const Tag = ["h1", "h2", "h3", "h4"].includes(variant) ? variant : "p";
  
  const classes = [
    `typography-${variant}`,
    `align-${align}`,
    `color-${color}`,
    className
  ].join(" ").trim();

  return <Tag className={classes}>{children}</Tag>;
};

export default Typography;
