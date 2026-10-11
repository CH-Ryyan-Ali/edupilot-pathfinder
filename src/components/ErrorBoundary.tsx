import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch() {
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
          <div className="max-w-md w-full glass-card rounded-3xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-error-500/15 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-error-500" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white mb-3">Something went wrong</h1>
            <p className="text-dark-200 text-sm leading-relaxed mb-6">
              An unexpected error occurred. This can happen when data fails to load or a component encounters an issue. Try refreshing the page.
            </p>
            {this.state.error && (
              <div className="glass-light rounded-xl p-3 mb-6 text-left">
                <p className="text-xs text-dark-400 font-mono break-all">{this.state.error.message}</p>
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className="w-5 h-5" /> Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
