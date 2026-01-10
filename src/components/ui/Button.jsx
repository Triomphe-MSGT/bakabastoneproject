import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({ 
  children, 
  to, 
  variant = 'primary', 
  className = '', 
  onClick, 
  type = 'button',
  ...props 
}) => {
  const btnClass = `btn btn-${variant} ${className}`;

  if (to) {
    return (
      <Link to={to} className={btnClass} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={btnClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
