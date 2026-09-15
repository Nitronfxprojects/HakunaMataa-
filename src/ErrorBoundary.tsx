import React from 'react'

interface Props {
  children: React.ReactNode
}
interface State {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Logged for now; wire up to an error-tracking service (e.g. Sentry) when one is added.
    console.error('Unhandled UI error:', error, info)
  }

  handleReload = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '24px',
            backgroundColor: '#f5f0e8',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>🦁</div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(22px, 4vw, 30px)',
              color: '#1c2a1e',
              marginBottom: 10,
            }}
          >
            Something went off track
          </h1>
          <p style={{ color: '#6b5a45', fontSize: 14, maxWidth: 380, marginBottom: 24, lineHeight: 1.6 }}>
            We hit an unexpected error. Nothing on your end went wrong — try reloading the page,
            and if it keeps happening, reach out to our team.
          </p>
          <button
            onClick={this.handleReload}
            className="btn btn-primary"
          >
            Reload HakunaMatataWorld
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
