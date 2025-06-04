import React from 'react';

export const Input = ({ name, type = 'text', placeholder, onChange, style = {}, className = '', ...props }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    onChange={onChange}
    style={{
      width: "100%",
      padding: "0.5rem",
      border: "1px solid #cbd5e1",
      borderRadius: "0.5rem",
      outline: "none",
      fontSize: "1rem",
      marginBottom: "0.2rem",
      ...style
    }}
    className={className}
    {...props}
  />
);