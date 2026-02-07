import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { BugDefinition } from '@/data/debuggerLevels';
import type { SelectedBug } from './types';

interface PromptDisplayProps {
  prompt: string;
  bugs: BugDefinition[];
  selectedBugs: SelectedBug[];
  onBugSelect: (bug: SelectedBug) => void;
  onBugDeselect: (bugId: string) => void;
  disabled?: boolean;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({
  prompt,
  bugs,
  selectedBugs,
  onBugSelect,
  onBugDeselect,
  disabled = false,
}) => {
  const [hoveredBugId, setHoveredBugId] = useState<string | null>(null);

  // Create segments from the prompt based on bug positions
  const createSegments = useCallback(() => {
    const segments: { text: string; bugId: string | null; startIndex: number; endIndex: number }[] = [];
    let currentIndex = 0;

    // Sort bugs by start index
    const sortedBugs = [...bugs].sort((a, b) => a.startIndex - b.startIndex);

    for (const bug of sortedBugs) {
      // Add text before this bug
      if (bug.startIndex > currentIndex) {
        segments.push({
          text: prompt.slice(currentIndex, bug.startIndex),
          bugId: null,
          startIndex: currentIndex,
          endIndex: bug.startIndex,
        });
      }

      // Add the buggy text
      segments.push({
        text: bug.buggyText,
        bugId: bug.id,
        startIndex: bug.startIndex,
        endIndex: bug.endIndex,
      });

      currentIndex = bug.startIndex + bug.buggyText.length;
    }

    // Add remaining text
    if (currentIndex < prompt.length) {
      segments.push({
        text: prompt.slice(currentIndex),
        bugId: null,
        startIndex: currentIndex,
        endIndex: prompt.length,
      });
    }

    return segments;
  }, [prompt, bugs]);

  const segments = createSegments();

  const handleSegmentClick = (segment: { bugId: string | null; text: string; startIndex: number; endIndex: number }) => {
    if (disabled) return;

    if (segment.bugId) {
      const existingSelection = selectedBugs.find(b => b.id === segment.bugId);
      
      if (existingSelection) {
        // Deselect
        onBugDeselect(segment.bugId);
      } else {
        // Select
        onBugSelect({
          id: segment.bugId,
          text: segment.text,
          startIndex: segment.startIndex,
          endIndex: segment.endIndex,
          identifiedType: null,
          isCorrect: null,
        });
      }
    }
  };

  return (
    <div className="bg-oxford/5 rounded-xl p-6">
      <p className="font-mono text-base leading-relaxed text-foreground">
        {segments.map((segment, index) => {
          const isSelected = selectedBugs.some(b => b.id === segment.bugId);
          const selectedBug = selectedBugs.find(b => b.id === segment.bugId);
          const isHovered = hoveredBugId === segment.bugId;
          const isBugSegment = segment.bugId !== null;
          const isCorrectlyIdentified = selectedBug?.isCorrect === true;

          return (
            <span
              key={index}
              onClick={() => handleSegmentClick(segment)}
              onMouseEnter={() => isBugSegment && setHoveredBugId(segment.bugId)}
              onMouseLeave={() => setHoveredBugId(null)}
              className={cn(
                'transition-all duration-200',
                isBugSegment && !disabled && 'cursor-pointer hover:bg-yellow-100 rounded',
                isBugSegment && isHovered && !isSelected && 'bg-yellow-50',
                isSelected && !isCorrectlyIdentified && 'bg-red-200 border-b-2 border-red-500 rounded',
                isCorrectlyIdentified && 'bg-green-200 border-b-2 border-green-500 rounded',
              )}
            >
              {segment.text}
            </span>
          );
        })}
      </p>
    </div>
  );
};
