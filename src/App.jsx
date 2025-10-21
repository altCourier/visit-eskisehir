import Navbar from './components/layout/Navbar';
import Hero from './components/Home/Hero.jsx';
import LandmarkCollage from "./components/Home/LandmarkCollage.jsx";
import Mapping from "./components/Home/Mapping.jsx";
import React, { useRef, useCallback } from "react";
import WikipediaAbout from "./components/Home/WikipediaAbout.jsx";


const App = () => {

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
            <Navbar />
            <Hero onExploreClick={handleExploreClick} />
            <LandmarkCollage ref = {landmarkCollageRef}/>
            <Mapping />
            <WikipediaAbout topic = "Eskişehir"/>
        </>
    );
}

export default App;