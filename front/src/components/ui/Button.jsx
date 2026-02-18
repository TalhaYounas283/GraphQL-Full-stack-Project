import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  isFullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  disabled,
  ...props 
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'lg' ? 'btn-lg' : '';
  const widthClass = isFullWidth ? 'btn-full' : '';
  
  const classes = [baseClass, variantClass, sizeClass, widthClass, className]
    .filter(Boolean)
    .join(' ');

  const iconSize = size === 'lg' ? 22 : 18;

  return (
    <button 
      className={classes} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 size={iconSize} className="btn-spinner" />
      )}
      {!isLoading && LeftIcon && <LeftIcon size={iconSize} />}
      {children}
      {!isLoading && RightIcon && <RightIcon size={iconSize} />}
    </button>
  );
};

export default Button;
