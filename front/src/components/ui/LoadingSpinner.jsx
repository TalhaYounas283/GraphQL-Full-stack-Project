import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: '',
    lg: 'spinner-lg',
  };

  return (
    <div className={`spinner ${sizeClasses[size]} ${className}`} />
  );
};

export default LoadingSpinner;
