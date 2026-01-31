import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Flame, Lightbulb, ArrowRight, Home } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { SpotChallengeData } from '@/data/spotChallenges';

interface SpotResultModalProps {
  isOpen: boolean;
  challenge: SpotChallengeData;
  selectedAnswer: 'A' | 'B';
  result: { correct: boolean; xpEarned: number };
  streak: number;
  usedHint: boolean;
  onNext: () => void;
  onClose: () => void;
}

const SpotResultModal: React.FC<SpotResultModalProps> = ({
  isOpen,
  challenge,
  selectedAnswer,
  result,
  streak,
  usedHint,
  onNext,
  onClose,
}) => {
  const navigate = useNavigate();
  const { correct, xpEarned } = result;
  const correctAnswer = challenge.correctAnswer;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-rackley/50 rounded-2xl p-0 max-w-xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`p-6 text-center ${correct ? 'bg-turquoise/10' : 'bg-tennessee/10'}`}>
          {correct ? (
            <>
              <CheckCircle className="w-16 h-16 text-turquoise mx-auto mb-3 animate-scale-in" />
              <h2 className="text-2xl font-bold text-turquoise">✅ ถูกต้อง!</h2>
              <p className="text-tennessee font-bold text-xl mt-2">+{xpEarned} XP</p>
              {streak >= 3 && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Flame className="w-4 h-4 text-tennessee" />
                  <span className="text-tennessee text-sm">x{streak} streak bonus!</span>
                </div>
              )}
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-tennessee mx-auto mb-3 animate-shake" />
              <h2 className="text-2xl font-bold text-tennessee">❌ ไม่ถูกต้อง</h2>
              <p className="text-rackley mt-2">Streak reset: 0</p>
            </>
          )}
        </div>

        {/* Explanation */}
        <div className="p-6 border-t border-rackley/20">
          <h3 className="font-semibold text-foreground mb-4">
            ทำไม {correctAnswer} ถึงดีกว่า?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Wrong points */}
            <div className="bg-tennessee/10 rounded-lg p-4">
              <p className="text-tennessee font-semibold text-sm mb-2">❌ {correctAnswer === 'B' ? 'A' : 'B'} ขาด:</p>
              <ul className="space-y-1">
                {challenge.explanation.whyWrong.map((point, i) => (
                  <li key={i} className="text-rackley text-sm flex items-start gap-2">
                    <span>•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Correct points */}
            <div className="bg-turquoise/10 rounded-lg p-4">
              <p className="text-turquoise font-semibold text-sm mb-2">✅ {correctAnswer} มี:</p>
              <ul className="space-y-1">
                {challenge.explanation.whyCorrect.map((point, i) => (
                  <li key={i} className="text-rackley text-sm flex items-start gap-2">
                    <span>•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Metrics */}
          <div className="mb-6">
            <p className="text-rackley text-sm mb-3">📊 ผลต่าง:</p>
            {Object.entries(challenge.explanation.metrics).map(([key, values]) => (
              <div key={key} className="flex items-center gap-3 mb-2">
                <span className="text-rackley text-xs w-20 capitalize">{key}:</span>
                <span className="text-rackley text-xs w-8">{values.a}%</span>
                <div className="flex-1 h-2 bg-oxford-blue rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rackley to-turquoise rounded-full"
                    style={{ width: `${values.b}%` }}
                  />
                </div>
                <span className="text-turquoise text-xs w-8">{values.b}%</span>
                <Badge className="bg-turquoise/20 text-turquoise border-0 text-xs">
                  +{values.b - values.a}%
                </Badge>
              </div>
            ))}
          </div>

          {/* Pattern Learned */}
          {correct && challenge.patternLearned && (
            <div className="bg-gradient-to-r from-turquoise/10 to-tennessee/10 border border-turquoise/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-tennessee" />
                <span className="font-semibold text-foreground">💡 PATTERN LEARNED</span>
                <Badge className="bg-tennessee text-foreground border-0 text-xs ml-auto">+30 XP</Badge>
              </div>
              <p className="text-foreground italic">"{challenge.patternLearned}"</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-rackley/20 flex gap-3">
          <Button
            className="flex-1 bg-turquoise text-oxford-blue hover:bg-turquoise/90"
            onClick={onNext}
          >
            ข้อถัดไป
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            className="border-rackley text-rackley hover:bg-rackley/10"
            onClick={() => navigate('/spot')}
          >
            <Home className="w-4 h-4 mr-2" />
            กลับหน้าหลัก
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpotResultModal;
