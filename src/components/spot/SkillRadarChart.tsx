import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { SpotSkills } from '@/contexts/SpotContext';

interface SkillRadarChartProps {
  skills: SpotSkills;
  size?: number;
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ skills, size = 250 }) => {
  const data = [
    { skill: 'Role', fullMark: 100, value: skills.roleDetection },
    { skill: 'Context', fullMark: 100, value: skills.contextClarity },
    { skill: 'Format', fullMark: 100, value: skills.formatMatching },
    { skill: 'Tone', fullMark: 100, value: skills.toneAlignment },
    { skill: 'Efficiency', fullMark: 100, value: skills.efficiency },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-oxford-blue border border-rackley/30 rounded-lg p-2 shadow-lg">
          <p className="text-turquoise font-semibold">{payload[0].payload.skill}</p>
          <p className="text-foreground text-sm">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid 
            stroke="#6593A630" 
            strokeDasharray="3 3"
          />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: '#ffffff', fontSize: 11 }}
            tickLine={false}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: '#6593A6', fontSize: 10 }}
            tickCount={5}
            axisLine={false}
          />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="#05F2F2"
            fill="#05F2F2"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadarChart;
