


import React, { ReactNode } from 'react';

interface AlertProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  children: ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  children,
  className = ''
}) => {
  const variantClasses = {
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
    info: 'alert-info',
  };

  const classes = [
    'alert',
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="alert">
      {children}
    </div>
  );
};
