import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Eye, Puzzle, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmptyAssets: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <BookOpen className="w-12 h-12 text-muted-foreground/30" />
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-foreground mb-2 text-center">
        คลังของคุณยังว่างเปล่า
      </h2>

      {/* Description */}
      <p className="text-muted-foreground text-center max-w-md mb-6">
        เริ่มเล่นเกมเพื่อสร้าง AI assets ที่มีค่า — ทุกเกมจบลงจะได้ deliverable กลับมา
      </p>

      {/* CTA */}
      <Button
        onClick={() => navigate('/games')}
        className="mb-8"
        size="lg"
      >
        เริ่มเล่นเกม →
      </Button>

      {/* Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full">
        <PreviewCard
          icon={<Eye className="w-6 h-6 text-muted-foreground" />}
          title="Spot the Difference"
          description="Patterns & Insights"
        />
        <PreviewCard
          icon={<Puzzle className="w-6 h-6 text-primary" />}
          title="Prompt Lego"
          description="Prompt Templates"
        />
        <PreviewCard
          icon={<FileCheck className="w-6 h-6 text-accent" />}
          title="SOP Machine"
          description="Professional SOPs"
        />
      </div>
    </div>
  );
};

interface PreviewCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-muted/50 rounded-xl p-4 text-center">
      <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground">→ {description}</p>
    </div>
  );
};
