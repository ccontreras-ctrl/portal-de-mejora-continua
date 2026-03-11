
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  extra?: ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, extra }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 sm:p-6 ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-primary">{title}</h2>
          {extra && <div>{extra}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
