import React from 'react';
import FlowEditorWrapper from './components/FlowEditor';
import { LandingPage } from './components/LandingPage';

function App() {
    const [page, setPage] = React.useState<'landing' | 'editor'>('landing');

    return (
        <>
            {page === 'landing' ? (
                <LandingPage onEnter={() => setPage('editor')} />
            ) : (
                <FlowEditorWrapper />
            )}
        </>
    );
}

export default App;
