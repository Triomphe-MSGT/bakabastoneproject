import React from 'react';
import './Section.css';

const Section = ({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  background = 'default',
  id
}) => {
  return (
    <section 
      id={id} 
      className={`ui-section ui-section-${background} ${className}`}
    >
      <div className="container">
        {(title || subtitle) && (
          <div className="ui-section-header">
            {title && <h2 className="ui-section-title">{title}</h2>}
            <div className="ui-section-line"></div>
            {subtitle && <p className="ui-section-subtitle">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
