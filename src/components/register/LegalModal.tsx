import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TermsContent } from './TermsContent';
import { PrivacyContent } from './PrivacyContent';

interface LegalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'terms' | 'privacy';
}

export const LegalModal: React.FC<LegalModalProps> = ({ open, onOpenChange, type }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] max-h-[80vh] p-0 bg-oxford/95 backdrop-blur-xl border-rackley/30 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 -ml-2 rounded-lg hover:bg-rackley/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-rackley" />
            </button>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                {type === 'terms' ? 'ข้อกำหนดการใช้งาน' : 'นโยบายความเป็นส่วนตัว'}
              </DialogTitle>
              <p className="text-sm text-rackley mt-1">
                AIM Academy - {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
              </p>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="h-[60vh] px-6 pb-6">
          <div className="prose prose-invert prose-sm max-w-none">
            {type === 'terms' ? <TermsContent /> : <PrivacyContent />}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
