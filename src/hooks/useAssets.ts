import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { UserAsset, AssetFilters, AssetCategory } from '@/components/assets/types';

export function useAssets() {
  const { user, isGuestMode } = useAuth();
  const [assets, setAssets] = useState<UserAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AssetFilters>({
    search: '',
    category: 'all',
    sortBy: 'latest',
  });

  const fetchAssets = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_assets')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our UserAsset type
      const transformedAssets: UserAsset[] = (data || []).map((item) => ({
        id: item.id,
        user_id: item.user_id,
        category: item.category as AssetCategory,
        title: item.title,
        description: item.description,
        content_json: item.content_json as Record<string, unknown>,
        source_game: item.source_game,
        quality_score: item.quality_score,
        tags: item.tags,
        status: item.status as 'active' | 'archived',
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      setAssets(transformedAssets);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลด assets ได้',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const filteredAssets = useMemo(() => {
    let result = [...assets];

    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter((a) => a.category === filters.category);
    }

    // Filter by search
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(searchLower) ||
          a.description?.toLowerCase().includes(searchLower) ||
          a.tags?.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'score':
        result.sort((a, b) => (b.quality_score || 0) - (a.quality_score || 0));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title, 'th'));
        break;
      case 'latest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [assets, filters]);

  const categoryCounts = useMemo(() => {
    const counts: Record<AssetCategory | 'all', number> = {
      all: assets.length,
      prompt: 0,
      sop: 0,
      pattern: 0,
      workflow: 0,
      template: 0,
    };

    assets.forEach((a) => {
      counts[a.category]++;
    });

    return counts;
  }, [assets]);

  const deleteAsset = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_assets')
        .update({ status: 'archived' })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      const deletedAsset = assets.find((a) => a.id === id);
      setAssets((prev) => prev.filter((a) => a.id !== id));

      toast({
        title: 'ลบเรียบร้อย',
        description: 'Asset ถูกย้ายไปถังขยะแล้ว',
      });
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถลบได้',
        variant: 'destructive',
      });
    }
  }, [user, assets]);

  const restoreAsset = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_assets')
        .update({ status: 'active' })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refetch to get the restored asset
      fetchAssets();

      toast({
        title: 'กู้คืนสำเร็จ',
        description: 'Asset ถูกกู้คืนแล้ว',
      });
    } catch (error) {
      console.error('Error restoring asset:', error);
    }
  }, [user, fetchAssets]);

  const copyAsset = useCallback((asset: UserAsset) => {
    let textToCopy = asset.title + '\n\n';

    if (asset.category === 'prompt') {
      const content = asset.content_json as Record<string, unknown>;
      textToCopy += (content.prompt_text as string) || (content.prompt as string) || JSON.stringify(content, null, 2);
    } else if (asset.category === 'sop') {
      const content = asset.content_json as Record<string, unknown>;
      textToCopy = (content.title as string) || asset.title;
      // Add simplified SOP content
      if (content.sections) {
        (content.sections as Array<{ title: string; content?: string }>).forEach((section) => {
          textToCopy += `\n\n${section.title}\n${section.content || ''}`;
        });
      }
    } else {
      textToCopy += JSON.stringify(asset.content_json, null, 2);
    }

    navigator.clipboard.writeText(textToCopy);
    toast({
      title: '📋 Copied!',
      description: 'คัดลอกไปยัง clipboard แล้ว',
    });
  }, []);

  const downloadAsset = useCallback((asset: UserAsset) => {
    const content = JSON.stringify(asset.content_json, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asset.title.replace(/[^a-zA-Z0-9ก-๙]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: '📥 Downloaded!',
      description: 'ดาวน์โหลดไฟล์แล้ว',
    });
  }, []);

  const stats = useMemo(() => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const thisMonthAssets = assets.filter(
      (a) => new Date(a.created_at) >= thisMonth
    ).length;

    // Estimate value: prompts = 10K, SOPs = 150K, patterns = 5K
    const estimatedValue = assets.reduce((sum, a) => {
      if (a.category === 'sop') return sum + 150000;
      if (a.category === 'prompt') return sum + 10000;
      if (a.category === 'pattern') return sum + 5000;
      return sum + 5000;
    }, 0);

    return {
      total: assets.length,
      thisMonth: thisMonthAssets,
      estimatedValue,
    };
  }, [assets]);

  return {
    assets: filteredAssets,
    allAssets: assets,
    loading,
    filters,
    setFilters,
    categoryCounts,
    stats,
    deleteAsset,
    copyAsset,
    downloadAsset,
    refetch: fetchAssets,
  };
}
