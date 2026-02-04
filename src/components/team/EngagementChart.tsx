import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EngagementData } from './types';

interface EngagementChartProps {
  data: EngagementData[];
  timeRange: '7d' | '30d';
  onTimeRangeChange: (range: '7d' | '30d') => void;
}

const EngagementChart: React.FC<EngagementChartProps> = ({
  data,
  timeRange,
  onTimeRangeChange,
}) => {
  return (
    <Card className="bg-card/80 border-[#05F2F2]/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Engagement Over Time</CardTitle>
        <div className="flex gap-2">
          <button
            onClick={() => onTimeRangeChange('7d')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              timeRange === '7d'
                ? 'bg-[#05F2F2] text-[#012840]'
                : 'bg-muted/20 text-muted-foreground hover:bg-muted/40'
            }`}
          >
            7 วัน
          </button>
          <button
            onClick={() => onTimeRangeChange('30d')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              timeRange === '30d'
                ? 'bg-[#05F2F2] text-[#012840]'
                : 'bg-muted/20 text-muted-foreground hover:bg-muted/40'
            }`}
          >
            30 วัน
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActiveUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#05F2F2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#05F2F2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(101, 147, 166, 0.2)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6593A6', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(101, 147, 166, 0.3)' }}
              />
              <YAxis
                tick={{ fill: '#6593A6', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(101, 147, 166, 0.3)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(1, 40, 64, 0.95)',
                  border: '1px solid rgba(5, 242, 242, 0.3)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#05F2F2' }}
              />
              <Area
                type="monotone"
                dataKey="activeUsers"
                stroke="#05F2F2"
                strokeWidth={2}
                fill="url(#colorActiveUsers)"
                name="คนเข้าใช้"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementChart;
