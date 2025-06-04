import React from 'react';

export const Card = ({ children, style = {}, className = '' }) => (
  <div
    style={{
      borderRadius: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      border: "1px solid rgb(77, 125, 221)",
      padding: "1rem",
      background: "#fff",
      width : "100%",
      height:"25%",
      position: "relative",
       /* moves 10px down */
      
      margin: "1rem auto",
      maxWidth: "800px",
      marginBottom: "2rem",
      ...style
    }}
    className={className}
  >
    {children}
  </div>
);

export const CardContent = ({ children, style = {}, className = '' }) => (
  <div style={{ padding: "0.5rem", ...style }} className={className}>
    {children}
  </div>
);