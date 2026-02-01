import React from 'react';

export const AuthDivider: React.FC = () => {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-rackley/50" />
      <span className="text-rackley text-sm">หรือ</span>
      <div className="flex-1 h-px bg-rackley/50" />
    </div>
  );
};
