import { Component, ReactNode } from 'react';

type State = {
  error: Error | null;
};

type Props = {
  children: ReactNode;
  renderFallback: (args: { error: Error; reset: () => void }) => ReactNode;
  resetKeys?: unknown[];
  onReset?: () => void;
};

const initialState: State = { error: null };

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  resetErrorBoundary = () => {
    console.log('resest');
    this.setState(initialState);
    this.props.onReset && this.props.onReset();
  };

  componentDidUpdate(prevProps: Props) {
    if (this.state.error === null) {
      return;
    }
    if (JSON.stringify(prevProps.resetKeys) !== JSON.stringify(this.props.resetKeys)) {
      this.resetErrorBoundary();
    }
  }

  render() {
    const { children, renderFallback } = this.props;
    const { error } = this.state;

    if (error !== null) {
      return renderFallback({
        error,
        reset: this.resetErrorBoundary
      });
    }

    return children;
  }
}

export default ErrorBoundary;
