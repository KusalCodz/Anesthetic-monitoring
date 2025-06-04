import React from 'react';

export const Label = ({ htmlFor, children, style = {}, className = '', ...props }) => (
  <label
    htmlFor={htmlFor}
    style={{
      display: "block",
      fontSize: "1rem",
      fontWeight: 500,
      color: "#1d3557",
      marginBottom: "0.3rem",
      ...style
    }}
    className={className}
    {...props}
  >
    {children}
  </label>
);