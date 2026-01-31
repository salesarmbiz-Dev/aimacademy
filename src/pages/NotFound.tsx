import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Eye, Puzzle, GraduationCap } from 'lucide-react';
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
        className="text-center max-w-lg"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <GraduationCap className="w-10 h-10 text-accent" />
          <span className="text-2xl font-bold text-accent">AIM Academy</span>
        </motion.div>

        {/* 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <span className="text-8xl">🔍</span>
        </motion.div>
        
        <motion.span
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-[100px] font-bold text-secondary block leading-none mb-4"
        >
          404
        </motion.span>
        
        <h1 className="text-2xl font-bold text-foreground mb-3">ไม่พบหน้าที่คุณต้องการ</h1>
        <p className="text-rackley mb-8">หน้านี้อาจถูกย้ายหรือไม่มีอยู่แล้ว</p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="border-rackley text-rackley hover:bg-rackley/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับ
          </Button>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="bg-turquoise text-oxford-blue hover:bg-turquoise/90"
          >
            <Home className="w-4 h-4 mr-2" />
            หน้าหลัก
          </Button>
        </div>

        {/* Suggestions */}
        <div className="pt-6 border-t border-rackley/30">
          <p className="text-rackley text-sm mb-4">หรือลองหน้าเหล่านี้:</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              asChild 
              variant="ghost" 
              className="text-turquoise hover:bg-turquoise/10"
            >
              <Link to="/spot">
                <Eye className="w-4 h-4 mr-2" />
                Spot the Difference
              </Link>
            </Button>
            <Button 
              asChild 
              variant="ghost" 
              className="text-tennessee hover:bg-tennessee/10"
            >
              <Link to="/prompt-lego">
                <Puzzle className="w-4 h-4 mr-2" />
                Prompt Lego
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
