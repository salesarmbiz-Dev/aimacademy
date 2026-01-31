import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, FlaskConical, Trophy, Lightbulb, Award, TrendingUp, Inbox } from 'lucide-react';

interface Activity {
  type: 'experiment' | 'challenge' | 'insight' | 'badge' | 'levelup';
  time: string;
  text: string;
  xp: number | null;
}

const mockActivities: Activity[] = [
  { type: 'experiment', time: '2 นาทีที่แล้ว', text: 'ทดลอง Prompt: Email Follow-up', xp: 15 },
  { type: 'insight', time: '5 นาทีที่แล้ว', text: 'ค้นพบ: ROLE คือ Block ที่สำคัญที่สุด', xp: 30 },
  { type: 'challenge', time: '1 ชั่วโมงที่แล้ว', text: 'ผ่าน Minimize Challenge', xp: 100 },
  { type: 'badge', time: '1 ชั่วโมงที่แล้ว', text: 'ได้รับ Badge: First Build 🏆', xp: 50 },
  { type: 'experiment', time: '2 ชั่วโมงที่แล้ว', text: 'ทดลอง Prompt: Product Description', xp: 15 },
  { type: 'levelup', time: 'เมื่อวาน', text: 'เลื่อนขั้นเป็น Level 5!', xp: null },
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'experiment': return FlaskConical;
    case 'challenge': return Trophy;
    case 'insight': return Lightbulb;
    case 'badge': return Award;
    case 'levelup': return TrendingUp;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'experiment': return 'bg-turquoise';
    case 'challenge': return 'bg-tennessee';
    case 'insight': return 'bg-tennessee';
    case 'badge': return 'bg-yellow-500';
    case 'levelup': return 'bg-turquoise';
  }
};

interface RecentActivityProps {
  activities?: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities = mockActivities }) => {
  const isEmpty = activities.length === 0;

  return (
    <div className="bg-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-rackley" />
          <h2 className="text-foreground text-lg font-semibold">กิจกรรมล่าสุด</h2>
        </div>
        <Link to="#" className="text-turquoise text-sm hover:underline">
          ดูทั้งหมด
        </Link>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Inbox className="h-12 w-12 text-rackley mb-3" />
          <p className="text-rackley font-medium">ยังไม่มีกิจกรรม</p>
          <p className="text-rackley text-sm mt-1">เริ่ม Experiment แรกของคุณเลย!</p>
          <Link
            to="/prompt-lego"
            className="mt-4 px-4 py-2 bg-tennessee text-foreground rounded-lg font-medium hover:opacity-90"
          >
            เริ่มเลย
          </Link>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-rackley/30" />

          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const dotColor = getActivityColor(activity.type);

              return (
                <div
                  key={index}
                  className="flex gap-4 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Dot */}
                  <div className={`w-3 h-3 rounded-full ${dotColor} mt-1.5 z-10`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="h-4 w-4 text-rackley flex-shrink-0" />
                        <p className="text-foreground text-sm truncate">{activity.text}</p>
                      </div>
                      {activity.xp && (
                        <span className="text-tennessee text-xs bg-tennessee/20 px-2 py-0.5 rounded flex-shrink-0">
                          +{activity.xp} XP
                        </span>
                      )}
                    </div>
                    <p className="text-rackley text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
