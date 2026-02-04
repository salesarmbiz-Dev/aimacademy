import React, { useState } from 'react';
import { Search, Download, ChevronUp, ChevronDown, AlertTriangle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

interface MemberData {
  id: string;
  display_name: string;
  level: number;
  pre_test_score: number | null;
  post_test_score: number | null;
  score_change: number | null;
  last_active: string | null;
}

interface MembersTableProps {
  members: MemberData[];
  onExportCSV: () => void;
  onExportPDF: () => void;
}

type SortKey = 'display_name' | 'level' | 'pre_test_score' | 'post_test_score' | 'score_change' | 'last_active';
type SortOrder = 'asc' | 'desc';

const MembersTable: React.FC<MembersTableProps> = ({ members, onExportCSV, onExportPDF }) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('level');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const getLastActiveStatus = (lastActive: string | null) => {
    if (!lastActive) return { text: 'ไม่เคย', status: 'danger' };
    
    const date = new Date(lastActive);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { text: 'วันนี้', status: 'good' };
    if (diffDays === 1) return { text: 'เมื่อวาน', status: 'good' };
    if (diffDays <= 7) return { text: `${diffDays} วัน`, status: 'warning' };
    return { text: `${diffDays} วัน`, status: 'danger' };
  };

  const filteredMembers = members.filter(m =>
    m.display_name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    let aVal: any = a[sortKey];
    let bVal: any = b[sortKey];
    
    if (sortKey === 'last_active') {
      aVal = aVal ? new Date(aVal).getTime() : 0;
      bVal = bVal ? new Date(bVal).getTime() : 0;
    }
    
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const paginatedMembers = sortedMembers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const totalPages = Math.ceil(sortedMembers.length / perPage);

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  return (
    <Card className="bg-card/80 border-[#05F2F2]/20">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <CardTitle className="text-lg font-semibold">สมาชิกในทีม</CardTitle>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาสมาชิก..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 border-muted w-full sm:w-[200px]"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCSV}
              className="border-muted text-muted-foreground hover:text-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPDF}
              className="border-muted text-muted-foreground hover:text-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-muted/20">
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">#</th>
              <th 
                className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('display_name')}
              >
                ชื่อ <SortIcon columnKey="display_name" />
              </th>
              <th 
                className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('level')}
              >
                Level <SortIcon columnKey="level" />
              </th>
              <th 
                className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('pre_test_score')}
              >
                Pre Test <SortIcon columnKey="pre_test_score" />
              </th>
              <th 
                className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('post_test_score')}
              >
                Post Test <SortIcon columnKey="post_test_score" />
              </th>
              <th 
                className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('score_change')}
              >
                เปลี่ยนแปลง <SortIcon columnKey="score_change" />
              </th>
              <th 
                className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('last_active')}
              >
                เข้าใช้ล่าสุด <SortIcon columnKey="last_active" />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedMembers.map((member, index) => {
              const activeStatus = getLastActiveStatus(member.last_active);
              return (
                <tr 
                  key={member.id}
                  className="border-b border-muted/10 hover:bg-[#05F2F2]/5 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {(currentPage - 1) * perPage + index + 1}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">
                    {member.display_name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm text-[#05F2F2] font-semibold">
                      Lv.{member.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm">
                    {member.pre_test_score !== null ? (
                      <span className="text-foreground">{member.pre_test_score}%</span>
                    ) : (
                      <span className="text-muted-foreground">ยังไม่ทำ</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-sm">
                    {member.post_test_score !== null ? (
                      <span className="text-foreground">{member.post_test_score}%</span>
                    ) : (
                      <span className="text-muted-foreground">ยังไม่ทำ</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-sm">
                    {member.score_change !== null ? (
                      <span className={`font-medium ${member.score_change > 0 ? 'text-[#22C55E]' : member.score_change < 0 ? 'text-[#EF4444]' : 'text-muted-foreground'}`}>
                        {member.score_change > 0 ? '+' : ''}{member.score_change}% 
                        {member.score_change > 0 && ' ⬆️'}
                        {member.score_change > 30 && ' 🔥'}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-sm">
                    <span className={`flex items-center justify-center gap-1 ${
                      activeStatus.status === 'good' ? 'text-foreground' : 
                      activeStatus.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {activeStatus.text}
                      {activeStatus.status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                      {activeStatus.status === 'danger' && <AlertCircle className="w-3 h-3" />}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-muted/20">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                  currentPage === page
                    ? 'bg-[#05F2F2] text-[#012840] font-semibold'
                    : 'text-muted-foreground hover:bg-muted/20'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MembersTable;
