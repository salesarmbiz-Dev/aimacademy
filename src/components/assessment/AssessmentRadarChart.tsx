import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { SkillScore } from '@/hooks/useAssessment';

interface AssessmentRadarChartProps {
  preTestScores: SkillScore[];
  postTestScores?: SkillScore[];
  size?: number;
}

const AssessmentRadarChart: React.FC<AssessmentRadarChartProps> = ({ 
  preTestScores, 
  postTestScores,
  size = 350,
}) => {
  // Merge pre and post test scores
  const data = preTestScores.map(preSkill => {
    const postSkill = postTestScores?.find(s => s.skill === preSkill.skill);
    return {
      skill: preSkill.label,
      fullMark: 100,
      preTest: preSkill.percentage,
      postTest: postSkill?.percentage ?? null,
    };
  });

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string; payload?: { skill?: string } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-secondary border border-muted-foreground/30 rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-semibold mb-2">{payload[0]?.payload?.skill}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
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
          
          {/* Pre-test Radar */}
          <Radar
            name="Pre-test"
            dataKey="preTest"
            stroke="#05F2F2"
            fill="#05F2F2"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          
          {/* Post-test Radar (if available) */}
          {postTestScores && postTestScores.length > 0 && (
            <Radar
              name="Post-test"
              dataKey="postTest"
              stroke="#F27405"
              fill="#F27405"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          )}
          
          <Tooltip content={<CustomTooltip />} />
          
          {postTestScores && postTestScores.length > 0 && (
            <Legend 
              wrapperStyle={{ 
                paddingTop: 10,
                fontSize: 12,
              }}
              formatter={(value) => <span className="text-foreground">{value}</span>}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssessmentRadarChart;
