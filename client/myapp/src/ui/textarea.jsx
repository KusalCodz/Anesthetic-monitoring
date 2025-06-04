import React from 'react';

export const Textarea = ({ name, placeholder, onChange, style = {}, className = '', ...props }) => (
  <textarea
    name={name}
    placeholder={placeholder}
    onChange={onChange}
    style={{
      width: "100%",
      padding: "0.5rem",
      border: "1px solid #cbd5e1",
      borderRadius: "0.5rem",
      minHeight: "80px",
      outline: "none",
      fontSize: "1rem",
      marginBottom: "0.2rem",
      ...style
    }}
    className={className}
    {...props}
  />
);