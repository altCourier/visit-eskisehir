import { useState, useEffect } from 'react';
import Home from "./components/Home/Home.jsx";
import AboutPage from "./components/About/aboutPage.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import WeatherDetails from "./components/Weather/WeatherDetails.jsx";
import Hotels from "./components/Hotels/pages/Hotels.jsx";
import HotelDetails from "./components/Hotels/pages/HotelDetails.jsx";

const App = () => {
    const [fullHash, setFullHash] = useState(window.location.hash.slice(1) || 'home');

    useEffect(() => {
        const handleHashChange = () => {
            setFullHash(window.location.hash.slice(1) || 'home');
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });
        };

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const rootPage = fullHash.split('?')[0];

    let hotelId = null;
    if (rootPage === 'hotel-details') {
        const params = new URLSearchParams(fullHash.split('?')[1]);
        hotelId = params.get('id');
    }

    const renderPage = () => {
        if (rootPage === 'hotel-details' && hotelId) {
            return <HotelDetails hotelId={hotelId} />;
        }
        if (rootPage === 'hotels') {
            return <Hotels />;
        }
        if (rootPage === 'home') {
            return <Home />;
        }
        if (rootPage === 'about') {
            return <AboutPage />;
        }
        if (rootPage === 'weather-details') {
            return <WeatherDetails />;
        }
        return <Home />;
    }

    return (
        <div>
            <Navbar />
            {renderPage()}
        </div>
    );
}

export default App;