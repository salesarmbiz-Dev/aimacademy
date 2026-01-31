import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ArrowRight, Eye, Puzzle } from 'lucide-react';

interface RecommendedNextProps {
  spotCompleted: number;
  legoCompleted: number;
}

const RecommendedNext: React.FC<RecommendedNextProps> = ({ spotCompleted, legoCompleted }) => {
  // Logic for recommendation
  let recommendation: {
    title: string;
    description: string;
    icon: React.ElementType;
    link: string;
    buttonText: string;
    color: 'turquoise' | 'tennessee';
  };

  if (spotCompleted === 0) {
    recommendation = {
      title: 'แนะนำ: เริ่มจาก Spot the Difference',
      description: 'ฝึกตาดู Prompt ก่อน แล้วค่อยลงมือสร้างเอง',
      icon: Eye,
      link: '/spot',
      buttonText: 'เริ่มเลย',
      color: 'turquoise',
    };
  } else if (spotCompleted >= 5 && legoCompleted === 0) {
    recommendation = {
      title: 'พร้อมลอง Prompt Lego แล้ว! 🎉',
      description: 'คุณผ่าน Spot the Difference มาหลายข้อแล้ว ลองสร้าง Prompt เองได้เลย',
      icon: Puzzle,
      link: '/prompt-lego',
      buttonText: 'ลองเลย',
      color: 'tennessee',
    };
  } else if (spotCompleted > 0 && spotCompleted < 10) {
    recommendation = {
      title: 'ทำ Spot the Difference ต่อ',
      description: `อีก ${10 - spotCompleted} ข้อ จะปลดล็อค Insight ใหม่!`,
      icon: Eye,
      link: '/spot',
      buttonText: 'เล่นต่อ',
      color: 'turquoise',
    };
  } else {
    recommendation = {
      title: 'สลับเล่นทั้งสองเกม',
      description: 'ฝึก Spot the Difference + Prompt Lego สลับกัน เพื่อพัฒนาทักษะรอบด้าน',
      icon: Lightbulb,
      link: '/spot',
      buttonText: 'ไปเลย',
      color: 'turquoise',
    };
  }

  const Icon = recommendation.icon;
  const colorClasses = recommendation.color === 'turquoise' 
    ? 'border-turquoise/30 bg-turquoise/5 hover:border-turquoise'
    : 'border-tennessee/30 bg-tennessee/5 hover:border-tennessee';
  const iconBg = recommendation.color === 'turquoise' ? 'bg-turquoise/20' : 'bg-tennessee/20';
  const iconColor = recommendation.color === 'turquoise' ? 'text-turquoise' : 'text-tennessee';
  const buttonColor = recommendation.color === 'turquoise'
    ? 'bg-turquoise text-oxford-blue hover:bg-turquoise/90'
    : 'bg-tennessee text-foreground hover:bg-tennessee/90';

  return (
    <div className={`mb-8 p-4 rounded-xl border ${colorClasses} transition-colors animate-fade-in`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <p className="font-semibold text-foreground">{recommendation.title}</p>
            <p className="text-sm text-rackley">{recommendation.description}</p>
          </div>
        </div>
        <Link 
          to={recommendation.link}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${buttonColor} transition-all`}
        >
          {recommendation.buttonText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default RecommendedNext;
