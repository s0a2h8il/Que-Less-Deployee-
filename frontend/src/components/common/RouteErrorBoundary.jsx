import React from "react";

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Could log to analytics here
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      return (
        fallback || (
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm text-gray-600">Please try refreshing.</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default RouteErrorBoundary;
