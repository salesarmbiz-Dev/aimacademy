import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillAverage } from './types';

interface SkillRadarChartProps {
  data: SkillAverage[];
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ data }) => {
  return (
    <Card className="bg-card/80 border-[#05F2F2]/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Skill Distribution (ค่าเฉลี่ยทีม)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="rgba(101, 147, 166, 0.3)" />
              <PolarAngleAxis
                dataKey="skillLabel"
                tick={{ fill: '#6593A6', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: '#6593A6', fontSize: 10 }}
              />
              <Radar
                name="Pre-test"
                dataKey="preTest"
                stroke="#6593A6"
                fill="#6593A6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Post-test"
                dataKey="postTest"
                stroke="#05F2F2"
                fill="#05F2F2"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => (
                  <span style={{ color: '#fff', fontSize: '12px' }}>{value}</span>
                )}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillRadarChart;
