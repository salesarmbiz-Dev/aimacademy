import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';
import { AssetFiltersBar } from '@/components/assets/AssetFiltersBar';
import { AssetCard } from '@/components/assets/AssetCard';
import { AssetDetailPanel } from '@/components/assets/AssetDetailPanel';
import { EmptyAssets } from '@/components/assets/EmptyAssets';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserAsset } from '@/components/assets/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AssetLibrary: React.FC = () => {
  const {
    assets,
    allAssets,
    loading,
    filters,
    setFilters,
    categoryCounts,
    stats,
    deleteAsset,
    copyAsset,
    downloadAsset,
  } = useAssets();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedAsset, setSelectedAsset] = useState<UserAsset | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<UserAsset | null>(null);

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteAsset(deleteConfirm.id);
      setDeleteConfirm(null);
      if (selectedAsset?.id === deleteConfirm.id) {
        setSelectedAsset(null);
      }
    }
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `฿${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `฿${(value / 1000).toFixed(0)}K`;
    }
    return `฿${value}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Summary Banner */}
      <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-r from-foreground to-muted-foreground p-6 text-background">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-background/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">AI Asset Library</h1>
            <p className="text-sm opacity-80 mb-4">
              คลังความรู้และ deliverables ที่คุณสร้างจากการฝึก
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="opacity-60">📄 Assets ทั้งหมด:</span>
                <span className="font-bold ml-1">{stats.total} ชิ้น</span>
              </div>
              <div>
                <span className="opacity-60">💰 มูลค่ารวม:</span>
                <span className="font-bold ml-1">{formatValue(stats.estimatedValue)}</span>
              </div>
              <div>
                <span className="opacity-60">📈 เดือนนี้:</span>
                <span className="font-bold ml-1">+{stats.thisMonth} ชิ้น</span>
              </div>
            </div>

            <p className="text-xs opacity-60 mt-3">
              ยิ่งเล่นเกม ยิ่งมี assets มาก — คลังของคุณมีค่ามากขึ้นทุกวัน
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <AssetFiltersBar
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        categoryCounts={categoryCounts}
      />

      {/* Content */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : allAssets.length === 0 ? (
          <EmptyAssets />
        ) : assets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">ไม่พบ assets ที่ตรงกับการค้นหา</p>
          </div>
        ) : (
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
            )}
          >
            {assets.map((asset, index) => (
              <div
                key={asset.id}
                className="animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <AssetCard
                  asset={asset}
                  viewMode={viewMode}
                  onView={() => setSelectedAsset(asset)}
                  onCopy={() => copyAsset(asset)}
                  onDownload={() => downloadAsset(asset)}
                  onDelete={() => setDeleteConfirm(asset)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <AssetDetailPanel
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onCopy={() => selectedAsset && copyAsset(selectedAsset)}
        onDownload={() => selectedAsset && downloadAsset(selectedAsset)}
        onDelete={() => {
          if (selectedAsset) {
            setDeleteConfirm(selectedAsset);
          }
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจว่าจะลบ "{deleteConfirm?.title}" หรือไม่?
              การลบจะย้ายไปถังขยะ
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              ลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssetLibrary;
