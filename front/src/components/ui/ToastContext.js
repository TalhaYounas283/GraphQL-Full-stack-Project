import React, { useContext } from 'react';

const ToastContext = React.createContext(null);

export default ToastContext;

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
