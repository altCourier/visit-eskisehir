import Navbar from './components/layout/Navbar';
import Hero from './components/Hero';

const App = () => {
    return (
        <>
            <Navbar />
            <Hero />

            <div style={{ padding: '4rem 2rem', minHeight: '100vh' }}>
                <h2>Hotels Section</h2>
                <p>This is where your hotels content will go...</p>

                <h2>About Section</h2>
                <p>This is where your about content will go...</p>

                <div style={{ height: '500px', background: '#f0f0f0', margin: '2rem 0' }}>
                    Placeholder content
                </div>

            </div>
        </>
    );
}

export default App;