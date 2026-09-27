import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: unknown;
  hasError: boolean;
}

/**
 * Shows a minimal fallback with a reload button when TaskManager throws while rendering.
 * Hooks cannot run inside try/catch, so render errors are caught here instead.
 */
export class TaskManagerErrorBoundary extends Component<Props, State> {
  state: State = { error: null, hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { error, hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('TaskManager error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Error in TaskManager</h2>
          <p>Error: {error instanceof Error ? error.message : String(error)}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}
