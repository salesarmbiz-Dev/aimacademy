import React, { useState } from 'react';

interface DayData {
  day: string;
  xp: number;
  experiments: number;
}

const mockData: DayData[] = [
  { day: 'จ', xp: 45, experiments: 3 },
  { day: 'อ', xp: 120, experiments: 8 },
  { day: 'พ', xp: 30, experiments: 2 },
  { day: 'พฤ', xp: 200, experiments: 12 },
  { day: 'ศ', xp: 85, experiments: 5 },
  { day: 'ส', xp: 150, experiments: 10 },
  { day: 'อา', xp: 60, experiments: 4 },
];

const ProgressChart: React.FC = () => {
  const [metric, setMetric] = useState<'xp' | 'experiments'>('xp');

  const maxValue = Math.max(...mockData.map((d) => (metric === 'xp' ? d.xp : d.experiments)));
  const totalXp = mockData.reduce((sum, d) => sum + d.xp, 0);
  const avgXp = Math.round(totalXp / mockData.length);

  return (
    <div className="bg-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-foreground text-lg font-semibold">ความก้าวหน้า 7 วันล่าสุด</h2>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as 'xp' | 'experiments')}
          className="bg-root-beer text-rackley text-sm px-3 py-1 rounded-lg border border-rackley/30 focus:outline-none focus:ring-1 focus:ring-turquoise"
        >
          <option value="xp">XP</option>
          <option value="experiments">Experiments</option>
        </select>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-48 mb-4">
        {mockData.map((day, index) => {
          const value = metric === 'xp' ? day.xp : day.experiments;
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const isToday = index === mockData.length - 1;

          return (
            <div key={day.day} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-40">
                <span className="text-rackley text-xs mb-1">{value}</span>
                <div
                  className={`w-full max-w-8 rounded-t-md transition-all duration-1000 ease-out ${
                    isToday
                      ? 'bg-gradient-to-t from-turquoise to-tennessee shadow-lg shadow-turquoise/30'
                      : 'bg-gradient-to-t from-turquoise/70 to-turquoise'
                  }`}
                  style={{
                    height: `${height}%`,
                    minHeight: value > 0 ? '8px' : '0',
                  }}
                />
              </div>
              <span className={`text-xs mt-2 ${isToday ? 'text-turquoise font-semibold' : 'text-rackley'}`}>
                {day.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="pt-4 border-t border-rackley/20">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-foreground font-semibold">รวมสัปดาห์นี้: {totalXp} XP</span>
            <span className="text-rackley text-sm ml-3">เฉลี่ย: {avgXp} XP/วัน</span>
          </div>
          <span className="text-turquoise text-sm">📈 +23% จากสัปดาห์ก่อน</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
