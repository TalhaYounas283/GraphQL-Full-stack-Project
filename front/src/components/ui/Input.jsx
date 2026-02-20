import React, { useId } from 'react';

const Input = ({ 
  label,
  hint,
  error,
  id,
  className = '',
  leftIcon: LeftIcon,
  rightElement,
  ...props 
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {LeftIcon && (
          <div className="input-icon">
            <LeftIcon size={20} />
          </div>
        )}
        <input
          id={inputId}
          className={`form-input ${rightElement ? 'has-icon-right' : ''} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="input-action">
            {rightElement}
          </div>
        )}
      </div>
      {hint && !error && <p className="input-hint">{hint}</p>}
      {error && <p className="input-hint" style={{ color: '#dc2626' }}>{error}</p>}
    </div>
  );
};

export default Input;
