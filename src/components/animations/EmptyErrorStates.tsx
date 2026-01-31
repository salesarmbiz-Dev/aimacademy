import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, SearchX, Lightbulb, Trophy, Heart, FlaskConical, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Error Boundary Fallback
export const ErrorFallback: React.FC<{ 
  error?: Error; 
  resetError?: () => void;
}> = ({ error, resetError }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <AlertTriangle className="w-16 h-16 text-primary mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">เกิดข้อผิดพลาด</h1>
        <p className="text-muted-foreground mb-6">
          ขออภัย มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง
        </p>
        {error && (
          <pre className="bg-secondary text-destructive text-xs p-4 rounded-lg mb-6 text-left overflow-auto max-h-40">
            {error.message}
          </pre>
        )}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            รีเฟรชหน้า
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="border-muted-foreground/50"
          >
            <Home className="w-4 h-4 mr-2" />
            กลับหน้าหลัก
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// API Error State (inline)
export const APIError: React.FC<{ 
  message?: string;
  onRetry?: () => void;
}> = ({ message = 'ไม่สามารถโหลดข้อมูลได้', onRetry }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12"
  >
    <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
      <AlertTriangle className="w-8 h-8 text-destructive" />
    </div>
    <p className="text-white font-medium mb-2">{message}</p>
    {onRetry && (
      <Button
        onClick={onRetry}
        variant="outline"
        size="sm"
        className="border-muted-foreground/50"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        ลองใหม่
      </Button>
    )}
  </motion.div>
);

// Empty State Props
interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
  onAction?: () => void;
}

// Generic Empty State
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionPath,
  onAction
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionPath) {
      navigate(actionPath);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-16 h-16 rounded-full bg-muted-foreground/20 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">{description}</p>
      {actionLabel && (
        <Button
          onClick={handleAction}
          className="bg-primary hover:bg-primary/90"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

// Pre-configured Empty States
export const EmptyExperiments: React.FC = () => (
  <EmptyState
    icon={FlaskConical}
    title="ยังไม่มีการทดลอง"
    description="เริ่มทดลอง Prompt แรกของคุณ"
    actionLabel="เริ่ม Experiment"
    actionPath="/prompt-lego"
  />
);

export const EmptyInsights: React.FC = () => (
  <EmptyState
    icon={Lightbulb}
    title="ยังไม่มี Insights"
    description="ทดลอง Prompt เพื่อค้นพบ Insights ใหม่ๆ"
    actionLabel="ไปทดลอง"
    actionPath="/prompt-lego"
  />
);

export const EmptyChallenges: React.FC = () => (
  <EmptyState
    icon={Trophy}
    title="ยังไม่มี Challenge ที่ผ่าน"
    description="ลองทำ Challenge เพื่อทดสอบทักษะ"
    actionLabel="ดู Challenges"
    actionPath="/challenges"
  />
);

export const EmptyFavorites: React.FC = () => (
  <EmptyState
    icon={Heart}
    title="ยังไม่มี Favorites"
    description="กด ♡ บน Block ที่ชอบ"
  />
);

export const EmptySearchResults: React.FC<{ onClear?: () => void }> = ({ onClear }) => (
  <EmptyState
    icon={SearchX}
    title="ไม่พบผลลัพธ์"
    description="ลองใช้คำค้นอื่น"
    actionLabel={onClear ? "ล้างการค้นหา" : undefined}
    onAction={onClear}
  />
);

export const EmptyHistory: React.FC = () => (
  <EmptyState
    icon={Clock}
    title="ยังไม่มีประวัติ"
    description="ทำกิจกรรมเพื่อดูประวัติของคุณ"
  />
);
