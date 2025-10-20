import Navbar from './components/layout/Navbar';
import Hero from './components/Hero';
import LandmarkCollage from "./components/LandmarkCollage.jsx";
import Mapping from "./components/Mapping";
import React, { useRef, useCallback } from "react";
import WikipediaAbout from "./components/WikipediaAbout";


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