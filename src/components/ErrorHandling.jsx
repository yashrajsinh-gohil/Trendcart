import React from "react";

class ErrorHandling extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(_error, _errorInfo) {
    // You can log error info here if needed
  }

  render() {
    if (this.state.error) {
      return (
        <div className="alert alert-danger m-4 p-4 rounded-3 shadow">
          <h4>Something went wrong.</h4>
          <pre className="text-danger small">{this.state.error.message}</pre>
          <button className="btn btn-primary mt-2" onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorHandling;
