import React from 'react';

export const RadioGroup = ({ name, value, onValueChange, children, style = {}, className = '' }) => (
  <div style={{ display: "flex", gap: "1rem", ...style }} className={className}>
    {React.Children.map(children, child =>
      React.cloneElement(child, {
        name,
        checked: child.props.value === value,
        onChange: () => onValueChange(child.props.value),
      })
    )}
  </div>
);

export const RadioGroupItem = ({ name, value, checked, onChange, id, children, style = {}, className = '' }) => (
  <label htmlFor={id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", ...style }} className={className}>
    <input
      type="radio"
      name={name}
      value={value}
      id={id}
      checked={checked}
      onChange={onChange}
      style={{ accentColor: "#2563eb", marginRight: "0.2rem" }}
    />
    <span>{children}</span>
  </label>
);