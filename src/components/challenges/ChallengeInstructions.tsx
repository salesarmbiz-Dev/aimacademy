import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Challenge, ChallengeMode } from './types';
import { MODE_COLORS } from './types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ChallengeInstructionsProps {
  challenge: Challenge;
}

const MODE_INSTRUCTIONS: Record<ChallengeMode, (challenge: Challenge) => string[]> = {
  minimize: (challenge) => [
    `Prompt เริ่มต้นมี ${challenge.startingBlocks.length} Blocks`,
    'ลบ Block ออกให้เหลือน้อยที่สุด',
    `ต้องรักษา Score ไว้ที่ ${challenge.targetScore}+`,
    challenge.targetBlocks ? `ยิ่งเหลือน้อยกว่า ${challenge.targetBlocks} Block ยิ่งได้คะแนนโบนัส` : '',
  ].filter(Boolean),
  maximize: (challenge) => [
    `Prompt เริ่มต้นมี ${challenge.startingBlocks.length} Blocks (Score ต่ำ)`,
    'เพิ่ม Block จาก Library',
    `ดัน Score ให้ถึง ${challenge.targetScore}+`,
    'ใช้ Block น้อยที่สุดจะได้โบนัส',
  ],
  fix: (challenge) => [
    `Prompt นี้มีปัญหา (Score ต่ำ)`,
    'หา Block ที่ผิดหรือขาดหาย',
    'แก้ไขหรือเพิ่ม Block ที่ถูกต้อง',
    `ทำให้ Score ถึง ${challenge.targetScore}+`,
  ],
  build: (challenge) => [
    `โจทย์: ${challenge.taskDescription}`,
    'เลือก Block จาก Library',
    `ประกอบให้ได้ Score ${challenge.targetScore}+`,
    challenge.requiredBlockTypes 
      ? `ต้องมี Block: ${challenge.requiredBlockTypes.join(', ')}`
      : '',
  ].filter(Boolean),
};

export const ChallengeInstructions: React.FC<ChallengeInstructionsProps> = ({ challenge }) => {
  const [isOpen, setIsOpen] = useState(true);
  const modeColor = MODE_COLORS[challenge.mode];
  const instructions = MODE_INSTRUCTIONS[challenge.mode](challenge);

  const borderColorClass = modeColor === 'turquoise' ? 'border-turquoise/30' : 'border-tennessee/30';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={cn('bg-oxford/50 border rounded-lg mx-6 my-4', borderColorClass)}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-rootbeer/30 transition-colors rounded-t-lg">
          <span className="text-white font-semibold flex items-center gap-2">
            📋 กติกา
          </span>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-rackley" />
          ) : (
            <ChevronDown className="h-5 w-5 text-rackley" />
          )}
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4">
            <ul className="space-y-2">
              {instructions.map((instruction, index) => (
                <li key={index} className="text-rackley text-sm flex items-start gap-2">
                  <span className="text-turquoise">•</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
