
// import Navbar from '../layout/Navbar';

import Hero from '../Home/Hero.jsx';
import LandmarkCollage from "../Home/LandmarkCollage.jsx";
import Mapping from "../Home/Mapping.jsx";
import WikipediaAbout from "../Home/WikipediaAbout.jsx";
import Weather from "../Weather/Weather.jsx";
import Button from "../common/Button.jsx";
import {useCallback, useRef} from "react";
import IntroHotels from "../Home/IntroHotels.jsx";
import CurrencyConverter from "../Home/CurrencyConverter.jsx";

const Home = () => {

    const landmarkCollageRef = useRef(null);

    const handleExploreClick = useCallback(
        () => {
            if (landmarkCollageRef.current) {
                landmarkCollageRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
            }
        }, []
    );

    return (
        <>
            <Hero onExploreClick={handleExploreClick} />
            <LandmarkCollage ref = {landmarkCollageRef}/>
            <Mapping />
            <WikipediaAbout topic = "Eskişehir"/>
            <IntroHotels />
            <Weather/>
            <CurrencyConverter />
        </>
    );
}

export default Home;