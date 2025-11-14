import { useState, useEffect } from 'react';
import Home from "./components/Home/Home.jsx";
import AboutPage from "./components/About/aboutPage.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import WeatherDetails from "./components/Weather/WeatherDetails.jsx";
import Hotels from "./components/Hotels/Hotels.jsx";

const App = () => {
    // Get initial page from URL hash (e.g., #about) or default to 'home'
    const [currentPage, setCurrentPage] = useState(
        window.location.hash.slice(1) || 'home'
    );

    // Listen for URL hash changes
    useEffect(() => {
        const handleHashChange = () => {
            setCurrentPage(window.location.hash.slice(1) || 'home');
        };

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    return (
        <div>

            <Navbar />
            {/* Render the appropriate page */}
            {currentPage === 'hotels' && <Hotels />}
            {currentPage === 'home' && <Home />}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'weather-details' && <WeatherDetails />}
        </div>
    );
}

export default App;