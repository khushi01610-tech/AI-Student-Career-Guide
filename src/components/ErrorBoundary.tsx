import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl border border-border/80 bg-card shadow-lg">
            <div className="h-14 w-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Something unexpected happened
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We encountered an error loading this view. You can reload the page or return to the home screen.
            </p>
            {this.state.error?.message && (
              <div className="p-3 rounded-lg bg-muted/60 text-[11px] font-mono text-left text-muted-foreground overflow-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button onClick={this.handleReload} size="sm" className="gap-2">
                <RefreshCw className="h-3.5 w-3.5" /> Reload Page
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" size="sm" className="gap-2">
                <Home className="h-3.5 w-3.5" /> Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
