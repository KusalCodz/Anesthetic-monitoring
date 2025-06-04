import React from "react";
import "../styles/Button.css";

export default function Button({ children, ...props }) {
  return (
    <button className="custom-btn" {...props}>{children}</button>
  );
}