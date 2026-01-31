import React from 'react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description = 'กำลังพัฒนาเร็วๆ นี้' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{title}</h1>
      <span className="inline-block px-4 py-2 bg-tennessee text-white text-sm font-semibold rounded-md mb-4">
        Coming Soon
      </span>
      <p className="text-rackley text-lg">{description}</p>
    </div>
  );
};
