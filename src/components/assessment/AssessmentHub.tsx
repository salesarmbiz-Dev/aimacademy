import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ClipboardCheck, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Target,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAssessment, AssessmentAttempt } from '@/hooks/useAssessment';
import { useAuth } from '@/contexts/AuthContext';
import AssessmentRadarChart from './AssessmentRadarChart';

const AssessmentHub: React.FC = () => {
  const navigate = useNavigate();
  const { isGuestMode } = useAuth();
  const { 
    loading, 
    preTestAttempt, 
    postTestAttempt, 
    challengesCompleted,
    isPostTestUnlocked,
    getSkillScores,
  } = useAssessment();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-rackley/20 rounded w-64 animate-pulse mb-8" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 bg-rackley/20 rounded-2xl animate-pulse" />
            <div className="h-64 bg-rackley/20 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const preTestSkills = getSkillScores(preTestAttempt);
  const postTestSkills = getSkillScores(postTestAttempt);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              ประเมินทักษะ AI Prompting
            </h1>
          </div>
          <p className="text-muted-foreground">
            วัดระดับทักษะของคุณใน 6 ด้าน
          </p>
        </motion.div>

        {/* Guest Mode Warning */}
        {isGuestMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center"
          >
            <p className="text-primary font-medium">
              ⚠️ กรุณาสร้าง Account เพื่อบันทึกผลการประเมิน
            </p>
            <Button 
              onClick={() => navigate('/register')}
              className="mt-2 bg-primary hover:bg-primary/90"
            >
              สร้าง Account
            </Button>
          </motion.div>
        )}

        {/* Test Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pre-test Card */}
          <TestCard
            type="pre_test"
            title="Pre-test"
            subtitle="ทดสอบก่อนเรียน"
            attempt={preTestAttempt}
            isLocked={false}
            onStart={() => navigate('/assessment/test?type=pre_test')}
            onViewResults={() => navigate(`/assessment/results?type=pre_test`)}
          />

          {/* Post-test Card */}
          <TestCard
            type="post_test"
            title="Post-test"
            subtitle="ทดสอบหลังเรียน"
            attempt={postTestAttempt}
            isLocked={!isPostTestUnlocked}
            lockReason={
              !preTestAttempt 
                ? 'ต้องทำ Pre-test ก่อน' 
                : `เล่นเกมครบ 20 ข้อ (${challengesCompleted}/20)`
            }
            onStart={() => navigate('/assessment/test?type=post_test')}
            onViewResults={() => navigate(`/assessment/results?type=post_test`)}
          />
        </div>

        {/* Results Section */}
        {(preTestAttempt || postTestAttempt) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-turquoise/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Sparkles className="w-5 h-5 text-turquoise" />
                  ผลการประเมิน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Radar Chart */}
                  <div className="flex-shrink-0">
                    <AssessmentRadarChart 
                      preTestScores={preTestSkills}
                      postTestScores={postTestSkills}
                      size={350}
                    />
                  </div>

                  {/* Skill Bars */}
                  <div className="flex-1 w-full space-y-4">
                    {preTestSkills.map((skill) => {
                      const postSkill = postTestSkills.find(s => s.skill === skill.skill);
                      const improvement = postSkill ? postSkill.percentage - skill.percentage : null;
                      
                      return (
                        <div key={skill.skill} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground font-medium">{skill.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-turquoise">{skill.percentage}%</span>
                              {improvement !== null && improvement !== 0 && (
                                <span className={improvement > 0 ? 'text-green-500' : 'text-red-500'}>
                                  {improvement > 0 ? '+' : ''}{improvement}%
                                  {improvement > 30 && ' 🔥'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="relative h-2 bg-rackley/30 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.percentage}%` }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className="absolute h-full bg-turquoise rounded-full"
                            />
                            {postSkill && (
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${postSkill.percentage}%` }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="absolute h-full bg-gradient-to-r from-turquoise to-primary rounded-full opacity-50"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Comparison Summary */}
                    {postTestAttempt && preTestAttempt && (
                      <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-xl">
                        <p className="text-primary font-semibold text-center">
                          🏆 พัฒนาขึ้น {(postTestAttempt.percentage - preTestAttempt.percentage).toFixed(0)}% 
                          จาก Pre-test!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* View Full Results Button */}
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/assessment/results?compare=true')}
                    className="border-turquoise/30 text-turquoise hover:bg-turquoise/10"
                  >
                    ดูผลละเอียด
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

interface TestCardProps {
  type: 'pre_test' | 'post_test';
  title: string;
  subtitle: string;
  attempt: AssessmentAttempt | null;
  isLocked: boolean;
  lockReason?: string;
  onStart: () => void;
  onViewResults: () => void;
}

const TestCard: React.FC<TestCardProps> = ({
  title,
  subtitle,
  attempt,
  isLocked,
  lockReason,
  onStart,
  onViewResults,
}) => {
  const isCompleted = attempt?.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: isLocked ? 0 : -4 }}
      className={isLocked ? 'opacity-60' : ''}
    >
      <Card className={`bg-card border-${isCompleted ? 'green-500/30' : 'turquoise/30'} h-full`}>
        <CardContent className="p-6 flex flex-col h-full">
          {/* Icon & Status */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-turquoise/10 flex items-center justify-center">
              {isLocked ? (
                <Lock className="w-6 h-6 text-rackley" />
              ) : isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <ClipboardCheck className="w-6 h-6 text-turquoise" />
              )}
            </div>
            {isCompleted && (
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{attempt.percentage}%</p>
                <p className="text-xs text-rackley">{attempt.correct_answers}/{attempt.total_questions} ข้อ</p>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-1">📝 {title}</h3>
          <p className="text-rackley text-sm mb-4">{subtitle}</p>

          {/* Info */}
          <div className="flex items-center gap-4 text-sm text-rackley mb-4">
            <span>20 ข้อ</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~15 นาที
            </span>
          </div>

          {/* Status */}
          <div className="flex-1 flex flex-col justify-end">
            {isLocked ? (
              <div className="text-center py-4">
                <Lock className="w-6 h-6 text-rackley mx-auto mb-2" />
                <p className="text-sm text-rackley">{lockReason}</p>
              </div>
            ) : isCompleted ? (
              <div className="space-y-3">
                <p className="text-xs text-rackley">
                  ทำเมื่อ: {new Date(attempt.completed_at!).toLocaleDateString('th-TH')}
                </p>
                <Button
                  variant="outline"
                  className="w-full border-turquoise/30 text-turquoise hover:bg-turquoise/10"
                  onClick={onViewResults}
                >
                  ดูผล
                </Button>
              </div>
            ) : (
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={onStart}
              >
                เริ่มทำ {title}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssessmentHub;
