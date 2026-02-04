import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Clock, 
  Target, 
  ArrowRight,
  Lightbulb,
  Share2,
  RotateCcw,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAssessment } from '@/hooks/useAssessment';
import AssessmentRadarChart from './AssessmentRadarChart';
import confetti from 'canvas-confetti';

const AssessmentResults: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testType = searchParams.get('type') as 'pre_test' | 'post_test' | null;
  const showComparison = searchParams.get('compare') === 'true';

  const { 
    preTestAttempt, 
    postTestAttempt, 
    getSkillScores,
    SKILL_LABELS,
  } = useAssessment();

  // Determine which attempt to show
  const currentAttempt = testType === 'post_test' ? postTestAttempt : preTestAttempt;
  const preTestScores = getSkillScores(preTestAttempt);
  const postTestScores = getSkillScores(postTestAttempt);

  // Trigger confetti for good scores
  React.useEffect(() => {
    if (currentAttempt && currentAttempt.percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#05F2F2', '#F27405', '#22C55E'],
      });
    }
  }, [currentAttempt]);

  if (!currentAttempt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground mb-4">ไม่พบข้อมูลผลการประเมิน</p>
          <Button onClick={() => navigate('/assessment')}>
            กลับไปหน้าประเมินทักษะ
          </Button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} นาที ${secs} วินาที`;
  };

  // Find weakest skills for recommendations
  const currentScores = testType === 'post_test' ? postTestScores : preTestScores;
  const weakestSkills = [...currentScores]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 2);

  // Calculate improvement if comparing
  const improvement = postTestAttempt && preTestAttempt
    ? postTestAttempt.percentage - preTestAttempt.percentage
    : 0;

  const displayScores = showComparison || testType === 'post_test' 
    ? { pre: preTestScores, post: postTestScores }
    : { pre: preTestScores, post: [] };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              ผลการประเมิน {testType === 'post_test' ? 'Post-test' : 'Pre-test'}
            </h1>
          </div>
        </motion.div>

        {/* Score Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card border-turquoise/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Main Score */}
                <div className="text-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#6593A630"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${currentAttempt.percentage * 2.83} 283`}
                        transform="rotate(-90 50 50)"
                        initial={{ strokeDasharray: '0 283' }}
                        animate={{ strokeDasharray: `${currentAttempt.percentage * 2.83} 283` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#05F2F2" />
                          <stop offset="100%" stopColor="#F27405" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">
                        {currentAttempt.percentage}%
                      </span>
                    </div>
                  </div>
                  <p className="text-rackley mt-2">
                    {currentAttempt.correct_answers}/{currentAttempt.total_questions} ข้อ
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="bg-background rounded-xl p-4 text-center">
                    <Clock className="w-6 h-6 text-turquoise mx-auto mb-2" />
                    <p className="text-foreground font-semibold">
                      {formatTime(currentAttempt.time_spent_seconds)}
                    </p>
                    <p className="text-rackley text-sm">เวลาที่ใช้</p>
                  </div>
                  <div className="bg-background rounded-xl p-4 text-center">
                    <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-foreground font-semibold">
                      {currentAttempt.total_score} คะแนน
                    </p>
                    <p className="text-rackley text-sm">จาก {currentAttempt.max_score}</p>
                  </div>
                </div>

                {/* Improvement (if comparing) */}
                {showComparison && postTestAttempt && (
                  <div className={`text-center p-4 rounded-xl ${
                    improvement > 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}>
                    <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${
                      improvement > 0 ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <p className={`text-2xl font-bold ${
                      improvement > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {improvement > 0 ? '+' : ''}{improvement.toFixed(0)}%
                    </p>
                    <p className="text-rackley text-sm">พัฒนาการ</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar Chart & Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card border-turquoise/30">
            <CardHeader>
              <CardTitle className="text-foreground">ทักษะ 6 ด้าน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Radar Chart */}
                <div className="flex-shrink-0">
                  <AssessmentRadarChart 
                    preTestScores={displayScores.pre}
                    postTestScores={displayScores.post.length > 0 ? displayScores.post : undefined}
                    size={350}
                  />
                </div>

                {/* Skill Breakdown */}
                <div className="flex-1 w-full space-y-4">
                  {currentScores.map((skill, index) => {
                    const postSkill = postTestScores.find(s => s.skill === skill.skill);
                    const skillImprovement = postSkill && showComparison
                      ? postSkill.percentage - skill.percentage
                      : null;

                    return (
                      <motion.div
                        key={skill.skill}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-foreground font-medium">
                            {skill.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-turquoise font-semibold">
                              {skill.percentage}%
                            </span>
                            {skillImprovement !== null && (
                              <span className={`text-sm flex items-center ${
                                skillImprovement > 0 
                                  ? 'text-green-500' 
                                  : skillImprovement < 0 
                                    ? 'text-red-500' 
                                    : 'text-rackley'
                              }`}>
                                {skillImprovement > 0 && '⬆️'}
                                {skillImprovement < 0 && '⬇️'}
                                {skillImprovement === 0 && '━'}
                                {skillImprovement !== 0 && ` ${Math.abs(skillImprovement)}%`}
                                {skillImprovement > 30 && <Flame className="w-4 h-4 ml-1" />}
                              </span>
                            )}
                          </div>
                        </div>
                        <Progress 
                          value={skill.percentage} 
                          className="h-2 bg-rackley/30"
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-primary/10 border-primary/30">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                คำแนะนำ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weakestSkills.map((skill) => (
                <div key={skill.skill} className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <p className="text-rackley">
                    คุณควรฝึก <span className="text-foreground font-medium">{skill.label}</span> เพิ่ม 
                    ({skill.percentage}%)
                    {skill.skill === 'error_detection' && (
                      <> — ลองเล่น <span className="text-turquoise">Spot the Difference</span></>
                    )}
                    {skill.skill === 'prompt_structure' && (
                      <> — ลองเล่น <span className="text-turquoise">Prompt Lego</span></>
                    )}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/assessment')}
            className="border-turquoise/30 text-turquoise hover:bg-turquoise/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            กลับหน้าประเมิน
          </Button>
          
          <Button
            onClick={() => navigate('/spot')}
            className="bg-primary hover:bg-primary/90"
          >
            ไปฝึกต่อ
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Button
            variant="outline"
            className="border-turquoise/30 text-turquoise hover:bg-turquoise/10"
            onClick={() => {
              navigator.share?.({
                title: 'ผลการประเมิน AI Prompting',
                text: `ฉันได้ ${currentAttempt.percentage}% ในการประเมินทักษะ AI Prompting!`,
                url: window.location.href,
              });
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            แชร์ผล
          </Button>
        </motion.div>

        {/* Comparison Table (if comparing) */}
        {showComparison && preTestAttempt && postTestAttempt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card border-turquoise/30">
              <CardHeader>
                <CardTitle className="text-foreground">📊 เปรียบเทียบ Pre vs Post</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-rackley/30">
                        <th className="text-left py-3 px-4 text-foreground">ทักษะ</th>
                        <th className="text-center py-3 px-4 text-turquoise">Pre</th>
                        <th className="text-center py-3 px-4 text-primary">Post</th>
                        <th className="text-center py-3 px-4 text-foreground">เปลี่ยนแปลง</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preTestScores.map((pre) => {
                        const post = postTestScores.find(s => s.skill === pre.skill);
                        const change = post ? post.percentage - pre.percentage : 0;
                        return (
                          <tr key={pre.skill} className="border-b border-rackley/20">
                            <td className="py-3 px-4 text-foreground">{pre.label}</td>
                            <td className="py-3 px-4 text-center text-turquoise">{pre.percentage}%</td>
                            <td className="py-3 px-4 text-center text-primary">{post?.percentage ?? '-'}%</td>
                            <td className={`py-3 px-4 text-center font-semibold ${
                              change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-rackley'
                            }`}>
                              {change > 0 ? '+' : ''}{change}%
                              {change > 30 && ' 🔥'}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-primary/10">
                        <td className="py-3 px-4 text-foreground font-bold">รวม</td>
                        <td className="py-3 px-4 text-center text-turquoise font-bold">
                          {preTestAttempt.percentage}%
                        </td>
                        <td className="py-3 px-4 text-center text-primary font-bold">
                          {postTestAttempt.percentage}%
                        </td>
                        <td className={`py-3 px-4 text-center font-bold ${
                          improvement > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {improvement > 0 ? '+' : ''}{improvement.toFixed(0)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Best Improvement Highlight */}
                {(() => {
                  const bestImprovement = preTestScores
                    .map(pre => {
                      const post = postTestScores.find(s => s.skill === pre.skill);
                      return {
                        skill: pre.label,
                        change: post ? post.percentage - pre.percentage : 0,
                      };
                    })
                    .sort((a, b) => b.change - a.change)[0];

                  if (bestImprovement && bestImprovement.change > 0) {
                    return (
                      <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                        <p className="text-green-500 font-semibold">
                          🏆 ทักษะที่พัฒนามากที่สุด: {bestImprovement.skill} (+{bestImprovement.change}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AssessmentResults;
