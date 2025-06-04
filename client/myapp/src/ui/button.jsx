import React from 'react';

export const Button = ({ children, type = 'button', onClick, style = {}, className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    style={{
      padding: "0.5rem 1rem",
      background: "#2563eb",
      color: "#fff",
      borderRadius: "0.75rem",
      border: "none",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(30, 58, 138, 0.1)",
      transition: "background 0.2s",
      ...style
    }}
    className={className}
    onMouseOver={e => e.currentTarget.style.background = "#1d4ed8"}
    onMouseOut={e => e.currentTarget.style.background = "#2563eb"}
  >
    {children}
  </button>
);