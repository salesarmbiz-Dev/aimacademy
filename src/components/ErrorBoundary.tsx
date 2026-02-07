import React, { Component, ErrorInfo, ReactNode } from 'react';
import { GraduationCap, Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-8 shadow-2xl max-w-md mx-auto text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <GraduationCap className="w-10 h-10 text-tennessee" />
              <Sparkles className="w-5 h-5 text-tennessee" />
              <span className="text-xl font-bold text-foreground">AIM Academy</span>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาดขึ้น
            </h1>
            <p className="text-muted-foreground mb-8">
              ระบบเกิดปัญหาชั่วคราว กรุณาลองใหม่อีกครั้ง
            </p>

            {/* Reload Button */}
            <button
              onClick={this.handleReload}
              className="btn-primary gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              ลองใหม่
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
