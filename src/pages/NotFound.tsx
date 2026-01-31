import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.error("404 Error: User attempted to access:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.span
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-[120px] font-bold text-secondary block leading-none mb-4"
        >
          404
        </motion.span>
        <h1 className="text-2xl font-bold text-white mb-3">หน้านี้หายไปแล้ว!</h1>
        <p className="text-muted-foreground mb-8">ไม่พบหน้าที่คุณกำลังหา</p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)} className="btn-press">
            <ArrowLeft className="w-4 h-4 mr-2" />กลับ
          </Button>
          <Button onClick={() => navigate('/dashboard')} className="bg-primary btn-press">
            <Home className="w-4 h-4 mr-2" />หน้าหลัก
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
