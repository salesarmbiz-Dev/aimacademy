import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface AssessmentPreviewProps {
  hasCompletedPreTest?: boolean;
  preTestScore?: number;
  hasCompletedPostTest?: boolean;
  postTestScore?: number;
}

const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({
  hasCompletedPreTest = false,
  preTestScore = 0,
  hasCompletedPostTest = false,
  postTestScore = 0,
}) => {
  const navigate = useNavigate();
  const { isGuestMode } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-card border-primary/30 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">ประเมินทักษะ AI Prompting</h3>
                <p className="text-sm text-muted-foreground">วัดระดับทักษะ 6 ด้าน</p>
              </div>
            </div>
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              hasCompletedPreTest 
                ? 'bg-accent/10 text-accent' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {hasCompletedPreTest ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Pre-test: {preTestScore}%
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  Pre-test
                </>
              )}
            </div>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              hasCompletedPostTest 
                ? 'bg-primary/10 text-primary' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {hasCompletedPostTest ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Post-test: {postTestScore}%
                </>
              ) : hasCompletedPreTest ? (
                <>
                  <Target className="w-4 h-4" />
                  Post-test
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Post-test
                </>
              )}
            </div>
          </div>

          {/* Improvement Badge (if both completed) */}
          {hasCompletedPreTest && hasCompletedPostTest && postTestScore > preTestScore && (
            <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded-xl text-center">
              <p className="text-accent font-semibold">
                🎉 พัฒนาขึ้น +{postTestScore - preTestScore}%!
              </p>
            </div>
          )}

          {/* CTA */}
          <Button
            onClick={() => navigate('/assessment')}
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isGuestMode}
          >
            {isGuestMode ? (
              'สร้าง Account เพื่อประเมิน'
            ) : hasCompletedPreTest ? (
              'ดูผลการประเมิน'
            ) : (
              'เริ่มประเมินทักษะ'
            )}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssessmentPreview;
