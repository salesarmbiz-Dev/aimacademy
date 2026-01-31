import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, User, ListTodo, Target, MessageCircle, Layout } from 'lucide-react';

interface Insight {
  type: 'ROLE' | 'TASK' | 'TARGET' | 'TONE' | 'FORMAT';
  text: string;
}

const mockInsights: Insight[] = [
  { type: 'ROLE', text: 'ROLE คือ Block ที่สำคัญที่สุด ลบแล้วเสีย -34 points' },
  { type: 'TONE', text: 'เปลี่ยน TONE = น้ำเสียง Output เปลี่ยนทั้งหมด' },
  { type: 'FORMAT', text: 'FORMAT เป็น optional แต่ช่วยควบคุม output ได้ดี' },
];

const getTypeIcon = (type: Insight['type']) => {
  switch (type) {
    case 'ROLE': return User;
    case 'TASK': return ListTodo;
    case 'TARGET': return Target;
    case 'TONE': return MessageCircle;
    case 'FORMAT': return Layout;
  }
};

interface InsightsPreviewProps {
  insights?: Insight[];
  count?: number;
}

const InsightsPreview: React.FC<InsightsPreviewProps> = ({ 
  insights = mockInsights, 
  count = 12 
}) => {
  return (
    <div className="bg-card rounded-2xl p-6 mt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground text-lg font-semibold">💡 Insights ที่ค้นพบ</h2>
        <span className="text-turquoise text-xs bg-turquoise/20 px-2 py-1 rounded-full">
          {count} insights
        </span>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = getTypeIcon(insight.type);
          
          return (
            <div
              key={index}
              className="bg-root-beer border-l-4 border-turquoise p-4 rounded-r-lg animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-4 w-4 text-turquoise mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm">{insight.text}</p>
                  <span className="inline-block text-turquoise text-xs bg-turquoise/20 px-2 py-0.5 rounded mt-2">
                    {insight.type}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link
        to="#"
        className="flex items-center justify-center gap-1 text-turquoise text-sm mt-4 hover:underline"
      >
        ดู Insights ทั้งหมด
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default InsightsPreview;
