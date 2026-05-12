import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, info) {
    console.error('Page crashed:', error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '48px', fontFamily: 'Jost, sans-serif' }}>
          <p style={{ fontFamily: 'Tenor Sans', letterSpacing: '0.2em', 
                      color: '#C9A84C', fontSize: '13px', marginBottom: '16px' }}>
            SOMETHING WENT WRONG
          </p>
          <p style={{ color: '#333', marginBottom: '24px' }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{ background: '#000', color: '#fff', padding: '10px 24px',
                     border: 'none', cursor: 'pointer', fontFamily: 'Tenor Sans',
                     letterSpacing: '0.15em', fontSize: '12px' }}>
            RETRY
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
