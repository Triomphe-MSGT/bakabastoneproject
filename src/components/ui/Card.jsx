import React from 'react';
import './Card.css';

const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div 
      className={`ui-card ${hover ? 'ui-card-hover' : ''} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardImage = ({ src, alt, placeholder, className = '' }) => {
  return (
    <div className={`ui-card-image ${className}`}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <div className="ui-img-placeholder">{placeholder || alt}</div>
      )}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`ui-card-content ${className}`}>
      {children}
    </div>
  );
};

export default Card;
