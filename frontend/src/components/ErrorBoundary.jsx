import { Component } from 'react';

// Kutilmagan JS xatolikda butunlay qora/oq ekran o'rniga tushunarli xabar ko'rsatamiz.
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error('App error:', error, info);
    }

    render() {
        const { error } = this.state;

        if (error) {
            return (
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        padding: '2rem',
                        textAlign: 'center',
                        background: '#0B1020',
                        color: '#E5E7EB',
                        fontFamily: 'system-ui, sans-serif'
                    }}
                >
                    <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Kutilmagan xatolik yuz berdi</h1>
                    <p style={{ margin: 0, color: '#9CA3AF' }}>
                        Sahifani qayta yuklab ko'ring. Muammo takrorlansa, quyidagi matnni yuboring.
                    </p>
                    <pre
                        style={{
                            maxWidth: '100%',
                            overflow: 'auto',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.75rem',
                            background: '#111827',
                            color: '#F87171',
                            fontSize: '0.8125rem'
                        }}
                    >
                        {String(error?.message || error)}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '9999px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            color: '#fff',
                            background: 'linear-gradient(135deg, #00D4FF, #0066FF)'
                        }}
                    >
                        Qayta yuklash
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
