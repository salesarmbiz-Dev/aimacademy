import React, { useState } from 'react';
import { Clock, Eye, RotateCcw, Lightbulb, Star, ArrowRight, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MOCK_EXPERIMENT_HISTORY, TYPE_COLORS, type ExperimentHistoryItem } from './types';

const ProfileHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'7d' | '30d' | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'experiments' | 'challenges'>('all');

  const filteredHistory = MOCK_EXPERIMENT_HISTORY.filter(item => {
    if (searchQuery && !item.promptName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (typeFilter === 'experiments' && item.type !== 'experiment') return false;
    if (typeFilter === 'challenges' && item.type !== 'challenge') return false;
    
    if (dateFilter !== 'all') {
      const itemDate = new Date(item.date);
      const now = new Date();
      const daysAgo = dateFilter === '7d' ? 7 : 30;
      const cutoff = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      if (itemDate < cutoff) return false;
    }
    
    return true;
  });

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'เมื่อสักครู่';
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-accent';
    if (score >= 70) return 'text-white';
    if (score >= 50) return 'text-primary';
    return 'text-destructive';
  };

  const getChangeColor = (action: string) => {
    switch (action) {
      case 'removed': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'added': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'modified': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-muted-foreground/20 text-muted-foreground';
    }
  };

  const HistoryItem = ({ item }: { item: ExperimentHistoryItem }) => {
    const scoreChange = item.modifiedScore - item.originalScore;

    return (
      <Card className="bg-secondary border-muted-foreground/30 hover:border-accent/50 transition-colors">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <Badge 
                className={`${
                  item.type === 'challenge' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-accent/20 text-accent'
                }`}
              >
                {item.type === 'challenge' 
                  ? `CHALLENGE: ${item.challengeMode?.toUpperCase()}`
                  : 'EXPERIMENT'}
              </Badge>
              <h4 className="font-semibold text-white">{item.promptName}</h4>
            </div>
            <span className="text-muted-foreground text-sm">{getRelativeTime(item.date)}</span>
          </div>

          {/* Score Display */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Original:</span>
              <span className={`font-bold ${getScoreColor(item.originalScore)}`}>
                {item.originalScore}/100
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Modified:</span>
              <span className={`font-bold ${getScoreColor(item.modifiedScore)}`}>
                {item.modifiedScore}/100
              </span>
            </div>
            <div className={`font-bold ${scoreChange >= 0 ? 'text-accent' : 'text-primary'}`}>
              {scoreChange >= 0 ? '+' : ''}{scoreChange} pts
            </div>
            
            {/* Stars for challenges */}
            {item.stars && (
              <div className="flex gap-0.5 ml-auto">
                {[...Array(3)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-4 h-4 ${i < item.stars! ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Changes */}
          <div className="mt-3 flex flex-wrap gap-2">
            {item.changes.map((change, i) => (
              <Badge 
                key={i}
                variant="outline"
                className={getChangeColor(change.action)}
              >
                {change.blockType} ({change.action === 'removed' ? 'ลบ' : change.action === 'added' ? 'เพิ่ม' : 'แก้ไข'})
              </Badge>
            ))}
          </div>

          {/* Insight */}
          {item.insight && (
            <div className="mt-3 flex items-start gap-2 text-muted-foreground text-sm italic">
              <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
              <span>"{item.insight}"</span>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-muted-foreground/20 flex items-center justify-between">
            <span className="text-primary font-semibold">+{item.xpEarned} XP</span>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-white"
              >
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-accent"
                onClick={() => navigate('/prompt-lego')}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Redo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (MOCK_EXPERIMENT_HISTORY.length === 0) {
    return (
      <div className="text-center py-16">
        <Clock className="w-16 h-16 text-muted-foreground mx-auto" />
        <h3 className="mt-4 text-xl text-white">ยังไม่มีประวัติการทดลอง</h3>
        <p className="mt-2 text-muted-foreground">ไปทดลอง Prompt แรกกันเลย!</p>
        <Button 
          onClick={() => navigate('/prompt-lego')}
          className="mt-4 bg-primary hover:bg-primary/90"
        >
          เริ่ม Experiment
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        🧪 Experiment History
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหา prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-muted-foreground/50 text-white"
          />
        </div>
        
        <div className="flex gap-2">
          {(['7d', '30d', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                dateFilter === f 
                  ? 'bg-accent text-secondary' 
                  : 'bg-secondary text-muted-foreground hover:text-white'
              }`}
            >
              {f === '7d' ? '7 วัน' : f === '30d' ? '30 วัน' : 'ทั้งหมด'}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(['all', 'experiments', 'challenges'] as const).map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                typeFilter === f 
                  ? 'bg-accent text-secondary' 
                  : 'bg-secondary text-muted-foreground hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f === 'experiments' ? 'Experiments' : 'Challenges'}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.map(item => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">ไม่พบรายการที่ค้นหา</p>
        </div>
      )}
    </div>
  );
};

export default ProfileHistory;
